#!/usr/bin/env bash
# Check, commit, push. Cloudflare Pages builds from the push.
set -euo pipefail
cd "$(dirname "$0")"
PY="${PY:-python3}"

echo "==> leak check"
"$PY" tools/leakcheck.py src/

echo "==> commit"
if [[ -n "$(git status --porcelain)" ]]; then
  git add -A && git commit -q -m "${1:-publish}" && echo "    ${1:-publish}"
else
  echo "    nothing to commit"
fi

git push origin main
echo "==> pushed — Cloudflare builds from here"
