#!/usr/bin/env bash
# ==============================================================================
# MASTER SCRIPT: FULL 1-COMMAND AUTOMATED DEPLOYMENT ON VPS
# Subdomain: srcars.gemshine.tech | Port: 5030 | Database: MongoDB
# Run on VPS: sudo bash deployment/run_full_deployment.sh
# ==============================================================================

set -e

echo "========================================================================"
echo "🏎️  STARTING COMPLETE DEPLOYMENT FOR CAR CARE LUXURY DETAILING"
echo "🌐 Subdomain: srcars.gemshine.tech"
echo "⚡ Backend Port: 5030"
echo "💾 Database: Local MongoDB (Port 27017)"
echo "========================================================================"

# Step 1: Install & Start MongoDB
echo ""
echo ">>> [1/3] Setting up MongoDB Database..."
bash deployment/01_install_mongodb.sh

# Step 2: Build App, PM2 & Nginx
echo ""
echo ">>> [2/3] Building Application & Starting Services..."
bash deployment/02_deploy_app.sh

# Step 3: SSL Setup
echo ""
echo ">>> [3/3] Setting up SSL Certificate..."
echo "Do you want to setup Let's Encrypt SSL now? (Y/n)"
read -r -t 15 -p "Selection (default Y): " choice || choice="Y"
if [[ "$choice" =~ ^[Yy]$ || -z "$choice" ]]; then
    bash deployment/03_setup_ssl.sh || echo "⚠️ SSL setup can be run manually later with: sudo bash deployment/03_setup_ssl.sh"
else
    echo "Skipping SSL setup. You can run 'sudo bash deployment/03_setup_ssl.sh' anytime."
fi

echo ""
echo "========================================================================"
echo "🎉 ALL DEPLOYMENT TASKS COMPLETED!"
echo "------------------------------------------------------------------------"
echo "🌐 Website URL:   https://srcars.gemshine.tech"
echo "⚡ API Endpoint:  http://127.0.0.1:5030/api/health"
echo "📋 View Logs:     pm2 logs car-care-app"
echo "📊 PM2 Status:    pm2 status"
echo "========================================================================"
