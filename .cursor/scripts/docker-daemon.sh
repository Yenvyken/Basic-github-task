#!/usr/bin/env bash
# Ensure a Docker daemon is configured for this nested Cloud Agent VM and running.
#
# Cloud Agent VMs are themselves containers, so Docker's default overlayfs
# storage driver cannot mount its snapshots. We fall back to fuse-overlayfs,
# which works with the /dev/fuse device exposed to the VM. There is also no
# systemd, so the daemon is launched directly and detached.
set -euo pipefail

DAEMON_JSON=/etc/docker/daemon.json

sudo mkdir -p /etc/docker
if [ ! -f "$DAEMON_JSON" ] || ! grep -q fuse-overlayfs "$DAEMON_JSON"; then
  echo '{
  "storage-driver": "fuse-overlayfs",
  "features": { "containerd-snapshotter": false }
}' | sudo tee "$DAEMON_JSON" >/dev/null
fi

if sudo docker info >/dev/null 2>&1; then
  exit 0
fi

echo "Starting Docker daemon..."
sudo rm -f /var/run/docker.pid
sudo sh -c 'nohup dockerd </dev/null >/var/log/dockerd.log 2>&1 &'

for _ in $(seq 1 30); do
  if sudo docker info >/dev/null 2>&1; then
    echo "Docker daemon ready."
    exit 0
  fi
  sleep 2
done

echo "Docker daemon failed to start. Recent log:" >&2
sudo tail -n 30 /var/log/dockerd.log >&2 || true
exit 1
