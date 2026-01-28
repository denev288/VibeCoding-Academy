#!/usr/bin/env bash
set -euo pipefail

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required but not found. Install Docker and try again."
  exit 1
fi

docker compose up -d --build

./laravel-setup.sh
./frontend-setup.sh

echo "Frontend: http://localhost:8200"
echo "Backend:  http://localhost:8201"
echo "API:      http://localhost:8201/api/status"
