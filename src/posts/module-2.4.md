---
title: "A config line that did nothing, and a document that said it did"
date: 2026-01-01
topic: Learning the setup
summary: 
draft: true
module: "2.4"
brief:
  angle: >-
    "A config line that did nothing, and a document that said it did." The `Persistent=`
    finding is small, specific, verifiable against the man page, and exactly the kind of
    thing a careful reader enjoys. It also demonstrates the habit worth advertising: you
    read the documentation for a flag you had already shipped.
  evidence_to_capture: >-
    The timer unit beside the man page sentence. Two short quotes, and the contradiction
    is self-evident.
  the_honest_part: >-
    You wrote the line, and the project's own documentation repeated the mistake. The
    behaviour was correct by accident, via `OnBootSec=`. Say all three parts — "wrong
    for a reason that didn't bite me" is a more instructive story than a fix.
  what_to_redact: >-
    Nothing. Unit names, timer schedules and journal sizes are all safe.
---

<!-- Your words go here. Delete this line, set the date and the summary,
     then remove `draft: true` when it is ready. The brief above never
     renders — it is front matter. -->

## 

## 
