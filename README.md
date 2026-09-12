# Closet Lab

An [Eleventy](https://www.11ty.dev/) blog on Cloudflare Pages. Push to `main` and it
builds.

## Write

```bash
git clone git@github.com:vinnybouchard/closet-lab.git
cd closet-lab
npm install
npm start          # http://localhost:8080, live reload while you write
```

Posts are markdown in `src/posts/`. **28 drafts are already there**, one per module of
the course this blog documents, named `module-<unit>.md`. Each carries its own brief in
front matter — the angle, the evidence to capture, the honest part, what to redact — and
an empty body. None of them contains prose written for you.

To publish one: write the body, set `date:` and `summary:`, delete `draft: true`, then

```bash
git add -A && git commit -m "the UPS post" && git push
```

Or `./publish.sh "the UPS post"`, which is the same thing plus the leak check.

For a post that is not a course module:
`cp src/posts/_template.md "src/posts/$(date +%F)-slug.md"`

### Front matter

| field | | |
|---|---|---|
| `title` | required | The headline. Rendered as the H1 — do not also write `# Title`. |
| `date` | required | `2026-09-14`. Sorts the index; a malformed one refuses the build. |
| `draft` | | `true` means the page is **not written at all**. Delete to publish. |
| `topic` | optional | Drives the kicker, the filter strip and the topic page. |
| `summary` | optional | One sentence — index card and standfirst. |
| `cover` | optional | `/assets/x.jpg`. Turns on the photo hero. |
| `series` | optional | Printed up the side of the hero. |

A `tags:` line does nothing — the filter strip reads `topic`.

There is a two-page markdown reference PDF covering what renders and what doesn't.

## Mariko's journal

`/journal/` is the research notebook of the assistant that runs on the tower. Refresh it
**from the tower**, where the data lives:

```bash
~/mariko/venv/bin/python ~/mariko/scripts/export_lab_notes.py
cd ~/blog && ./publish.sh "new lab notes"
```

It reads through the bot's HTTP API and never opens ChromaDB, so the bot must be running.
Entries are posted unedited; to leave one out, add its slug to
`src/journal/.lab-notes-exclude` — omission, not editing.

## The leak check

`tools/leakcheck.py` refuses to publish content carrying a locator or a credential.

**Advisory, not a gate.** The script is only logic, so it lives here; what it checks
against deliberately does not:

- `.leakcheck` — locators, one per line, **git-ignored** and per-machine
- credential values from an `.env`, found via `BLOG_ENV_FILE`, a sibling `.env`, or a
  git-ignored `.env-path` naming one elsewhere

With neither present it says so and exits 0 — refusing would make the workflow depend on
a file that is meant to be absent. With a locator list it is strict, and it never prints a
credential: a finding names the key.

RFC1918 addresses are deliberately allowed. They mean nothing outside a LAN and scrubbing
them makes the posts unreadable for no gain.

## Cloudflare Pages

- Build command: `npx @11ty/eleventy`
- Output directory: `_site`
- `NODE_VERSION` = `20`

## Design

From the "Home Lab Learning Journey" Claude Design project, which builds on Nocturne.

**Fonts are self-hosted.** The design and Nocturne both pull from `fonts.googleapis.com`;
here Space Grotesk and IBM Plex Sans are served from this origin, so reading a page
announces nothing to a third party and the strict CSP in `src/_headers` holds. Verified:
the built output contains no third-party URLs at all.

**No inline styles — ever.** That same CSP says `style-src 'self'`, which means the
browser throws away every `style="..."` attribute on the page. The design canvas is
authored entirely in inline styles, so porting it here means porting *all* of it into
`src/assets/style.css`. Anything left behind looks perfect in the built HTML, looks
perfect in `eleventy --serve` (which does not apply `_headers`), and is dropped on the
floor by the live site. That is not hypothetical: it is what flattened the nav, both meta
strips, the home page and the journal index into single stacked columns between the first
deploy and 11 September 2026.

Two things now catch it:

- **The build fails.** `eleventy.config.js` scans the built HTML on `eleventy.after` and
  throws if a `style=` attribute survives, so Cloudflare's build refuses it too — no
  matter how the push happened. It reads the CSP out of the built `_headers` first, so
  adding `'unsafe-inline'` there turns the check off honestly rather than leaving a rule
  with no reason behind it.
- **`tools/preview.py`** serves `_site` locally with the real headers applied:

      ./node_modules/.bin/eleventy && python3 tools/preview.py   # http://127.0.0.1:8787

  Use it for anything that looks like layout. A local preview without the headers is not
  a check — it is the one configuration in which the bug cannot appear.
