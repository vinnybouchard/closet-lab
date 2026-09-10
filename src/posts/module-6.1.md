---
title: "Why my server runs one big process instead of ten small ones"
date: 2026-01-01
topic: Learning the setup
summary: 
draft: true
module: "6.1"
brief:
  angle: >-
    "Why my server runs one big process instead of ten small ones." Contrarian in an era
    of microservices, and the justification is concrete: the datastore genuinely cannot
    take two writers, so the choice was to make it impossible rather than to coordinate
    it.
  evidence_to_capture: >-
    The 210 `to_thread` calls as a number, the `flock`-survives-SIGKILL demonstration,
    and the ingestor pattern — five separate deployables, none of which can open a
    database.
  the_honest_part: >-
    Include the argument against it from lab 5. A post that only defends its own design
    reads as marketing; one that names the costs reads as engineering.
  what_to_redact: >-
    Nothing. Architecture, lock paths and patterns are all safe.
---

<!-- Your words go here. Delete this line, set the date and the summary,
     then remove `draft: true` when it is ready. The brief above never
     renders — it is front matter. -->

## 

## 
