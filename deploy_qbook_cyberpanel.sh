#!/bin/bash

# Deployment Script for QBook on CyberPanel (Ubuntu)
# Run as root or with sudo

DOMAIN="qbook.anxipunk.icu"
APP_DIR="/home/$DOMAIN/public_html" # Standard CyberPanel path, adjust if needed
SERVICE_NAME="qbook"
PORT=3001
NODE_VERSION="20.x"

echo "🚀 Starting QBook Deployment for $DOMAIN..."

# 1. Update System & Install Essentials
echo "📦 Updating system and installing dependencies..."
apt-get update
apt-get install -y curl git unzip

# 2. Install Node.js (if not present or wrong version)
echo "Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "🟢 Installing Node.js $NODE_VERSION..."
    curl -fsSL https://deb.nodesource.com/setup_$NODE_VERSION | bash -
    apt-get install -y nodejs
else
    echo "✅ Node.js is already installed: $(node -v)"
fi

# 3. Prepare Application Directory
# Note: In CyberPanel, the git repo usually goes into public_html or a subdirectory
echo "📂 Preparing Application Directory: $APP_DIR"
mkdir -p $APP_DIR

# 4. Install Dependencies & Build
echo "📥 Installing NPM Dependencies..."
cd $APP_DIR

# Check if package.json exists (assuming files are already there or git pulled)
if [ -f "package.json" ]; then
    npm install
    
    echo "🏗️ Building Next.js Application..."
    npm run build
else
    echo "❌ Error: package.json not found in $APP_DIR. ensure you have uploaded the code or git pulled."
    exit 1
fi

# 5. Create Systemd Service
echo "⚙️ Creating Systemd Service ($SERVICE_NAME)..."
cat <<EOF > /etc/systemd/system/$SERVICE_NAME.service
[Unit]
Description=QBook Next.js Application
After=network.target

[Service]
User=root
# Change User to the website owner if desired (e.g., 'admin' or specific user)
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/npm start -- -p $PORT
Restart=always
Environment=NODE_ENV=production
# Add other env vars here or use EnvironmentFile=.env

[Install]
WantedBy=multi-user.target
EOF

# 6. Start Service
echo "🔥 Starting $SERVICE_NAME Service..."
systemctl daemon-reload
systemctl enable $SERVICE_NAME
systemctl restart $SERVICE_NAME

echo "✅ Deployment Script Finished!"
echo "   - App running on: http://localhost:$PORT"
echo "   - Status: $(systemctl is-active $SERVICE_NAME)"
echo "⚠️  IMPORTANT: Go to CyberPanel > Websites > List Websites > Manage > Rewrite Rules and add the proxy configuration."
