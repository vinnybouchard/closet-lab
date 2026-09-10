---
title: "One box, three tokens, three different rules — and why"
date: 2026-01-01
topic: Security+
summary: 
draft: true
module: "5.4"
brief:
  angle: >-
    "One box, three tokens, three different rules — and why." Most writing on this topic
    is a rule ("never put tokens in URLs"). You have three real surfaces where the same
    question got three different correct answers, and the scoped deck token is the
    elegant resolution: **when the transport has to be weak, shrink what the credential
    opens.**
  evidence_to_capture: >-
    The three-row table, and the reasoning comments from the code. Do not screenshot
    `.env` — not even redacted, since the variable names alone map your integrations.
  the_honest_part: >-
    The `never source .env for tests` incident. It made real API calls and wrote 26
    captures into a live vault, and it is a much better story than a hypothetical
    attacker because it actually happened and the cause was your own code.
  what_to_redact: >-
    Every value, obviously. **Also the full variable-name list** — it is an inventory of
    every service you integrate with, which is reconnaissance. Name the three you are
    discussing and no more.
---

<!-- Your words go here. Delete this line, set the date and the summary,
     then remove `draft: true` when it is ready. The brief above never
     renders — it is front matter. -->

## 

## 
