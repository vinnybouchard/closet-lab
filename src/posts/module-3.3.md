---
title: "My backup ran every night for ten weeks and backed up nothing"
date: 2026-01-01
topic: Learning the setup
summary: 
draft: true
module: "3.3"
brief:
  angle: >-
    "My backup ran every night for ten weeks and backed up nothing." The hook writes
    itself, and the resolution is genuinely useful: **the sending side of a
    cross-machine pipeline cannot verify delivery**, so the only trustworthy signal is a
    fingerprint left by the far end.
  evidence_to_capture: >-
    The stamp file's mtime beside a successful run's exit status 0 — two facts that
    disagree, which is the whole post in two lines.
  the_honest_part: >-
    Say how you found out, and how long it took. If the answer is "by accident, ten
    weeks later", that is the most valuable sentence in the piece, because it is what
    everybody's backup situation actually looks like and almost nobody admits.
  what_to_redact: >-
    Do not publish the share path, the archive filenames, or anything about where the
    passphrase is kept. The *design* is safe to describe — encrypted archive, key held
    off-host — and the specific locations are not.
---

<!-- Your words go here. Delete this line, set the date and the summary,
     then remove `draft: true` when it is ready. The brief above never
     renders — it is front matter. -->

## 

## 
