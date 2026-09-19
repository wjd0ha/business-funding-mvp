# Bizfit Radar Preview

This branch keeps the original funding self-check and adds the first radar MVP:

- reads active notices from Supabase `alert_notices`
- scores notices against the completed self-check answers
- shows the top matches and their source links
- saves an alert lead to `alert_leads`

## Preview environment variables

Set these for the Preview environment. The publishable key is safe for browser-facing use; never add a Supabase service-role key to this project.

```env
NEXT_PUBLIC_SUPABASE_URL=https://mepdukfofljkhllpcsna.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

The current Supabase project already contains active notice data and RLS policies for public notice reads and lead inserts. No schema migration is required for this MVP.

## Preview deployment

Connect this branch to the separate Vercel project `bizfit-radar-preview`, add the two variables to the Preview scope, and redeploy. Production is intentionally not changed by this branch.
