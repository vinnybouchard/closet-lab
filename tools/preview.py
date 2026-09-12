#!/usr/bin/env python3
"""Serve the built site locally WITH the production headers applied.

This exists because of a specific failure. `src/_headers` ships
`Content-Security-Policy: ... style-src 'self'`, which makes the browser drop
every `style="..."` attribute on the page. Cloudflare Pages serves that header;
nothing local does. So `eleventy --serve` renders a page that is correct in a way
the deployed page is not, and reading the built HTML — where the attributes sit
there looking perfectly fine — cannot tell the difference either. The live nav,
both meta strips, the home page and the journal index were stacked into single
columns for twelve days because the only instrument that would have shown it is a
real browser loading a real response with the real headers on it.

    tools/preview.py            # serve _site on :8787 with _headers applied
    tools/preview.py --port N

Port 8099 is the public Funnel on this host. Never bind it here.
"""

from __future__ import annotations

import argparse
import functools
import http.server
import re
import socketserver
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "_site"
DEFAULT_PORT = 8787


def parse_headers(path: Path) -> list[tuple[str, str]]:
    """Read the `/*` rule out of a Cloudflare Pages _headers file.

    Only the catch-all rule is honoured — this is a preview, not a
    reimplementation of Pages' path matching, and every header this site sets is
    set on `/*`.
    """
    out: list[tuple[str, str]] = []
    if not path.exists():
        return out
    in_catch_all = False
    for raw in path.read_text(encoding="utf-8").splitlines():
        if not raw.strip() or raw.lstrip().startswith("#"):
            continue
        if not raw[:1].isspace():                 # a path rule
            in_catch_all = raw.strip() == "/*"
            continue
        if in_catch_all and ":" in raw:
            name, _, value = raw.strip().partition(":")
            out.append((name.strip(), value.strip()))
    return out


class Handler(http.server.SimpleHTTPRequestHandler):
    extra_headers: list[tuple[str, str]] = []

    def end_headers(self):
        for name, value in self.extra_headers:
            self.send_header(name, value)
        super().end_headers()

    def log_message(self, fmt, *args):            # one line, no client address
        print(f"  {fmt % args}")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--port", type=int, default=DEFAULT_PORT)
    ap.add_argument("--dir", default=str(SITE))
    a = ap.parse_args()

    root = Path(a.dir).resolve()
    if not root.is_dir():
        print(f"no built site at {root} — run ./node_modules/.bin/eleventy first")
        return 1

    headers = parse_headers(root / "_headers") or parse_headers(ROOT / "src" / "_headers")
    Handler.extra_headers = headers

    csp = next((v for n, v in headers if n.lower() == "content-security-policy"), "")
    style = re.search(r"style-src ([^;]*)", csp)
    print(f"serving {root} on http://127.0.0.1:{a.port}/")
    for name, _ in headers:
        print(f"  + {name}")
    if style and "'unsafe-inline'" not in style.group(1):
        print("  ! style-src forbids inline styles — any style=\"...\" attribute "
              "will be dropped, exactly as in production")

    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("127.0.0.1", a.port),
                                functools.partial(Handler, directory=str(root))) as srv:
        try:
            srv.serve_forever()
        except KeyboardInterrupt:
            print("\nstopped")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
