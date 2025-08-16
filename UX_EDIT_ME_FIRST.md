# Cashere v0.5 — UX Edit Me First

Start Replit → it will auto-run `replit_run.sh` and boot both API and Web.

## Where to tweak visuals
- `apps/web/app/page.tsx` — main marketplace UI (listings, orders, payouts, title viewer, share links)
- `apps/web/app/admin/page.tsx` — admin console (moderation queue, zones, trust, analytics)
- `packages/ui/src/*.tsx` — shared UI primitives (Button, Card, Tag, Modal, Table). Easiest place to overhaul styling.
- (Optional) Add your components under `packages/ui/src` and export from `packages/ui/index.ts`.

## Nice-to-have steps for design polish
- Add Tailwind (if desired): install and wire into Next. (Current UI uses inline styles for zero-config.)
- Swap the primitives in `packages/ui` to Tailwind classes or your design system of choice.
- Replace alert()s with toasts/modals.
- Add real images to listings and turn the card grid into a proper gallery.

## Hot reload
Next.js dev server on Replit will live-reload as you edit files in `apps/web`. No restarts needed.
