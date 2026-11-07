#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
echo "===================================================================="
echo "Launching Complete IEM Library Management System"
echo "===================================================================="
"$DIR/start-backend.sh" &
BACKEND_PID=$!
sleep 5
"$DIR/start-frontend.sh" &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
wait
