#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

if [ -z "${VERCEL_TOKEN:-}" ]; then
  echo "VERCEL_TOKEN is not set."
  echo "Add it as a secret, then re-run: ./scripts/deploy.sh"
  echo "Meanwhile the Cloudflare tunnel demo URL is in the PR description."
  exit 1
fi

echo "Installing Vercel CLI..."
npx --yes vercel@latest --version >/dev/null

echo "Deploying production..."
npx --yes vercel@latest deploy --prod --yes --token "$VERCEL_TOKEN"
