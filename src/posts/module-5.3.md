---
title: "I was sure I had disabled password auth"
date: 2026-01-01
topic: Security+
summary: 
draft: true
module: "5.3"
brief:
  angle: >-
    "I was sure I had disabled password auth." The gap between assumed and effective
    configuration is universal, `sshd -T` is the two-second check almost nobody runs,
    and the chain — password auth + a globally routable v6 address + an unverified
    router filter — is a genuinely interesting piece of reasoning rather than a
    checklist item.
  evidence_to_capture: >-
    `sshd -T` output beside what you thought was in the file, and a week of failed
    attempts showing the baseline.
  the_honest_part: >-
    You did not know. Say it, then show the reasoning that decides whether it actually
    matters here — because the reasoning is the valuable part, not the setting.
  what_to_redact: >-
    Source addresses from the auth logs, your public IPv4 and v6 prefix, and key
    fingerprints. The config lines and the counts are safe.
---

<!-- Your words go here. Delete this line, set the date and the summary,
     then remove `draft: true` when it is ready. The brief above never
     renders — it is front matter. -->

## 

## 
