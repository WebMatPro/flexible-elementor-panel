#!/usr/bin/env bash
#
# Idempotent setup for a local WordPress + Elementor site that hosts this
# plugin. Installs system packages, downloads WordPress core, provisions a
# database, installs & activates Elementor, and symlinks + activates this
# plugin. Safe to run repeatedly.
set -euo pipefail

# Resolve the repository root (this script lives in <repo>/.cursor/).
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

WP_DIR="${WP_DIR:-$HOME/wordpress}"
WP_PORT="${WP_PORT:-8080}"
WP_URL="http://localhost:${WP_PORT}"
PLUGIN_SLUG="flexible-elementor-panel"

DB_NAME="wordpress"
DB_USER="wp"
DB_PASS="wp"

echo "==> Installing system packages (php, mariadb, tools)"
export DEBIAN_FRONTEND=noninteractive
sudo apt-get update -y
sudo apt-get install -y --no-install-recommends \
  php-cli php-mysql php-gd php-curl php-mbstring php-xml php-zip php-intl php-bcmath php-imagick \
  mariadb-server mariadb-client curl less

if ! command -v wp >/dev/null 2>&1; then
  echo "==> Installing WP-CLI"
  curl -sSL -o /tmp/wp-cli.phar https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
  chmod +x /tmp/wp-cli.phar
  sudo mv /tmp/wp-cli.phar /usr/local/bin/wp
fi

echo "==> Starting MariaDB (for setup)"
sudo service mariadb start
for _ in $(seq 1 30); do sudo mysqladmin ping >/dev/null 2>&1 && break; sleep 1; done

echo "==> Ensuring database and user exist"
sudo mysql -e "CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;"

echo "==> Preparing WordPress at ${WP_DIR}"
mkdir -p "$WP_DIR"
cd "$WP_DIR"

if [ ! -f "$WP_DIR/wp-load.php" ]; then
  wp core download --allow-root
fi

if [ ! -f "$WP_DIR/wp-config.php" ]; then
  wp config create --dbname="$DB_NAME" --dbuser="$DB_USER" --dbpass="$DB_PASS" \
    --dbhost=127.0.0.1 --skip-check --allow-root
  wp config set WP_DEBUG true --raw --type=constant --allow-root
  wp config set WP_DEBUG_LOG true --raw --type=constant --allow-root
  wp config set WP_DEBUG_DISPLAY false --raw --type=constant --allow-root
fi

if ! wp core is-installed --allow-root 2>/dev/null; then
  wp core install --url="$WP_URL" --title="FEP Dev Site" \
    --admin_user=admin --admin_password=admin --admin_email=admin@example.com \
    --skip-email --allow-root
fi

wp option update siteurl "$WP_URL" --allow-root
wp option update home "$WP_URL" --allow-root

echo "==> Installing/activating Elementor"
if ! wp plugin is-installed elementor --allow-root; then
  wp plugin install elementor --allow-root
fi
wp plugin activate elementor --allow-root

echo "==> Linking and activating this plugin (${PLUGIN_SLUG})"
ln -sfn "$REPO_DIR" "$WP_DIR/wp-content/plugins/$PLUGIN_SLUG"
wp plugin activate "$PLUGIN_SLUG" --allow-root

echo "==> Writing PHP built-in server router"
cat > "$WP_DIR/router.php" <<'PHP'
<?php
// Router for PHP built-in server to serve WordPress (dev only).
// Uses the lexical request path (not realpath) so files under symlinked
// plugins in wp-content/plugins are served even when the symlink target
// lives outside the docroot.
$root = __DIR__;
$uri  = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
if (strpos($uri, '..') === false) {
    $path = $root . $uri;
    if ($uri !== '/' && is_file($path)) {
        return false;
    }
    if ($uri !== '/' && is_dir($path) && is_file(rtrim($path, '/') . '/index.php')) {
        require rtrim($path, '/') . '/index.php';
        return true;
    }
}
require $root . '/index.php';
PHP

echo "==> Ensuring an Elementor-enabled demo page exists"
if ! wp post list --post_type=page --field=ID --allow-root 2>/dev/null | grep -q .; then
  PAGE_ID="$(wp post create --post_type=page --post_title="FEP Test Page" \
    --post_status=publish --porcelain --allow-root)"
  wp post meta update "$PAGE_ID" _elementor_edit_mode builder --allow-root
  wp post meta update "$PAGE_ID" _elementor_template_type wp-page --allow-root
fi

echo "==> Setup complete. Installed plugins:"
wp plugin list --allow-root
