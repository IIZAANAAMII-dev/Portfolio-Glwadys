#!/usr/bin/env bash
set -e
npm run start -- -p 4350 > /tmp/glwadys-qa-server.log 2>&1 &
server=$!
trap 'kill $server 2>/dev/null || true' EXIT
sleep 5
node scripts/flagship-gate.cjs
