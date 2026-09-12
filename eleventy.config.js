import { DateTime } from "luxon";
import rss from "@11ty/eleventy-plugin-rss";
import syntax from "@11ty/eleventy-plugin-syntaxhighlight";
import anchor from "markdown-it-anchor";
import fs from "node:fs";
import path from "node:path";

// Shared by the counts filter and the topic pages, so a tab and its page
// can never disagree about a slug.
const topicSlug = (s) =>
  String(s || "").toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "untagged";

// Times on this site are the OWNER'S OWN — America/Chicago, which is CST or CDT
// depending on the date, so the zone is named rather than the offset assumed.
//
// Two kinds of value are involved and conflating them is the trap:
//
//   * `written:` on a Lab Note is a real INSTANT — an ISO timestamp with an
//     offset, e.g. 2026-09-08T08:00:47+00:00. Converting it is meaningful.
//   * `date:` in front matter is a date-only CALENDAR LABEL. YAML parses
//     `2026-09-08` as midnight UTC, so "converting" it to Chicago yields 19:00
//     on the 7th and every post silently loses a day. It must be rendered
//     exactly as written, in UTC. That is what `readable`/`iso` below do, and
//     why they were not touched.
//
// An entry's date AND its time both come from the one instant, so they cannot
// disagree — which they would the first winter night she writes at 05:30 UTC,
// since that is 23:30 the PREVIOUS day in Chicago while `date:` still says the
// 9th. No current entry crosses that line (the earliest is 05:xx UTC in CDT,
// i.e. 00:xx local); the point is that one eventually will.
const SITE_TZ = "America/Chicago";
// Pinned, because Cloudflare builds this site and the tower does not. Month
// names and the am/pm meridiem both come from the locale, so leaving it to
// the build machine's ICU default makes the output depend on whose container
// ran the build.
const SITE_LOCALE = "en-US";

