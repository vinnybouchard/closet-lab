---
title: "My server could not resolve its own name"
date: 2026-01-01
topic: Security+
summary: 
draft: true
module: "4.3"
brief:
  angle: >-
    "My server could not resolve its own name." A clean debugging story with a narrowing
    sequence, a single-flag root cause, and a one-line fix. Show the chase — the wrong
    answer, the right answer from a different resolver, and the flag — because *how you
    found it* is the transferable part.
  evidence_to_capture: >-
    The three commands: `getent` giving the wrong address, `dig @100.100.100.100` giving
    the right one, and `CorpDNS: false`. Plus the stale comment in the namespace file,
    which is a nice detail about documentation drifting from reality.
  the_honest_part: >-
    It broke at the cutover and nothing noticed for days, because nothing on the tower
    needed to resolve a tailnet name until the course site did. Say that — a failure
    that waits for a new use case is a recurring shape.
  what_to_redact: >-
    **The real tailnet hostname.** Use `tower.example.ts.net`. The rest — Comcast's
    resolver addresses, `100.100.100.100`, the flag name — is public information.
---

<!-- Your words go here. Delete this line, set the date and the summary,
     then remove `draft: true` when it is ready. The brief above never
     renders — it is front matter. -->

## 

## 
