-- Bizfit 사업기회 레이더 v1
-- 기존 alert_* 구조를 보존하면서 관리자 CRM, 안전한 단일 리드 매칭,
-- 중복 방지 알림 큐를 추가한다.

create schema if not exists private;

alter table public.alert_leads drop constraint if exists alert_leads_status_check;
alter table public.alert_leads
  add constraint alert_leads_status_check
  check (status in ('active', 'reviewing', 'contacted', 'closed', 'unsubscribed', 'bounced'));

alter table public.alert_notifications
  add column if not exists dedupe_key text;

alter table public.alert_notifications drop constraint if exists alert_notifications_status_check;
alter table public.alert_notifications
  add constraint alert_notifications_status_check
  check (status in ('draft', 'sending', 'sent', 'failed', 'skipped'));

create unique index if not exists alert_notifications_dedupe_key_idx
  on public.alert_notifications (dedupe_key)
  where dedupe_key is not null;

create index if not exists alert_notices_active_end_idx
  on public.alert_notices (is_active, apply_end);
create index if not exists alert_leads_created_idx
  on public.alert_leads (created_at desc);
create index if not exists alert_events_created_idx
  on public.alert_events (created_at desc);
create index if not exists alert_matches_notice_idx
  on public.alert_matches (notice_id, score desc);

-- 기존의 무조건 허용 anon INSERT는 다른 리드의 저장 목록을 조작할 수 있다.
-- 저장은 아래 세션 검증 RPC만 통과하도록 제한한다.
drop policy if exists "public saves notices" on public.alert_saved_notices;
revoke insert on public.alert_saved_notices from anon;

create or replace function private.is_alert_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.start_finder_admins a
    where a.user_id = (select auth.uid())
  );
$$;

revoke all on function private.is_alert_admin() from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.is_alert_admin() to authenticated;

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'alert_leads', 'alert_notices', 'alert_matches', 'alert_saved_notices',
    'alert_events', 'alert_notifications'
  ]
  loop
    execute format('drop policy if exists "admins read %1$s" on public.%1$I', table_name);
    execute format(
      'create policy "admins read %1$s" on public.%1$I for select to authenticated using ((select private.is_alert_admin()))',
      table_name
    );
  end loop;
end $$;

drop policy if exists "admins update leads" on public.alert_leads;
create policy "admins update leads"
on public.alert_leads for update to authenticated
using ((select private.is_alert_admin()))
with check ((select private.is_alert_admin()));

grant select on public.alert_leads, public.alert_notices, public.alert_matches,
  public.alert_saved_notices, public.alert_events, public.alert_notifications
  to authenticated;
grant update (status) on public.alert_leads to authenticated;

