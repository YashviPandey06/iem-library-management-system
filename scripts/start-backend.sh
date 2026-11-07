#!/usr/bin/env bash
set -e
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR/.."
echo "===================================================================="
echo "Starting IEM Library Management System - Kotlin Ktor Backend"
echo "===================================================================="
if [ -f "./gradlew" ]; then
    chmod +x ./gradlew
    ./gradlew :backend:run
else
    gradle :backend:run
fi
