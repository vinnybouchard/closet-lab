---
title: "One process on my server has a different public IP than the rest of it"
date: 2026-01-01
topic: Security+
summary: 
draft: true
module: "4.4"
brief:
  angle: >-
    "One process on my server has a different public IP than the rest of it." Two `curl`
    commands, two answers, one machine — the hook is a measurement rather than a claim.
  evidence_to_capture: >-
    The two `api.ipify.org` results (masked), and the isolation test: the same `curl` to
    `127.0.0.1:32400` working on the host and failing inside the namespace. That pair
    demonstrates *separate loopback* better than any explanation.
  the_honest_part: >-
    The `/30` is a nice detail to admit you had to look up. And the
    containers-are-not-VMs point is worth stating as something you got wrong first,
    because most people carry the wrong model for years without it ever mattering —
    until module 2.2's docker-group finding, where it suddenly does.
  what_to_redact: >-
    The public IPs (mask them), and the WireGuard address if you would rather not
    identify the provider's range. The topology and the commands are all safe.
---

<!-- Your words go here. Delete this line, set the date and the summary,
     then remove `draft: true` when it is ready. The brief above never
     renders — it is front matter. -->

## 

## 
