#!/usr/bin/env bash
# Per-boot startup for the Odoo 19 Cypress E2E environment.
# Brings up Odoo + Postgres, initializes the database on first run, and makes
# `npm run cy:run` work out of the box against http://localhost:8069.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$REPO_ROOT"

DB_NAME=odoo
ODOO_ADMIN_PASSWORD=admin

"$REPO_ROOT/.cursor/scripts/docker-daemon.sh"

echo "Starting Odoo + Postgres containers..."
sudo docker compose up -d

echo "Waiting for Postgres to become healthy..."
for _ in $(seq 1 40); do
  status="$(sudo docker inspect --format '{{.State.Health.Status}}' "$(sudo docker compose ps -q db)" 2>/dev/null || echo starting)"
  [ "$status" = healthy ] && break
  sleep 3
done

# Initialize the Odoo database once (durable state lives in the db volume).
if ! sudo docker compose exec -T db psql -U odoo -lqt 2>/dev/null | cut -d '|' -f1 | tr -d ' ' | grep -qx "$DB_NAME"; then
  echo "Initializing Odoo database '$DB_NAME'..."
  sudo docker compose exec -T odoo odoo -d "$DB_NAME" -i base --stop-after-init \
    --db_host=127.0.0.1 --db_port=5432 --db_user=odoo --db_password=odoo

  echo "Setting admin password..."
  echo "env['res.users'].browse(2).write({'password':'${ODOO_ADMIN_PASSWORD}'}); env.cr.commit()" | \
    sudo docker compose exec -T odoo odoo shell -d "$DB_NAME" --no-http \
      --db_host=127.0.0.1 --db_port=5432 --db_user=odoo --db_password=odoo

  echo "Restarting Odoo to serve the new database..."
  sudo docker compose restart odoo
fi

# Provide local Cypress credentials (gitignored) so `npm run cy:run` just works.
cat > "$REPO_ROOT/cypress.env.json" <<EOF
{
  "ODOO_DB": "${DB_NAME}",
  "ODOO_USERNAME": "admin",
  "ODOO_PASSWORD": "${ODOO_ADMIN_PASSWORD}"
}
EOF

echo "Waiting for Odoo login page..."
for _ in $(seq 1 60); do
  code="$(curl -sS -m 5 -o /dev/null -w '%{http_code}' -L http://localhost:8069/web/login 2>/dev/null || echo 000)"
  if [ "$code" = 200 ]; then
    echo "Odoo is ready at http://localhost:8069 (login: admin / ${ODOO_ADMIN_PASSWORD})."
    exit 0
  fi
  sleep 3
done

echo "Odoo did not become ready in time. Recent logs:" >&2
sudo docker compose logs --tail 40 odoo >&2 || true
exit 1
