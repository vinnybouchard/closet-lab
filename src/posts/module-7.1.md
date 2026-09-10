---
title: "Bash reads a script while it runs, and that is why my deploy process has a rule about `mv`"
date: 2026-01-01
topic: Security+
summary: 
draft: true
module: "7.1"
brief:
  angle: >-
    "Bash reads a script while it runs, and that is why my deploy process has a rule
    about `mv`." Genuinely surprising to most people, demonstrable in five lines, and it
    explains a class of bizarre production failures that usually get blamed on something
    else.
  evidence_to_capture: >-
    The lazy-read demo output — a running script producing garbage after its file
    changed underneath it — and the drift-check output showing MATCH across the board.
    The second is the boring one and it is the one that proves you check.
  the_honest_part: >-
    The convention exists because a load-bearing script lived only as an unversioned
    root-owned file for months. Say that. The path from "I wrote this at 1 a.m." to
    "this is critical infrastructure" is one most people have walked and few write down.
  what_to_redact: >-
    Nothing. Paths, filenames and the mechanism are all safe.
---

<!-- Your words go here. Delete this line, set the date and the summary,
     then remove `draft: true` when it is ready. The brief above never
     renders — it is front matter. -->

## 

## 
