# Closet Lab

An Eleventy blog, deployed on Cloudflare Pages.

## Write

```bash
cp src/posts/_template.md "src/posts/$(date +%F)-slug.md"
```

Front matter: `title`, `date`, `topic` (drives the filter strip and the topic pages),
`summary`, optional `cover`, `series`, and `draft: true`.

**`draft: true` means the page is not written at all** — not written-but-unlinked. An
unlisted page is still a public URL.

## Preview

```bash
npx @11ty/eleventy --serve
```

## Publish

```bash
./publish.sh "a short message"
```

Runs the leak check, builds, commits and pushes. Cloudflare Pages builds from the push.

**The leak check is not optional and does not run in CI.** It lives on the machine that
holds the evidence — the locator denylist and `.env` — because Cloudflare's build runners
have neither, correctly, so a check wired there would silently never fire. It gates the
boundary crossing rather than the render.

## Mariko's journal

`/journal/` is her research notebook — `kind:"research"` notes she writes on her own
initiative. Export them with:

```bash
~/mariko/venv/bin/python ~/mariko/scripts/export_lab_notes.py
```

It reads through the bot's own HTTP API and **never opens ChromaDB** — Chroma does not
support concurrent multi-process access, so the single-writer rule means a second process
must not open it even to read. **The bot must be running.**

The export is one-way and idempotent: re-running overwrites, and an entry deleted
upstream is pruned against a manifest. It publishes nothing on its own — the leak check
and `publish.sh` still stand between the files and the internet.

The page says the entries are posted unedited, so they are. If there is one you would
rather not publish, add its slug to `src/journal/.lab-notes-exclude` — **omission, not
editing**, which is a different and honest thing.

## Design

From the "Home Lab Learning Journey" Claude Design project, which builds on Nocturne.

**Fonts are self-hosted.** The design and Nocturne both pull from `fonts.googleapis.com`;
here Space Grotesk and IBM Plex Sans are served from this origin, so reading a page
announces nothing to a third party and the strict CSP in `src/_headers` holds. Verified:
the built output contains no third-party URLs at all.

## Cloudflare Pages

- Build command: `npx @11ty/eleventy`
- Output directory: `_site`
- Node: 20+
