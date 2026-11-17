#!/usr/bin/env bash
# ==============================================================================
# CAR CARE LUXURY DETAILING - COMPLETE VPS AUTOMATED DEPLOYMENT SCRIPT
# Subdomain: srcars.gemshine.tech | Port: 5030 | Reverse Proxy: Nginx | Process: PM2
# Run on VPS: bash scripts/deploy.sh
# ==============================================================================

set -e

DOMAIN="srcars.gemshine.tech"
PORT=5030
PROJECT_DIR="$(pwd)"
WEB_ROOT="/var/www/${DOMAIN}"

echo "===================================================================="
echo "🚀 Starting Full Deployment for ${DOMAIN} (Backend Port: ${PORT})"
echo "===================================================================="

# 1. Update APT Packages & Utilities
echo "📦 Step 1: Checking system packages..."
sudo apt-get update -y
sudo apt-get install -y curl wget git nginx certbot python3-certbot-nginx

# 2. Check / Install Node.js (v20+ LTS)
if ! command -v node &> /dev/null; then
    echo "📥 Installing Node.js LTS (v20.x)..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# 3. Check / Install PM2 globally
if ! command -v pm2 &> /dev/null; then
    echo "⚙️ Installing PM2 process manager globally..."
    sudo npm install -g pm2
fi

# 4. Install Project Dependencies
echo "📦 Step 2: Installing frontend and root packages..."
npm install

echo "📦 Step 3: Installing backend server packages..."
cd server
npm install
cd ..

# 5. Build Frontend Application for Production
echo "🏗️ Step 4: Compiling frontend build (Vite + TypeScript)..."
npm run build

# 6. Ensure Web Root & Copy Built Assets
echo "📂 Step 5: Preparing web directory at ${WEB_ROOT}..."
sudo mkdir -p "${WEB_ROOT}"
sudo cp -r dist "${WEB_ROOT}/"
sudo chown -R www-data:www-data "${WEB_ROOT}"
sudo chmod -R 755 "${WEB_ROOT}"

# 7. Start / Reload Node.js Backend with PM2 on Port 5030
echo "⚡ Step 6: Managing backend process with PM2 on Port ${PORT}..."
mkdir -p logs

# Copy production env if not already present
if [ ! -f "server/.env" ]; then
    cp server/.env.production server/.env
fi

pm2 startOrReload ecosystem.config.cjs --env production
pm2 save

# 8. Configure Nginx Reverse Proxy
echo "🌐 Step 7: Configuring Nginx reverse proxy..."
NGINX_CONF="/etc/nginx/sites-available/${DOMAIN}"

sudo cp nginx/srcars.gemshine.tech.conf "${NGINX_CONF}"
sudo ln -sf "${NGINX_CONF}" "/etc/nginx/sites-enabled/${DOMAIN}"

# Remove default site if present
if [ -f "/etc/nginx/sites-enabled/default" ]; then
    sudo rm -f "/etc/nginx/sites-enabled/default"
fi

# 9. Test Nginx Configuration
echo "🔍 Step 8: Testing Nginx syntax..."
sudo nginx -t

# 10. Reload Nginx
echo "🔄 Step 9: Reloading Nginx..."
sudo systemctl reload nginx

echo "===================================================================="
echo "🎉 DEPLOYMENT SUCCESSFUL!"
echo "--------------------------------------------------------------------"
echo "🌐 Subdomain:    http://${DOMAIN}"
echo "⚡ Backend API:  http://127.0.0.1:${PORT}/api/health"
echo "📊 PM2 Status:   pm2 status"
echo ""
echo "🔒 To activate free HTTPS / SSL certificate with Let's Encrypt:"
echo "   sudo certbot --nginx -d ${DOMAIN}"
echo "===================================================================="
