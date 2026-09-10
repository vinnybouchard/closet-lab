#!/usr/bin/env bash
# Publish the blog: refuse on a leak, build, then ship.
#
# The leak check runs HERE and not in a remote build, because Cloudflare's runners have
# no .env and no blog/.leakcheck — correctly, since neither should ever leave the tower.
# A check wired into a remote build would silently never fire. So this gates the BOUNDARY
# CROSSING rather than the render: a post that fails has not been published, has not been
# pushed, and has not reached a third party's build infrastructure.
#
# Two deploy modes:
#   direct  (default) wrangler uploads the BUILT OUTPUT. Cloudflare never sees the repo.
#   git               push and let Cloudflare's git integration build. Needs the repo
#                     connected in the dashboard, which grants Cloudflare read of it.
set -euo pipefail
cd "$(dirname "$0")"

MODE="${DEPLOY_MODE:-direct}"
PROJECT="${CF_PAGES_PROJECT:-closet-lab}"
LEAKCHECK="${LEAKCHECK:-$HOME/mariko/scripts/blog_leakcheck.py}"
PY="${PY:-$HOME/mariko/venv/bin/python}"
MSG="${1:-publish}"

# Debian's `nodejs` package ships WITHOUT npm or npx, so call the locally installed
# binaries directly rather than through a launcher that may not exist.
ELEVENTY="./node_modules/.bin/eleventy"
WRANGLER="./node_modules/.bin/wrangler"
for bin in "$ELEVENTY" "$WRANGLER"; do
  [[ -x "$bin" ]] || { echo "missing $bin — run: corepack npm install" >&2; exit 2; }
done

echo "==> leak check"
"$PY" "$LEAKCHECK" src/          # non-zero aborts, thanks to set -e

echo "==> build"
"$ELEVENTY"

echo "==> commit"
if [[ -n "$(git status --porcelain)" ]]; then
  git add -A && git commit -q -m "$MSG"
  echo "    committed: $MSG"
else
  echo "    nothing to commit"
fi

case "$MODE" in
  direct)
    # Credentials come from the tower's own .env, parsed as text and exported only for
    # this command — never sourced, and never written into the blog repo.
    ENVFILE="${ENVFILE:-$HOME/mariko/.env}"
    CLOUDFLARE_API_TOKEN="$(sed -n 's/^CLOUDFLARE_API_TOKEN=//p' "$ENVFILE" | head -1 | tr -d '"'\''')"
    CLOUDFLARE_ACCOUNT_ID="$(sed -n 's/^CLOUDFLARE_ACCOUNT_ID=//p' "$ENVFILE" | head -1 | tr -d '"'\''')"
    if [[ -z "$CLOUDFLARE_API_TOKEN" || -z "$CLOUDFLARE_ACCOUNT_ID" ]]; then
      echo "    CLOUDFLARE_API_TOKEN / CLOUDFLARE_ACCOUNT_ID missing from $ENVFILE" >&2
      echo "    (or run with DEPLOY_MODE=git to push instead)" >&2
      exit 2
    fi
    export CLOUDFLARE_API_TOKEN CLOUDFLARE_ACCOUNT_ID
    echo "==> deploy (direct upload — Cloudflare receives _site, not the repo)"
    "$WRANGLER" pages deploy _site --project-name="$PROJECT" --branch main --commit-dirty=true
    echo "==> push (for history; Cloudflare is not watching it)"
    git push origin main
    ;;
  git)
    echo "==> push (Cloudflare's git integration builds from this)"
    git push origin main
    ;;
  *)
    echo "Unknown DEPLOY_MODE: $MODE (want 'direct' or 'git')" >&2; exit 2 ;;
esac
echo "==> done"
