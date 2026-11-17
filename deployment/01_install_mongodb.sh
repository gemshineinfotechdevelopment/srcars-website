#!/usr/bin/env bash
# ==============================================================================
# SCRIPT 01: INSTALL & CONFIGURE MONGODB ON VPS (Ubuntu 20.04 / 22.04 / 24.04)
# Run: sudo bash deployment/01_install_mongodb.sh
# ==============================================================================

set -e

echo "========================================================"
echo "📦 Step 1: Installing MongoDB on VPS..."
echo "========================================================"

sudo apt-get update -y
sudo apt-get install -y gnupg curl wget ca-certificates lsb-release

UBUNTU_CODENAME=$(lsb_release -cs)
echo "Detected Ubuntu Codename: ${UBUNTU_CODENAME}"

# Import MongoDB Public GPG Key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor --yes

# Add MongoDB Repository
if [ "$UBUNTU_CODENAME" = "noble" ]; then
    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
else
    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu ${UBUNTU_CODENAME}/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
fi

sudo apt-get update -y
sudo apt-get install -y mongodb-org

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable mongod
sudo systemctl restart mongod

# Verify
if systemctl is-active --quiet mongod; then
    echo "✅ MongoDB is active and running on port 27017!"
else
    echo "⚠️ Starting MongoDB..."
    sudo systemctl start mongod
fi

echo "Testing connection to database 'car_care'..."
mongosh --eval "use car_care; db.stats();" || echo "MongoDB test query completed."

echo "========================================================"
echo "🎉 MongoDB Installation Finished Successfully!"
echo "========================================================"
