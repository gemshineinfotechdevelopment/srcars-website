#!/usr/bin/env bash
# ==============================================================================
# 🏎️ CAR CARE LUXURY DETAILING - ALL-IN-ONE AUTOMATED VPS DEPLOYMENT
# Subdomain: srcars.gemshine.tech | Port: 5030 | Database: MongoDB
# 
# Run on your VPS:
#   sudo bash deploy.sh
# ==============================================================================

set -e

DOMAIN="srcars.gemshine.tech"
PORT=5030
PROJECT_DIR="$(pwd)"
WEB_ROOT="/var/www/${DOMAIN}"

echo "========================================================================"
echo "🚀 STARTING ALL-IN-ONE DEPLOYMENT FOR ${DOMAIN}"
echo "⚡ Backend Node.js Port: ${PORT}"
echo "💾 Database: MongoDB Community Edition (Port 27017)"
echo "📂 Project Directory:    ${PROJECT_DIR}"
echo "========================================================================"

# ------------------------------------------------------------------------------
# STEP 1: SYSTEM PACKAGES & PREREQUISITES
# ------------------------------------------------------------------------------
echo ""
echo "📦 [1/7] Updating system packages & installing tools..."
sudo apt-get update -y
sudo apt-get install -y gnupg curl wget git ca-certificates lsb-release nginx certbot python3-certbot-nginx

# ------------------------------------------------------------------------------
# STEP 2: INSTALL NODE.JS (v20 LTS) & PM2
# ------------------------------------------------------------------------------
echo ""
echo "⚙️ [2/7] Checking Node.js and PM2..."
if ! command -v node &> /dev/null; then
    echo "📥 Installing Node.js LTS (v20.x)..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi
echo "✅ Node.js: $(node -v)"
echo "✅ NPM:     $(npm -v)"

if ! command -v pm2 &> /dev/null; then
    echo "⚙️ Installing PM2 process manager globally..."
    sudo npm install -g pm2
fi
echo "✅ PM2:     $(pm2 -v)"

# ------------------------------------------------------------------------------
# STEP 3: INSTALL & CONFIGURE MONGODB
# ------------------------------------------------------------------------------
echo ""
echo "💾 [3/7] Setting up MongoDB on VPS..."
if ! command -v mongod &> /dev/null; then
    UBUNTU_CODENAME=$(lsb_release -cs)
    curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
       sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor --yes

    if [ "$UBUNTU_CODENAME" = "noble" ]; then
        echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
    else
        echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu ${UBUNTU_CODENAME}/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
    fi

    sudo apt-get update -y
    sudo apt-get install -y mongodb-org
fi

sudo systemctl daemon-reload
sudo systemctl enable mongod
sudo systemctl restart mongod
echo "✅ MongoDB is running on port 27017."

# ------------------------------------------------------------------------------
# STEP 4: INSTALL DEPENDENCIES & CONFIGURE SERVER ENV
# ------------------------------------------------------------------------------
echo ""
echo "📦 [4/7] Installing project dependencies..."
npm install

cd server
npm install
cd ..

mkdir -p logs

# Ensure production environment file
if [ ! -f "server/.env" ]; then
    echo "Creating server/.env with Port ${PORT}..."
    cat <<EOF > server/.env
PORT=${PORT}
NODE_ENV=production
MONGODB_URI=mongodb://127.0.0.1:27017/car_care
APP_URL=https://${DOMAIN}
EOF
else
    # Update PORT if existing
    sed -i "s/^PORT=.*/PORT=${PORT}/" server/.env || echo "PORT=${PORT}" >> server/.env
fi

# ------------------------------------------------------------------------------
# STEP 5: BUILD FRONTEND
# ------------------------------------------------------------------------------
echo ""
echo "🏗️ [5/7] Compiling production frontend bundle..."
npm run build

echo "📂 Publishing files to ${WEB_ROOT}..."
sudo mkdir -p "${WEB_ROOT}"
sudo cp -r dist "${WEB_ROOT}/"
sudo chown -R www-data:www-data "${WEB_ROOT}"
sudo chmod -R 755 "${WEB_ROOT}"

# ------------------------------------------------------------------------------
# STEP 6: START / RELOAD BACKEND WITH PM2
# ------------------------------------------------------------------------------
echo ""
echo "⚡ [6/7] Launching Node.js backend on Port ${PORT} with PM2..."
pm2 startOrReload ecosystem.config.cjs --env production
pm2 save

# ------------------------------------------------------------------------------
# STEP 7: CONFIGURE NGINX REVERSE PROXY
# ------------------------------------------------------------------------------
echo ""
echo "🌐 [7/7] Configuring Nginx reverse proxy for ${DOMAIN}..."

NGINX_CONF="/etc/nginx/sites-available/${DOMAIN}"

sudo tee "${NGINX_CONF}" > /dev/null <<'NGINX_EOF'
upstream carcare_backend {
    server 127.0.0.1:5030;
    keepalive 64;
}

server {
    listen 80;
    listen [::]:80;
    server_name srcars.gemshine.tech;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    root /var/www/srcars.gemshine.tech/dist;
    index index.html;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml image/svg+xml;

    client_max_body_size 25M;

    # API Reverse Proxy to Port 5030
    location /api/ {
        proxy_pass http://carcare_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static Assets Caching
    location ~* \.(?:ico|css|js|gif|jpe?g|png|webp|svg|woff2?|ttf|mp4|webm)$ {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000, immutable";
        access_log off;
        try_files $uri =404;
    }

    # SPA Routing Fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
NGINX_EOF

sudo ln -sf "${NGINX_CONF}" "/etc/nginx/sites-enabled/${DOMAIN}"

# Remove default site if present
if [ -f "/etc/nginx/sites-enabled/default" ]; then
    sudo rm -f "/etc/nginx/sites-enabled/default"
fi

sudo nginx -t
sudo systemctl reload nginx

# ------------------------------------------------------------------------------
# OPTIONAL: SSL SETUP WITH CERTBOT
# ------------------------------------------------------------------------------
echo ""
echo "========================================================================"
echo "🎉 APPLICATION DEPLOYED SUCCESSFULLY!"
echo "------------------------------------------------------------------------"
echo "🌐 Web URL:      http://${DOMAIN}"
echo "⚡ Backend API:  http://127.0.0.1:${PORT}/api/health"
echo "📊 PM2 Status:   pm2 status"
echo "📋 PM2 Logs:     pm2 logs car-care-app"
echo ""
echo "🔒 To activate free HTTPS / SSL certificate with Let's Encrypt, run:"
echo "   sudo certbot --nginx -d ${DOMAIN}"
echo "========================================================================"
