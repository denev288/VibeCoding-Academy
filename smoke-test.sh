#!/usr/bin/env bash
set -euo pipefail

API_BASE=${API_BASE:-http://localhost:8201}
EMAIL=${EMAIL:-ivan@admin.local}
PASSWORD=${PASSWORD:-password}
COOKIE_JAR=${COOKIE_JAR:-/tmp/vibecode_cookies.txt}

if ! command -v curl >/dev/null 2>&1; then
  echo "curl is required but not found."
  exit 1
fi

rm -f "$COOKIE_JAR"

printf "[1/3] Fetch CSRF cookie... "
curl -sS -i -c "$COOKIE_JAR" "$API_BASE/sanctum/csrf-cookie" >/dev/null
printf "ok\n"

XSRF_TOKEN=$(awk '$6=="XSRF-TOKEN" {print $7}' "$COOKIE_JAR" | tail -n 1)
if [ -z "$XSRF_TOKEN" ]; then
  echo "Failed to read XSRF-TOKEN cookie."
  exit 1
fi

XSRF_DECODED=$(printf '%b' "${XSRF_TOKEN//%/\\x}")

printf "[2/3] Login as %s... " "$EMAIL"
LOGIN_RES=$(curl -sS -i -b "$COOKIE_JAR" -c "$COOKIE_JAR" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Origin: http://localhost:8200" \
  -H "Referer: http://localhost:8200" \
  -H "X-XSRF-TOKEN: $XSRF_DECODED" \
  -X POST "$API_BASE/login" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

if echo "$LOGIN_RES" | grep -q "HTTP/1.1 204"; then
  printf "ok\n"
else
  printf "failed\n"
  echo "$LOGIN_RES"
  exit 1
fi

printf "[3/3] Fetch /api/user... "
USER_JSON=$(curl -sS -b "$COOKIE_JAR" \
  -H "Accept: application/json" \
  -H "Origin: http://localhost:8200" \
  -H "Referer: http://localhost:8200" \
  "$API_BASE/api/user")

if echo "$USER_JSON" | grep -q '"email"'; then
  printf "ok\n"
  echo "User: $USER_JSON"
else
  printf "failed\n"
  echo "Response: $USER_JSON"
  exit 1
fi

printf "Smoke test passed.\n"
