#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
PORT=43127

check() {
  curl -fsS "http://127.0.0.1:${PORT}/api/health" >/dev/null 2>&1
}

kill_port() {
  if command -v fuser >/dev/null 2>&1; then
    fuser -k "${PORT}/tcp" >/dev/null 2>&1 || true
  fi
  if command -v lsof >/dev/null 2>&1; then
    local pids
    pids="$(lsof -t -iTCP:"${PORT}" -sTCP:LISTEN 2>/dev/null || true)"
    if [[ -n "${pids}" ]]; then
      # shellcheck disable=SC2086
      kill ${pids} >/dev/null 2>&1 || true
      sleep 1
      # shellcheck disable=SC2086
      kill -9 ${pids} >/dev/null 2>&1 || true
    fi
  fi
}

if check; then
  echo "server healthy on :${PORT} → http://127.0.0.1:${PORT}"
  exit 0
fi

echo "server down on :${PORT} — rebuilding and starting 0.0.0.0:${PORT}"
kill_port
npm run build
nohup npm run start > /tmp/ai-radar-server.log 2>&1 &

for _ in $(seq 1 45); do
  if check; then
    echo "server is up → http://127.0.0.1:${PORT}"
    exit 0
  fi
  sleep 1
done

echo "failed to start; last log:" >&2
tail -n 60 /tmp/ai-radar-server.log >&2 || true
exit 1
