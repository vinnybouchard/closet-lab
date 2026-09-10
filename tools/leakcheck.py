#!/usr/bin/env python3
"""blog_leakcheck — refuse to publish anything carrying a live value.

Extracted from `blog_site.py` when the blog moved to Eleventy on Cloudflare Pages, and
the move is what makes this module necessary rather than convenient.

**The check cannot run where the site is built any more.** Cloudflare's build runners
have no `.env` and no `blog/.leakcheck` — correctly, since neither should ever leave this
machine — so a check wired into the render would simply never fire. It therefore moves
to the only place that still holds the evidence and still sees the content: **this host,
before the content crosses the boundary.**

That is a better place for it. The old version gated a *render*; this gates the
*boundary crossing*, which is the thing that actually matters. A post that fails here has
not been published, has not been pushed, and has not reached a third party's build
infrastructure.

Two lists, and they are different in kind:

* `blog/.leakcheck` holds **locators** — the tailnet hostname, the public v6 prefix, the
  email, `/home/vinny`. Git-ignored, because it is a list of exactly the strings an
  attacker would want.
* Credential **values** are read out of `.env` at check time and are never stored and
  never printed. A finding names the KEY: `the value of INGEST_TOKEN (not shown)`. A leak
  check that echoes what it caught has published it to the terminal, the scrollback, and
  any CI log that captured the run.

`.env` is **parsed as text, never sourced** — sourcing it for a non-production purpose is
how this repo once made real API calls and wrote 26 test captures into a live vault.

Exit codes: 0 clean or unconfigured, 1 findings.

**Advisory, not a gate.** It lives in the repo because it is only logic — no secrets are
in it. What it checks against is not in the repo: the locator list is `.leakcheck`
(git-ignored, per-machine) and credential values are read from a sibling `.env` if one
exists. On a laptop neither may be present, and refusing to publish in that case would
make the simple workflow depend on a file that is deliberately absent. So with nothing
configured it says so and exits 0; with a denylist configured it is strict.
"""

from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LEAKCHECK = Path(os.getenv("BLOG_LEAKCHECK", str(ROOT / ".leakcheck")))
#: Credential values are read from an `.env` if one is reachable. Candidates in order:
#: an explicit `BLOG_ENV_FILE`, an `.env` beside this repo, then a `.env-path` file
#: (git-ignored) whose single line names one elsewhere. The last is how the tower points
#: at the bot's `.env` without a foreign path being hardcoded into a public repo.
def _env_file() -> Path:
    explicit = os.getenv("BLOG_ENV_FILE")
    if explicit:
        return Path(explicit).expanduser()
    here = ROOT / ".env"
    if here.exists():
        return here
    pointer = ROOT / ".env-path"
    try:
        named = pointer.read_text(encoding="utf-8").strip().splitlines()[0].strip()
        if named:
            return Path(named).expanduser()
    except (OSError, IndexError):
        pass
    return here


ENV_FILE = _env_file()

#: Below this length a value is a setting, not a secret: ports, `true`, `1`, `en`.
_ENV_MIN_LEN = 10
_ENV_IGNORE = {"true", "false", "on", "off", "yes", "no", "localhost", "127.0.0.1",
               "0.0.0.0", "primary", "secondary", "netserver"}

#: What gets scanned. Deliberately includes templates and config, not just posts — a
#: hostname pasted into an Eleventy layout or a `_data` file publishes just as widely.
DEFAULT_SUFFIXES = (".md", ".markdown", ".html", ".njk", ".liquid", ".json", ".yml",
                    ".yaml", ".js", ".mjs", ".cjs", ".css", ".txt", ".xml")

#: Never scanned: build output and dependencies. `node_modules` alone would produce
#: thousands of false positives and bury a real one.
SKIP_DIRS = {"node_modules", ".git", "_site", "dist", ".cache", ".venv", "venv",
             "__pycache__", ".wrangler"}


def load_denylist(path: Path = None) -> list[str]:
    """Locators, one per line. `#` comments and blanks ignored. Missing file → []."""
    path = path or LEAKCHECK
    try:
        text = path.read_text(encoding="utf-8")
    except OSError:
        return []
    return [ln.strip() for ln in text.splitlines()
            if ln.strip() and not ln.strip().startswith("#")]


def env_secrets(path: Path = None) -> dict[str, str]:
    """`{value: KEY}` for credential-looking values in `.env`. Parsed, never sourced."""
    path = path or ENV_FILE
    out: dict[str, str] = {}
    try:
        text = path.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return out
    for line in text.splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        key, value = key.strip(), value.strip().strip("\"'")
        if len(value) < _ENV_MIN_LEN or value.lower() in _ENV_IGNORE:
            continue
        if value.startswith(("/", "./")):
            continue                      # a path is configuration, not a credential
        out[value] = key
    return out


def check_text(text: str, denylist: list[str], secrets: dict[str, str],
               name: str) -> list[str]:
    """Every finding in `text`, as `file:line: what`. Never echoes a secret value."""
    findings = []
    lowered = [d.lower() for d in denylist]
    for n, line in enumerate((text or "").splitlines(), start=1):
        low = line.lower()
        for original, needle in zip(denylist, lowered):
            if needle in low:
                findings.append(f"{name}:{n}: {original}")
        for value, key in secrets.items():
            if value in line:
                findings.append(f"{name}:{n}: the value of {key} (not shown)")
    return findings


def walk(root: Path, suffixes=DEFAULT_SUFFIXES) -> list[Path]:
    """Every scannable file under `root`, skipping build output and dependencies."""
    out = []
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS and not d.startswith(".")]
        for fn in filenames:
            if Path(fn).suffix.lower() in suffixes:
                out.append(Path(dirpath) / fn)
    return sorted(out)


def scan(root: Path, *, denylist=None, secrets=None) -> list[str]:
    denylist = load_denylist() if denylist is None else denylist
    secrets = env_secrets() if secrets is None else secrets
    findings = []
    for path in walk(root):
        try:
            text = path.read_text(encoding="utf-8", errors="replace")
        except OSError:
            continue
        findings.extend(check_text(text, denylist, secrets,
                                   str(path.relative_to(root))))
    return findings


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(
        description="Refuse to publish content carrying a live value.")
    ap.add_argument("root", nargs="?", default=".", help="directory to scan")
    ap.add_argument("--allow-unchecked", action="store_true",
                    help="proceed with no denylist configured")
    args = ap.parse_args(argv)

    root = Path(args.root).expanduser().resolve()
    if not root.is_dir():
        print(f"Not a directory: {root}", file=sys.stderr)
        return 2

    denylist = load_denylist()
    secrets = env_secrets()
    if not denylist and not secrets:
        # Advisory, not a gate. On a laptop there is no .env and there may be no
        # locator list, and refusing to publish in that situation would make the
        # simple workflow depend on a file that is deliberately not in the repo.
        print(f"no denylist at {LEAKCHECK} and no .env — nothing to check against.\n"
              f"  (write one locator per line to enable the check on this machine)")
        return 0

    findings = scan(root, denylist=denylist, secrets=secrets)
    if findings:
        print("\nRefusing to publish — these lines contain live values:\n  "
              + "\n  ".join(findings)
              + "\n\nNothing was redacted for you on purpose: edit the files.\n",
              file=sys.stderr)
        return 1

    n = len(walk(root))
    print(f"clean — {n} files scanned, {len(denylist)} locators, "
          f"{len(secrets)} credential values (never printed)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
