#!/usr/bin/env bash
set -euo pipefail
: "${DATABASE_URL:?DATABASE_URL required}"
FILE="$1"
[ -f "$FILE" ] || { echo "file not found: $FILE"; exit 1; }
psql "$DATABASE_URL" < "$FILE"
