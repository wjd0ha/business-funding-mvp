# Bizfit 사업기회 레이더 (프리뷰 브랜치)

운영 사이트와 별개의 `feature/opportunity-radar` 브랜치입니다. 기존 `business-funding-mvp`의 Next.js 화면을 재사용하고, `bizfit-start-finder`의 `alert_*` 테이블과 기업마당 크롤러를 연결합니다.

## 기능

- 6단계 사업정보 진단 → 지역·업종·업력·관심분야 규칙 매칭
- 공고 원문 링크·저장·행동 이벤트
- 이메일과 선택적 마케팅 동의를 분리한 리드 신청
- Supabase Auth + `start_finder_admins` 권한 기반 CRM
- 신규 고관련도·저장 공고 D-7/D-3·월요일 주간 요약 큐와 이메일 발송 함수

## 개발 설정

`.env.example`을 참고해 **개발용 Supabase 브랜치** URL과 publishable key를 `.env.local`에 설정하세요. 서비스 역할 키는 브라우저나 Vercel 환경변수에 넣지 않습니다.

```sh
npm ci
npm run dev
```

공식 수집 데이터가 없으면 예시 화면을 표시하고 알림 신청을 막습니다. 기존 22건의 `source=sample` 공고는 실공고로 취급하지 않습니다.

## 배포 전 확인

1. Supabase 개발 브랜치에 `supabase/migrations/*_opportunity_radar_v1.sql` 적용, RLS·매칭·해지 기능 검증.
2. `bizinfo-crawler`의 같은 이름 브랜치에 개발 DB의 `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`를 GitHub Actions secret으로 등록하고 수동 1회 수집. 운영 크롤러의 기본 브랜치는 변경하지 않습니다.
3. 개발 DB의 `start_finder_admins`에 실제 운영자 Auth 사용자 ID만 등록해 CRM 접근 확인.
4. Resend 발신 도메인 인증 후 개발 브랜치 Edge Function에 `RESEND_API_KEY`, `ALERT_FROM_EMAIL`, `APP_URL` secret 설정. 발송키가 없으면 dry-run만 수행합니다.
5. Edge Function을 JWT 검증 켜고 배포한 뒤 개발 브랜치에서 스케줄 호출 설정. 운영 프로젝트로 merge하지 않습니다.
6. Vercel **별도 Preview 배포**에 개발 DB의 publishable key만 연결하고, 진단→리드→저장→CRM→알림 검증.

공고 조건은 제목·요약에서 추정될 수 있으므로 신청 자격은 기관 원문을 다시 확인해야 합니다.
