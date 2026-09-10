# Closet Lab

An Eleventy blog, deployed on Cloudflare Pages.

## Write

The posts are markdown files on the tower at `~/blog/src/posts/`. Reach them however you
like:

- **Over SMB** — `\\tower\vinny\blog\src\posts\` and open in any editor
- **Over SSH** — `ssh tower` and edit in place

There are **28 drafts already waiting**, one per course module, named `module-<unit>.md`.
Each carries its own brief in front matter — the angle, the evidence to capture, the
honest part, what to redact — taken from that module's `## Post` section. **None of them
contains a word of prose written for you.** The body is empty on purpose.

To write one:

1. Open `src/posts/module-0.1.md`
2. Write the body under the headings
3. Set `date:` and `summary:`
4. Delete `draft: true`
5. `./publish.sh "the UPS post"`

The `brief:` block is front matter, so it never renders and can be left in or deleted.

Regenerate the queue after editing a module's brief:

```bash
~/mariko/venv/bin/python ~/mariko/scripts/brief_to_drafts.py
```

It **never touches a draft whose body you have written** — only the untouched ones are
refreshed.

For a post that is not a course module, `cp src/posts/_template.md
"src/posts/$(date +%F)-slug.md"`.

Front matter: `title`, `date`, `topic` (drives the filter strip and the topic pages),
`summary`, optional `cover`, `series`, and `draft: true`.

**`draft: true` means the page is not written at all** — not written-but-unlinked. An
unlisted page is still a public URL.

### One rule

Edit on the tower, not in GitHub's web UI. `publish.sh` commits and pushes from here, so
a web edit makes the two diverge and the next publish is rejected.

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

Two ways to deploy, and they are not equivalent.

### Direct upload (default, `DEPLOY_MODE=direct`)

The tower builds and wrangler uploads `_site`. **Cloudflare never sees the repo** — only
the built output, which has already passed the leak check. Nothing in the dashboard needs
access to GitHub.

One-time, in the Cloudflare dashboard:

1. **Workers & Pages → Create → Pages → Upload assets**, name it `closet-lab`, and
   upload anything (or nothing) just to create the project. Alternatively, once the token
   below exists: `npx wrangler pages project create closet-lab --production-branch main`.
2. **My Profile → API Tokens → Create Token → Custom token** with the single permission
   **Account → Cloudflare Pages → Edit**. Nothing else.
3. Copy the token and your **Account ID** (right-hand side of any dashboard page).

Then add to `~/mariko/.env` — not to this repo:

```
CLOUDFLARE_API_TOKEN=...
CLOUDFLARE_ACCOUNT_ID=...
```

`publish.sh` reads them from there, parsed as text and exported for the one command.

### Git integration (`DEPLOY_MODE=git`)

Connect the repo in the dashboard and Cloudflare builds on every push:

- Build command: `npx @11ty/eleventy`
- Output directory: `_site`
- Node: 20+ (set `NODE_VERSION=20` if the default is older)

The cost is that Cloudflare gets **read access to the repository**, not just the output.
