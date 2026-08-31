#!/usr/bin/env bash
#
# Per-boot startup: bring up the MariaDB daemon that WordPress needs.
# Idempotent — safe to run when MariaDB is already running. The WordPress
# dev server itself runs in the "wordpress" terminal (see environment.json).
set -euo pipefail

echo "==> Starting MariaDB"
sudo service mariadb start || true

echo "==> Waiting for MariaDB to accept connections"
for _ in $(seq 1 30); do
  if sudo mysqladmin ping >/dev/null 2>&1; then
    echo "MariaDB is ready"
    exit 0
  fi
  sleep 1
done

echo "MariaDB did not become ready in time" >&2
exit 1
