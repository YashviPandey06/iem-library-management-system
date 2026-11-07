#!/usr/bin/env bash
set -e
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR/.."
echo "===================================================================="
echo "Starting IEM Library Management System - Console Client"
echo "===================================================================="
if [ -f "./gradlew" ]; then
    chmod +x ./gradlew
    ./gradlew :console:run -q --console=plain
else
    gradle :console:run -q --console=plain
fi
