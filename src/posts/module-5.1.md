---
title: "I port-scanned my own server and found a hole in an argument I had written down"
date: 2026-01-01
topic: Security+
summary: 
draft: true
module: "5.1"
brief:
  angle: >-
    "I port-scanned my own server and found a hole in an argument I had written down."
    The strongest post available to you: not a vulnerability, a **gap between a stated
    control and the implementation** — which is what real audit findings almost always
    are.
  evidence_to_capture: >-
    The `curl` returning 200 from a LAN address for a surface documented as
    tailnet-only, beside the 401 from the API showing the token gate working. Two lines,
    and they tell the whole story including the mitigating half.
  the_honest_part: >-
    You wrote the comment claiming only your own devices could reach it, and it was not
    true. Own that plainly. Then show the decision — fix, firewall, or accept — because
    the decision is the professional part.
  what_to_redact: >-
    Publish the *shape* of the inventory, not the inventory. Port numbers of standard
    services are fine; do not publish a complete map of every custom service on your
    machine with its bind address. And redact the LAN address if you would rather.
---

<!-- Your words go here. Delete this line, set the date and the summary,
     then remove `draft: true` when it is ready. The brief above never
     renders — it is front matter. -->

## 

## 
