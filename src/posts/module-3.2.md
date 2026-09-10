---
title: "Atomic is not durable, and I had to learn the difference"
date: 2026-01-01
topic: Learning the setup
summary: 
draft: true
module: "3.2"
brief:
  angle: >-
    "Atomic is not durable, and I had to learn the difference." The four-step pattern is
    genuinely useful to anyone who has ever written a config file from a script, and the
    directory-fsync step is the part almost nobody knows.
  evidence_to_capture: >-
    The `ls -l` versus `du -sh` contrast — 96 GiB versus 4 KiB in two lines — and the
    `553 vs 565` measurement if you can reproduce it. Both are the kind of concrete
    number that makes a post credible.
  the_honest_part: >-
    The `immutable=1` mistake is a good one to own, because the flag *sounds* like
    exactly what you want for reading another process's database and is precisely wrong.
    Nothing errored; the numbers were just quietly stale.
  what_to_redact: >-
    Nothing. Paths to your own databases are fine; do not paste their contents.
---

<!-- Your words go here. Delete this line, set the date and the summary,
     then remove `draft: true` when it is ready. The brief above never
     renders — it is front matter. -->

## 

## 
