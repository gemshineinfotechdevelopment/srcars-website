#!/usr/bin/env bash
# ==============================================================================
# CAR CARE - MONGODB VPS INSTALLATION & CONFIGURATION SCRIPT
# Supported OS: Ubuntu 20.04 / 22.04 / 24.04 LTS
# Run on VPS as root or with sudo: sudo bash scripts/setup_mongodb.sh
# ==============================================================================

set -e

echo "========================================================"
echo "🚀 Installing MongoDB Community Edition on VPS..."
echo "========================================================"

# 1. Update package index and install prerequisites
sudo apt-get update -y
sudo apt-get install -y gnupg curl wget ca-certificates lsb-release

# 2. Detect Ubuntu Codename
UBUNTU_CODENAME=$(lsb_release -cs)
echo "Detected Ubuntu Release: ${UBUNTU_CODENAME}"

# 3. Import MongoDB Public GPG Key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor --yes

# 4. Add MongoDB Repository
if [ "$UBUNTU_CODENAME" = "noble" ]; then
    # Ubuntu 24.04 fallback to jammy if noble repo is pending
    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
else
    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu ${UBUNTU_CODENAME}/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
fi

# 5. Reload package database and install MongoDB
sudo apt-get update -y
sudo apt-get install -y mongodb-org

# 6. Enable and Start MongoDB Service
echo "Starting & enabling mongod service..."
sudo systemctl daemon-reload
sudo systemctl enable mongod
sudo systemctl restart mongod

# 7. Check MongoDB Service Status
if systemctl is-active --quiet mongod; then
    echo "✅ MongoDB is running and active on port 27017!"
else
    echo "⚠️ MongoDB service failed to start. Checking status..."
    sudo systemctl status mongod
    exit 1
fi

# 8. Create local database 'car_care' & verify connection
echo "Verifying database connection..."
mongosh --eval "use car_care; db.stats();"

echo "========================================================"
echo "🎉 MongoDB setup complete!"
echo "Connection URI for server/.env:"
echo "MONGODB_URI=mongodb://127.0.0.1:27017/car_care"
echo "========================================================"