const entryAt = (iso, fallback) => {
  const dt = DateTime.fromISO(String(iso || ""), { zone: SITE_TZ, locale: SITE_LOCALE });
  if (dt.isValid) return dt;
  // No instant: fall back to the calendar label, rendered as the label it is.
  return fallback instanceof Date
    ? DateTime.fromJSDate(fallback, { zone: "utc", locale: SITE_LOCALE })
    : null;
};
const entryFormat = (fmt) => (iso, fallback) => {
  const dt = entryAt(iso, fallback);
  return dt && dt.isValid ? dt.toFormat(fmt) : "";
};

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(rss);
  // Highlighting happens AT BUILD TIME and ships as classes — no client-side
  // highlighter, so the page runs no third-party script and reads correctly with
  // JS off. Same property the course site has, kept deliberately.
  eleventyConfig.addPlugin(syntax);

  // Heading ids. Without them the article rail's "In this post" links point at
  // nothing — the list renders empty and any anchor that did get written would be
  // dead. The rail is built from the RENDERED html precisely so it can only ever
  // list ids that exist.
  eleventyConfig.amendLibrary("md", (md) =>
    md.use(anchor, {
      level: [2, 3],
      slugify: (s) =>
        String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      permalink: false,
    })
  );

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  // A photo written the natural way — ![caption](/assets/photo.jpg) — comes out
  // of markdown as a bare <img> inside a <p>, which picks up none of
  // `.prose figure`'s radius, shadow or caption. The design draws every in-body
  // photo as a captioned figure, so a paragraph containing nothing but one image
  // becomes one here. The alt text stays ON the img, because that is what a
  // screen reader reads, and is ALSO printed as the caption, because that is
  // what the design shows — the convention markdown-it-image-figures uses, done
  // in ten lines rather than as a dependency. An image with empty alt gets a
  // figure and no caption. An image with text beside it is inline and is left
  // alone.
  eleventyConfig.addTransform("figures", function (content) {
    if (!String(this.page.outputPath || "").endsWith(".html")) return content;
    return content.replace(/<p>(<img\s[^>]*>)<\/p>/g, (_whole, img) => {
      const alt = (/\salt="([^"]*)"/.exec(img) || [, ""])[1];
      return `<figure>${img}${alt ? `<figcaption>${alt}</figcaption>` : ""}</figure>`;
    });
  });
  eleventyConfig.addPassthroughCopy({ "src/_headers": "_headers" });

  // The build FAILS if a page's layout depends on an inline style.
  //
  // src/_headers ships `style-src 'self'`, so a browser DROPS every
  // style="..." attribute on the page. Nothing local reproduces that: the built
  // HTML contains the attribute, looking perfectly correct, and neither
  // `eleventy --serve` nor a file:// open applies a _headers file. So the
  // failure exists only on the deployed site, only in a real browser — which is
  // how the live nav, both meta strips, the home page and the journal index
  // spent twelve days collapsed into single columns.
  //
  // The check reads the policy it is enforcing instead of restating it: put
  // 'unsafe-inline' in _headers and this turns itself off, rather than leaving
  // behind a rule whose reason has quietly stopped being true.
  eleventyConfig.on("eleventy.after", async ({ dir }) => {
    const out = (dir && dir.output) || "_site";
    let headers;
    try {
      headers = fs.readFileSync(path.join(out, "_headers"), "utf8");
    } catch {
      return; // no headers shipped, no policy to violate
    }
    const csp = /content-security-policy:([^\n]*)/i.exec(headers);
    if (!csp) return;
    const src = (/style-src ([^;]*)/i.exec(csp[1]) ||
                 /default-src ([^;]*)/i.exec(csp[1]) || [, ""])[1];
    if (src.includes("'unsafe-inline'")) return;

    const offenders = [];
    const walk = (d) => {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, e.name);
        if (e.isDirectory()) walk(p);
        else if (e.name.endsWith(".html")) {
          const n = (fs.readFileSync(p, "utf8").match(/\sstyle="/g) || []).length;
          if (n) offenders.push(`${p} (${n})`);
        }
      }
    };
    walk(out);
    if (offenders.length) {
      throw new Error(
        `inline style attributes in the built output, which \`style-src ${src.trim()}\` ` +
        `makes the browser drop:\n  ${offenders.join("\n  ")}\n` +
        `Move them into src/assets/style.css as classes.`
      );
    }
  });

  // Drafts never render. Not rendered-but-unlinked: an unlisted page is still a
  // public URL, and this flag exists to keep an unfinished thought off the internet.
  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob("src/posts/*.md")
      .filter((p) => !p.data.draft)
      .sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addFilter("readable", (d) =>
    DateTime.fromJSDate(d, { zone: "utc", locale: SITE_LOCALE }).toFormat("d LLLL yyyy"));
  eleventyConfig.addFilter("iso", (d) =>
    DateTime.fromJSDate(d, { zone: "utc" }).toISO());


  // — filters the Closet Lab templates need —

  eleventyConfig.addFilter("slice_", (arr, a, b) =>
    b === undefined ? (arr || []).slice(a) : (arr || []).slice(a, b));

  // Reading time from the rendered HTML. 220 wpm, floored at one minute — a
  // "0 min read" on the meta strip reads as a bug rather than as a short post.
  eleventyConfig.addFilter("readingTime", (html) => {
    const words = String(html || "").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
    return `${Math.max(1, Math.round(words / 220))} min read`;
  });

  // The article rail's contents list, built from the rendered HTML rather than
  // from the markdown source — so it matches the ids the renderer actually emitted.
  eleventyConfig.addFilter("headings", (html) => {
    const out = [];
    const re = /<h2[^>]*\sid="([^"]+)"[^>]*>(.*?)<\/h2>/gis;
    let m;
    while ((m = re.exec(String(html || "")))) {
      out.push({ id: m[1], text: m[2].replace(/<[^>]+>/g, "").trim() });
    }
    return out;
  });

  eleventyConfig.addFilter("topicSlug", topicSlug);

  // Topic counts for the filter strip, most-used first. Driven by what the posts
  // actually carry — a topic with no posts should not get a tab.
  eleventyConfig.addFilter("topicCounts", (posts) => {
    const counts = new Map();
    for (const p of posts || []) {
      const t = p.data.topic;
      if (t) counts.set(t, (counts.get(t) || 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([name, count]) => ({ name, count, slug: topicSlug(name) }));
  });

  // One page per topic, from the same source as the counts.
  // Mariko's Lab Notes, exported from her research notebook by
  // mariko/scripts/export_lab_notes.py. Newest first.
  // Ordered by the instant she wrote, not by the front-matter label — otherwise
  // an entry whose local date differs from its `date:` (see SITE_TZ above) would
  // print out of sequence in a list sorted by something it no longer shows.
  const journalMillis = (p) => {
    const dt = DateTime.fromISO(String(p.data.written || ""), { zone: SITE_TZ });
    return dt.isValid ? dt.toMillis() : p.date.getTime();
  };
  eleventyConfig.addCollection("journal", (api) =>
    api.getFilteredByGlob("src/journal/*.md")
      .filter((p) => !p.data.draft)
      .sort((a, b) => journalMillis(b) - journalMillis(a))
  );

  // Lab Note renderers. Each takes the entry's `written` instant, with its
  // front-matter `date` as the fallback for an entry that somehow lacks one.
  // The time she actually wrote it comes from her own timestamp, not invented.
  eleventyConfig.addFilter("entryDate", entryFormat("d LLLL yyyy"));
  eleventyConfig.addFilter("entryDay", entryFormat("dd"));
  eleventyConfig.addFilter("entryMon", entryFormat("LLL"));
  // 12-hour, the way a clock reads here: "12:27 am", "3:00 am" — no leading
  // zero. luxon's `a` token renders "AM" in en-US, so the meridiem is lowercased
  // for the journal list. The entry meta strip will still show it capitalised:
  // that row is `text-transform:uppercase` by design and does the same to
  // "written" and to the month name beside it.
  eleventyConfig.addFilter("entryTime", (iso, fallback) => {
    const dt = entryAt(iso, fallback);
    if (!dt || !dt.isValid) return "";
    return `${dt.toFormat("h:mm")} ${dt.toFormat("a").toLowerCase()}`;
  });
  eleventyConfig.addFilter("entryZone", entryFormat("ZZZZ"));
  eleventyConfig.addFilter("entryIso", (iso, fallback) => {
    const dt = entryAt(iso, fallback);
    return dt && dt.isValid ? dt.toISO() : "";
  });
  // First paragraph, for the list. Trimmed on a word boundary.
  eleventyConfig.addFilter("excerpt", (html, n) => {
    const first = String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const max = n || 220;
    return first.length <= max ? first : first.slice(0, max).replace(/\s+\S*$/, "") + "…";
  });

  eleventyConfig.addCollection("topics", (api) => {
    const seen = new Map();
    for (const p of api.getFilteredByGlob("src/posts/*.md")) {
      if (p.data.draft || !p.data.topic) continue;
      const slug = topicSlug(p.data.topic);
      if (!seen.has(slug)) seen.set(slug, { name: p.data.topic, slug, posts: [] });
      seen.get(slug).posts.push(p);
    }
    for (const t of seen.values()) t.posts.sort((a, b) => b.date - a.date);
    return [...seen.values()];
  });

  return {
    dir: { input: "src", includes: "_includes", output: "_site" },
    // Markdown content is NOT pre-processed by Nunjucks. It could be — that is
    // the Eleventy default and it lets a post body interpolate `{{ site.url }}`,
    // loop over a collection or call a shortcode. Nothing here wants any of
    // that (0 of 121 content files used it), and the cost is severe for this
    // blog in particular: `{{` in prose is a FATAL BUILD ERROR, not text, and
    // the subject matter is full of it — `docker ps --format '{{.Names}}'`,
    // Ansible, Helm, Home Assistant, `${{ }}` in a GitHub Action. Worse, the
    // build happens on Cloudflare after a push, so the failure surfaces as a red
    // deploy in a log nobody opens rather than an error on the writer's screen;
    // the symptom is "my post didn't show up". It is also a standing risk in the
    // journal, which is Mariko's prose and is not proofread.
    //
    // Layouts are unaffected — every .njk file still has full Nunjucks. And this
    // is per-file reversible: a post that genuinely wants template syntax sets
    // `templateEngineOverride: njk,md` in its own front matter.
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk",
  };
}
