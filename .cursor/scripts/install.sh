#!/usr/bin/env bash
# Idempotent dependency setup for the Odoo 19 Cypress E2E environment.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$REPO_ROOT"

# --- System dependencies: Docker engine + fuse-overlayfs ---------------------
if ! command -v docker >/dev/null 2>&1; then
  echo "Installing Docker engine..."
  curl -fsSL https://get.docker.com -o /tmp/get-docker.sh
  sudo sh /tmp/get-docker.sh
fi

if ! command -v fuse-overlayfs >/dev/null 2>&1; then
  echo "Installing fuse-overlayfs..."
  sudo apt-get update -y
  sudo DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends fuse-overlayfs
fi

# --- Node / Cypress dependencies ---------------------------------------------
npm ci
npx cypress verify

# --- Pre-pull container images so the first start is fast ---------------------
"$REPO_ROOT/.cursor/scripts/docker-daemon.sh"
sudo docker compose pull

echo "Install complete."
