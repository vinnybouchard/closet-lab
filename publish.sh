#!/usr/bin/env bash
# Publish the blog: refuse on a leak, build, then push.
#
# The leak check runs HERE and not in Cloudflare's build, because Cloudflare's runners
# have no .env and no blog/.leakcheck — correctly, since neither should ever leave the
# tower. A check wired into the remote build would silently never fire.
#
# So this gates the BOUNDARY CROSSING rather than the render, which is the thing that
# actually matters: a post that fails here has not been published, has not been pushed,
# and has not reached a third party's build infrastructure.
set -euo pipefail
cd "$(dirname "$0")"

LEAKCHECK="${LEAKCHECK:-$HOME/mariko/scripts/blog_leakcheck.py}"
PY="${PY:-$HOME/mariko/venv/bin/python}"

echo "==> leak check"
"$PY" "$LEAKCHECK" src/          # non-zero aborts, thanks to set -e

echo "==> build"
npx @11ty/eleventy

echo "==> push"
if [[ -n "$(git status --porcelain)" ]]; then
  git add -A
  git commit -m "${1:-publish}"
fi
git push origin main
echo "==> done — Cloudflare Pages builds from the push"
