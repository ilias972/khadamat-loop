#!/usr/bin/env bash
set -euo pipefail
: "${DATABASE_URL:?DATABASE_URL required}"
BACKUP_DIR="${BACKUP_DIR:-./backups}"
mkdir -p "$BACKUP_DIR"
STAMP="$(date +%Y%m%d_%H%M%S)"
pg_dump "$DATABASE_URL" > "$BACKUP_DIR/backup_${STAMP}.sql"
echo "Backup: $BACKUP_DIR/backup_${STAMP}.sql"
