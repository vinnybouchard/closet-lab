// Directory data for posts.
//
// **A draft must not be WRITTEN, not merely kept off the index.** Filtering the
// `posts` collection hides a draft from listings while Eleventy still renders its
// page — which is a live public URL that nothing links to. An unlisted page is still
// published, and this flag exists to keep an unfinished thought off the internet.
//
// `permalink: false` is the setting that actually suppresses the file. It must be
// computed, so it sees the post's own front matter.
export default {
  layout: "post.njk",
  tags: ["posts"],
  eleventyComputed: {
    permalink: (data) => (data.draft ? false : data.permalink),
  },
};
