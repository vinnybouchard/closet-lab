---
title: "The five-line config that took my server down for four hours"
date: 2026-01-01
topic: Home lab
summary: 
draft: true
module: "1.2"
brief:
  angle: >-
    "The five-line config that took my server down for four hours." Lead with the
    arithmetic — five retries × five seconds = 25 s inside a 60 s window — because it is
    the kind of thing a reader immediately checks in their own configs.
  evidence_to_capture: >-
    The unit comment, the `Start request repeated too quickly` line if you can find it
    in the journal, and the `blame`-vs-`critical-chain` contrast. The last one is a good
    standalone section: *"the slowest service on my machine delays nothing."*
  the_honest_part: >-
    The setting was added on purpose, as a safety feature, and it was the thing that
    caused the outage. That is a much better story than a typo. The generalisation — **a
    protection whose failure mode is worse than what it protects against is not a
    protection** — is what makes the post worth a stranger's time.
  what_to_redact: >-
    Nothing sensitive here. Unit names, timings and the journal lines are all safe.
    Avoid pasting a full journal dump, only because it is long and dull.
---

<!-- Your words go here. Delete this line, set the date and the summary,
     then remove `draft: true` when it is ready. The brief above never
     renders — it is front matter. -->

## 

## 
