#!/usr/bin/env bash
# ==============================================================================
# SCRIPT 02: BUILD FRONTEND, PM2 BACKEND (PORT 5030) & NGINX CONFIGURATION
# Run: sudo bash deployment/02_deploy_app.sh
# ==============================================================================

set -e

DOMAIN="srcars.gemshine.tech"
PORT=5030
WEB_ROOT="/var/www/${DOMAIN}"
PROJECT_DIR="$(pwd)"

echo "===================================================================="
echo "🚀 Step 2: Deploying Car Care Application for ${DOMAIN}"
echo "===================================================================="

# 1. System packages
sudo apt-get update -y
sudo apt-get install -y curl wget git nginx certbot python3-certbot-nginx

# 2. Check / Install Node.js LTS (v20)
if ! command -v node &> /dev/null; then
    echo "📥 Installing Node.js LTS (v20.x)..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# 3. Check / Install PM2
if ! command -v pm2 &> /dev/null; then
    echo "⚙️ Installing PM2 globally..."
    sudo npm install -g pm2
fi

# 4. Install dependencies
echo "📦 Installing root dependencies..."
npm install

echo "📦 Installing server dependencies..."
cd server
npm install
cd ..

# 5. Build frontend
echo "🏗️ Compiling production frontend bundle (npm run build)..."
npm run build

# 6. Copy frontend to web root
echo "📂 Setting up web directory ${WEB_ROOT}..."
sudo mkdir -p "${WEB_ROOT}"
sudo cp -r dist "${WEB_ROOT}/"
sudo chown -R www-data:www-data "${WEB_ROOT}"
sudo chmod -R 755 "${WEB_ROOT}"

# 7. Configure Environment for Backend
mkdir -p logs
if [ ! -f "server/.env" ]; then
    echo "Creating server/.env from deployment/.env.production..."
    cp deployment/.env.production server/.env
fi

# 8. Start / Reload with PM2 on Port 5030
echo "⚡ Starting Node.js backend on Port ${PORT} with PM2..."
pm2 startOrReload ecosystem.config.cjs --env production
pm2 save

# 9. Configure Nginx
echo "🌐 Configuring Nginx reverse proxy..."
NGINX_CONF="/etc/nginx/sites-available/${DOMAIN}"

sudo cp deployment/nginx_srcars.gemshine.tech.conf "${NGINX_CONF}"
sudo ln -sf "${NGINX_CONF}" "/etc/nginx/sites-enabled/${DOMAIN}"

if [ -f "/etc/nginx/sites-enabled/default" ]; then
    sudo rm -f "/etc/nginx/sites-enabled/default"
fi

sudo nginx -t
sudo systemctl reload nginx

echo "===================================================================="
echo "🎉 Frontend and Backend successfully deployed!"
echo "🌐 Web URL:     http://${DOMAIN}"
echo "⚡ Backend API: http://127.0.0.1:${PORT}/api/health"
echo "===================================================================="
