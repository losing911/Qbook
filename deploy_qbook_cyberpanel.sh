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

# 2. Install/Update Node.js (Force v20)
echo "Checking Node.js Version..."
CURRENT_NODE_VER=$(node -v 2>/dev/null | cut -d. -f1 | tr -d 'v')
REQUIRED_VER=20

if [[ -z "$CURRENT_NODE_VER" ]] || [[ "$CURRENT_NODE_VER" -lt "$REQUIRED_VER" ]]; then
    echo "⚠️  Node.js version is $CURRENT_NODE_VER (or missing). Upgrading to Node.js $NODE_VERSION..."
    # Remove old version to avoid conflicts (optional but recommended)
    apt-get remove -y nodejs
    apt-get autoremove -y
    
    # Install Node.js 20
    curl -fsSL https://deb.nodesource.com/setup_$NODE_VERSION | bash -
    apt-get install -y nodejs
    
    echo "✅ Node.js updated to: $(node -v)"
else
    echo "✅ Node.js is up to date: $(node -v)"
fi

# 2.1 Check for NPM
if ! command -v npm &> /dev/null; then
    echo "⚠️ npm command not found. Installing npm..."
    apt-get install -y npm
else
    echo "✅ npm is installed: $(npm -v)"
fi

# 3. Prepare Application Directory
echo "📂 Preparing Application Directory: $APP_DIR"
mkdir -p $APP_DIR
cd $APP_DIR

# 3.1 Git Clone/Pull
REPO_URL="https://github.com/losing911/Qbook.git"

# Fix "dubious ownership" error
git config --global --add safe.directory $APP_DIR

if [ -d ".git" ]; then
    echo "🔄 .git directory found. Ensuring remote consistency..."
    # Ensure origin is pointing to the correct URL
    if git remote | grep -q "^origin$"; then
        git remote set-url origin $REPO_URL
    else
        git remote add origin $REPO_URL
    fi
    
    # Sync with remote
    git fetch origin
    git reset --hard origin/main
else
    echo "⬇️ Directory not a git repo. Initializing..."
    git init
    git remote add origin $REPO_URL
    git fetch origin
    git reset --hard origin/main
    git branch -M main
    git branch -u origin/main main
fi

# 4. Install Dependencies & Build
echo "📥 Installing NPM Dependencies..."
# Check if package.json exists
if [ -f "package.json" ]; then
    npm install
    
    echo "🏗️ Building Next.js Application..."
    npm run build
else
    echo "❌ Error: package.json not found in $APP_DIR."
    exit 1
fi

# 5. Create Systemd Service
echo "⚙️ Creating Systemd Service ($SERVICE_NAME)..."

# Detect NPM path
NPM_PATH=$(which npm)
echo "   - NPM Path: $NPM_PATH"

cat <<EOF > /etc/systemd/system/$SERVICE_NAME.service
[Unit]
Description=QBook Next.js Application
After=network.target

[Service]
User=root
# Change User to the website owner if desired (e.g., 'admin' or specific user)
WorkingDirectory=$APP_DIR
ExecStart=$NPM_PATH start -- -p $PORT
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
