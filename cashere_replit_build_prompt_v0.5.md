# Cashere™ MVP on Replit — Build Guide & AI Agent Prompt (v0.5)

**New vs v0.4:** Trust, Moderation, Zones, Analytics, Admin `/admin`

## Boot
```
npm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
npm run dev:api
npm run dev:web
```
(Optional mobile: `cp apps/mobile/.env.example apps/mobile/.env` then `npm run dev:mobile`)

## Keys
- `AUTO_ACCEPT_MS` (default 60000) — auto‑capture after pickup
- `LOCKER_PROVIDER=virtual|ttlock` — TTLock is a stub
- `STRIPE_SECRET_KEY` — real Stripe test if set
- `WEB_ORIGIN` — allowlist origins

## Demo
- Create sample listing → Buy (demo) → locker reserve (nearest ATL zone) + auto‑open (dev)
- Orders: inspection, accept, dispute
- Payouts: onboarding + status
- Titles: snapshot + anchor
- Share links: Copy FB Link + View Stats
- Admin: moderation queue, zones, orders, trust, analytics

## Replit AI Agent Prompt
```
You are my senior full‑stack engineer. Repo: Cashere v0.5 (apps/api, apps/web, apps/mobile).
Goal: Run API/Web, validate listing→order→locker→auto‑accept, test moderation/disputes/payouts/trust/analytics/zones, and open /admin.

Steps
1) Install root deps, set envs from examples.
2) Start API (:4000) and Web (:3000).
3) Create listing, run Buy (demo), confirm zone + token alert.
4) In Orders, test Inspection/Accept/Dispute. Verify seller trust updates.
5) Use Payouts card (mock without Stripe key) and Title viewer.
6) Generate a share link and view its stats.
7) Open /admin and approve/reject moderation items, review zones and analytics.
```
