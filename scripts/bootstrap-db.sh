#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -f .env ]; then
  cp .env.example .env
fi

# Ensure DATABASE_URL exists for Prisma
if ! grep -q '^DATABASE_URL=' .env; then
  echo 'DATABASE_URL="file:./dev.db"' >> .env
fi

npx prisma migrate deploy
npm run db:seed
