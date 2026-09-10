---
title: "24 GB available and 5.5 GB swapped: both true"
date: 2026-01-01
topic: Learning the setup
summary: 
draft: true
module: "2.3"
brief:
  angle: >-
    "24 GB available and 5.5 GB swapped: both true." State the apparent contradiction in
    the first line and resolve it. Nearly everyone who runs Linux has looked at `free
    -h` and drawn the wrong conclusion, and the correction is genuinely satisfying.
  evidence_to_capture: >-
    The `free -h` line, the `smaps_rollup` walk naming the JVM, and
    `/proc/pressure/memory` sitting at zero. The third one is the punchline: the metric
    that answers the question is not the one people look at.
  the_honest_part: >-
    Say that you read it wrong first. Everybody does, and a post that starts "I thought
    my server was thrashing" is more useful than one that starts "as we all know".
  what_to_redact: >-
    Nothing. Memory figures, process names and kernel tunables are all safe.
---

<!-- Your words go here. Delete this line, set the date and the summary,
     then remove `draft: true` when it is ready. The brief above never
     renders — it is front matter. -->

## 

## 
