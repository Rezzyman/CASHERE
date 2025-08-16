# Cashere v0.5 — Replit Ready

One-click: press **Run**. Replit will:
- install deps (first run),
- ensure env files,
- start **API :4000** and **Web :3000**.

## If you need to run manually
```
npm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
npm --workspace=apps/api run start:dev &
npm --workspace=apps/web run dev
```

## Feature checklist (v0.5)
- Trust scoring updates on Accept/Dispute
- Moderation queue (keywords + velocity)
- ATL zones + nearest locker assignment
- Cross-post share links & click stats
- Admin console: `/admin`
- Titles with snapshot + mock Merkle anchor
- Payouts (Stripe Connect mock unless key set)

## Edit for UX
- `apps/web/app/page.tsx`
- `apps/web/app/admin/page.tsx`
- `packages/ui/src/*`
