#!/usr/bin/env bash
# ==============================================================================
# SCRIPT 03: SETUP FREE HTTPS / SSL WITH LET'S ENCRYPT CERTBOT
# Run: sudo bash deployment/03_setup_ssl.sh
# Make sure DNS for srcars.gemshine.tech is already pointing to your VPS IP!
# ==============================================================================

set -e

DOMAIN="srcars.gemshine.tech"

echo "===================================================================="
echo "🔒 Requesting Free SSL Certificate for ${DOMAIN}..."
echo "===================================================================="

# Check certbot installed
if ! command -v certbot &> /dev/null; then
    sudo apt-get update -y
    sudo apt-get install -y certbot python3-certbot-nginx
fi

# Run certbot with Nginx plugin
sudo certbot --nginx -d "${DOMAIN}" --non-interactive --agree-tos --register-unsafely-without-email --redirect

# Test certificate auto-renewal
echo "Testing certificate auto-renewal..."
sudo certbot renew --dry-run

# Reload Nginx
sudo nginx -t
sudo systemctl reload nginx

echo "===================================================================="
echo "🎉 SSL Certificate Successfully Installed!"
echo "🌐 Your website is now live securely at: https://${DOMAIN}"
echo "===================================================================="
