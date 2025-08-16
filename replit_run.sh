#!/usr/bin/env bash
set -euo pipefail

echo "🔧 Bootstrapping Cashere v0.5 (API + Web)..."

# Ensure npm deps
if [ ! -d "node_modules" ]; then
  echo "📦 Installing root deps..."
  npm install
fi

# Ensure envs exist
[ -f apps/api/.env ] || cp apps/api/.env.example apps/api/.env
[ -f apps/web/.env.local ] || cp apps/web/.env.example apps/web/.env.local

# Print helpful info
echo ""
echo "🌐 Web:  http://localhost:${PORT:-3000}"
echo "🔌 API:  http://localhost:${API_PORT:-4000}"
echo "🛠  Tip: Edit apps/web/app/page.tsx, apps/web/app/admin/page.tsx, and packages/ui/* for UX changes."
echo ""

# Start API + Web concurrently (without extra deps)
( npm --workspace=apps/api run start:dev & echo $! > .api.pid )
( npm --workspace=apps/web run dev & echo $! > .web.pid )

# Tail the processes
trap 'echo "⛔ Stopping"; kill $(cat .api.pid .web.pid) 2>/dev/null || true; exit 0' SIGINT SIGTERM
wait
