import { DateTime } from "luxon";
import rss from "@11ty/eleventy-plugin-rss";
import syntax from "@11ty/eleventy-plugin-syntaxhighlight";
import anchor from "markdown-it-anchor";

// Shared by the counts filter and the topic pages, so a tab and its page
// can never disagree about a slug.
const topicSlug = (s) =>
  String(s || "").toLowerCase().replace(/\+/g, "-plus").replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "untagged";

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
  eleventyConfig.addCollection("journal", (api) =>
    api.getFilteredByGlob("src/journal/*.md")
      .filter((p) => !p.data.draft)
      .sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addFilter("day", (d) =>
    DateTime.fromJSDate(d, { zone: "utc" }).toFormat("dd"));
  eleventyConfig.addFilter("mon", (d) =>
    DateTime.fromJSDate(d, { zone: "utc" }).toFormat("LLL"));
  // The time she actually wrote it, from the entry's own timestamp — not invented.
  eleventyConfig.addFilter("clock", (iso) =>
    iso ? DateTime.fromISO(iso, { zone: "utc" }).toFormat("HH:mm") : "");
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
