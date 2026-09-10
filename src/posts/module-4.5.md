---
title: "Two URLs on one machine: one is on the internet and one cannot be"
date: 2026-01-01
topic: Security+
summary: 
draft: true
module: "4.5"
brief:
  angle: >-
    "Two URLs on one machine: one is on the internet and one cannot be." Lead with the
    phone test — same machine, same tailnet name, two different results depending on
    whether the device holds a key. Then the structural argument: they are different
    ports on different processes, so there is no setting to get wrong.
  evidence_to_capture: >-
    `tailscale serve status` showing both entries, and two screenshots from your phone
    with Tailscale off and on. Redact the tailnet name in both.
  the_honest_part: >-
    This replaced a port forward, and the reason to be honest about the tradeoff is that
    it makes the argument credible: you did not remove a dependency, you moved it from
    your router's firmware to Tailscale's control plane. Say why you think that is the
    better dependency.
  what_to_redact: >-
    **The real tailnet hostname, always** — it is a live, publicly resolvable name with
    a Funnel on it. Use `tower.example.ts.net`. `100.x` addresses are CGNAT space and
    meaningless outside your tailnet, but there is no reason to publish the full node
    list either.
---

<!-- Your words go here. Delete this line, set the date and the summary,
     then remove `draft: true` when it is ready. The brief above never
     renders — it is front matter. -->

## 

## 