create or replace function public.alert_unsubscribe(p_token uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare affected integer;
begin
  update public.alert_leads
  set status = 'unsubscribed', unsubscribed_at = now(),
    alert_new = false, alert_weekly = false, alert_d7 = false, alert_d3 = false
  where unsubscribe_token = p_token and status <> 'unsubscribed';
  get diagnostics affected = row_count;
  return affected > 0;
end;
$$;
revoke all on function public.alert_unsubscribe(uuid) from public, authenticated;
grant execute on function public.alert_unsubscribe(uuid) to anon;

create or replace function public.alert_match_lead(p_lead_id uuid, p_session_id text)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare affected integer := 0;
begin
  if not exists (
    select 1 from public.alert_leads l
    where l.id = p_lead_id
      and l.session_id = p_session_id
      and l.created_at > now() - interval '30 minutes'
  ) then
    raise exception 'invalid lead session';
  end if;

  with base as (
    select l.id as lead_id, l.business_status as st, l.region, l.industry,
      case when l.open_date is null then null
        else (extract(year from age(current_date, l.open_date)) * 12 + extract(month from age(current_date, l.open_date))) / 12.0 end as yrs,
      case when l.interests = '{}' or '잘 모르겠음' = any(l.interests) then null else l.interests end as wanted,
      n.*
    from public.alert_leads l
    cross join public.alert_notices n
    where l.id = p_lead_id and l.status = 'active' and n.is_active and n.source <> 'sample'
      and l.business_status = any(n.target_status)
      and ('전국' = any(n.regions) or l.region = any(n.regions))
      and ('all' = any(n.industries) or l.industry = any(n.industries))
      and (n.notice_type = 'expected' or n.apply_end is null or n.apply_end >= current_date)
  ), scored as (
    select *, (wanted is null or (array[category] || also_categories) && wanted) as interest_hit
    from base
    where yrs is null or ((max_years is null or yrs <= max_years) and (min_years is null or yrs >= min_years))
  ), final as (
    select lead_id, id as notice_id,
      40
      + case when wanted is not null and interest_hit then 25 else 0 end
      + case when '전국' = any(regions) then 8 else 15 end
      + case when 'all' = any(industries) then 0 else 12 end
      + case when yrs is not null and (max_years is not null or min_years is not null) then 8 else 0 end as score,
      array_remove(array[
        case when wanted is not null and interest_hit then '관심분야 일치 · ' || category end,
        case when '전국' = any(regions) then '전국 대상' else '지역 일치 · ' || region end,
        case when not ('all' = any(industries)) then '업종 조건 일치' end,
        case when yrs is not null and (max_years is not null or min_years is not null) then '업력 조건 일치' end
      ], null) as reasons,
      check_note, yrs, max_years, min_years, st
    from scored
    where notice_type = 'confirmed' or interest_hit
  )
  insert into public.alert_matches (lead_id, notice_id, score, fit, reasons)
  select lead_id, notice_id, least(score, 98),
    case when score >= 65 and check_note is null
      and not (yrs is null and st <> 'pre' and (max_years is not null or min_years is not null))
      then 'high' else 'check' end,
    reasons
  from final
  on conflict (lead_id, notice_id) do update
    set score = excluded.score, fit = excluded.fit, reasons = excluded.reasons;

  get diagnostics affected = row_count;
  return affected;
end;
$$;

revoke all on function public.alert_match_lead(uuid, text) from public, authenticated;
grant execute on function public.alert_match_lead(uuid, text) to anon;

create or replace function public.alert_save_notice(p_lead_id uuid, p_notice_id text, p_session_id text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.alert_leads l
    where l.id = p_lead_id and l.session_id = p_session_id and l.status <> 'unsubscribed'
  ) then raise exception 'invalid lead session'; end if;
  insert into public.alert_saved_notices (lead_id, notice_id)
  values (p_lead_id, p_notice_id)
  on conflict do nothing;
  return true;
end;
$$;
revoke all on function public.alert_save_notice(uuid, text, text) from public, authenticated;
grant execute on function public.alert_save_notice(uuid, text, text) to anon;

create or replace function public.queue_alert_notifications(p_today date default current_date)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare affected integer := 0;
begin
  insert into public.alert_notifications (lead_id, kind, notice_ids, subject, dedupe_key)
  select m.lead_id, 'instant', array_agg(m.notice_id order by m.score desc),
    '[비즈핏] 새로운 맞춤 사업기회가 도착했습니다',
    'instant:' || m.lead_id || ':' || p_today
  from public.alert_matches m
  join public.alert_leads l on l.id = m.lead_id and l.status = 'active' and l.alert_new
  join public.alert_notices n on n.id = m.notice_id and n.source <> 'sample' and n.is_active
  where m.fit = 'high' and m.notified_at is null
  group by m.lead_id
  on conflict (dedupe_key) where dedupe_key is not null do nothing;

  insert into public.alert_notifications (lead_id, kind, notice_ids, subject, dedupe_key)
  select s.lead_id,
    case when n.apply_end - p_today = 7 then 'd7' else 'd3' end,
    array[n.id], '[비즈핏] 저장한 공고 마감이 가까워졌습니다',
    'deadline:' || s.lead_id || ':' || n.id || ':' || (n.apply_end - p_today)
  from public.alert_saved_notices s
  join public.alert_leads l on l.id = s.lead_id and l.status = 'active'
  join public.alert_notices n on n.id = s.notice_id and n.is_active and n.source <> 'sample'
  where (n.apply_end - p_today = 7 and l.alert_d7)
     or (n.apply_end - p_today = 3 and l.alert_d3)
  on conflict (dedupe_key) where dedupe_key is not null do nothing;

  if extract(isodow from p_today) = 1 then
    insert into public.alert_notifications (lead_id, kind, notice_ids, subject, dedupe_key)
    select m.lead_id, 'weekly', (array_agg(m.notice_id order by m.score desc))[1:8],
      '[비즈핏] 이번 주 사업기회 요약', 'weekly:' || m.lead_id || ':' || p_today
    from public.alert_matches m
    join public.alert_leads l on l.id = m.lead_id and l.status = 'active' and l.alert_weekly
    join public.alert_notices n on n.id = m.notice_id and n.is_active and n.source <> 'sample'
    where n.notice_type = 'confirmed' and (n.apply_end is null or n.apply_end >= p_today)
    group by m.lead_id
    on conflict (dedupe_key) where dedupe_key is not null do nothing;
  end if;

  get diagnostics affected = row_count;
  return affected;
end;
$$;

revoke all on function public.queue_alert_notifications(date) from public, anon, authenticated;
grant execute on function public.queue_alert_notifications(date) to service_role;

create or replace function public.claim_alert_notifications(p_limit integer default 50)
returns setof public.alert_notifications
language plpgsql
security definer
set search_path = ''
as $$
begin
  return query
  with picked as (
    select n.id from public.alert_notifications n
    where n.status = 'draft'
    order by n.created_at
    limit least(greatest(p_limit, 1), 50)
    for update skip locked
  )
  update public.alert_notifications n
  set status = 'sending'
  from picked
  where n.id = picked.id
  returning n.*;
end;
$$;
revoke all on function public.claim_alert_notifications(integer) from public, anon, authenticated;
grant execute on function public.claim_alert_notifications(integer) to service_role;
