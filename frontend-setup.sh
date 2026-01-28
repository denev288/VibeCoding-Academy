#!/usr/bin/env bash
set -euo pipefail

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required but not found. Install Docker and try again."
  exit 1
fi

docker compose up -d frontend

if [ ! -f frontend/package.json ]; then
  echo "Creating Next.js project..."
  docker compose exec frontend npx create-next-app@latest . --ts --eslint --app --src-dir --no-tailwind --import-alias "@/*"
fi

mkdir -p frontend/src/app

cp -f templates/frontend/src/app/page.tsx frontend/src/app/page.tsx
cp -f templates/frontend/.env.local.example frontend/.env.local.example

echo "Next.js setup complete. Copy frontend/.env.local.example to frontend/.env.local if needed."
