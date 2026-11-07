#!/usr/bin/env bash
set -e
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR/../frontend"
echo "===================================================================="
echo "Starting IEM Library Management System - Frontend"
echo "===================================================================="
if [ ! -d "node_modules" ]; then
    echo "First-time setup: installing dependencies..."
    npm install
fi
npm run dev
