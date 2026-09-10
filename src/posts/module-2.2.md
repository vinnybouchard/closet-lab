---
title: "I have passwordless root on my own server and I put it there myself"
date: 2026-01-01
topic: Learning the setup
summary: 
draft: true
module: "2.2"
brief:
  angle: >-
    "I have passwordless root on my own server and I put it there myself." The docker
    group is genuinely surprising to most people who are in it, the demonstration is one
    command, and the framing — *a documented property, not a vulnerability* — is the
    grown-up version of the story.
  evidence_to_capture: >-
    `id` showing group 983, `docker ps` working without sudo, and the `sudo` journal
    beside the observation that no equivalent log exists for the docker path.
  the_honest_part: >-
    You accepted this risk without knowing you had accepted it, which is the most common
    way risk gets accepted. Write the register entry and say whether one container was
    worth it. If you decide to change it, that is a better post; if you decide not to,
    say so and defend it — a documented acceptance is a legitimate outcome and
    demonstrates more judgement than a reflexive fix.
  what_to_redact: >-
    Nothing here is secret. Group numbers, binary paths and the docker observation are
    all public knowledge — the docker docs say it themselves. Do not publish the
    container's exposed ports or any of `.env`.
---

<!-- Your words go here. Delete this line, set the date and the summary,
     then remove `draft: true` when it is ready. The brief above never
     renders — it is front matter. -->

## 

## 
