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
