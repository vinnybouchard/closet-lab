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

const entryAt = (iso, fallback) => {
  const dt = DateTime.fromISO(String(iso || ""), { zone: SITE_TZ });
  if (dt.isValid) return dt;
  // No instant: fall back to the calendar label, rendered as the label it is.
  return fallback instanceof Date
    ? DateTime.fromJSDate(fallback, { zone: "utc" })
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
    DateTime.fromJSDate(d, { zone: "utc" }).toFormat("d LLLL yyyy"));
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
  eleventyConfig.addFilter("entryTime", entryFormat("HH:mm"));
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
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
