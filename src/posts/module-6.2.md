---
title: "A text box on my phone that could read any file on the server"
date: 2026-01-01
topic: Learning the setup
summary: 
draft: true
module: "6.2"
brief:
  angle: >-
    "A text box on my phone that could read any file on the server." A concrete
    vulnerability class in software you did not write, made reachable by a feature you
    did, and prevented by one small function that is documented as a boundary.
  evidence_to_capture: >-
    The `validate_link` docstring — it explains the whole thing in four lines — and the
    three-row table of validation strategies, ending with the one where there is nothing
    to validate.
  the_honest_part: >-
    You would not have thought of this unprompted. Nobody reads transmission's RPC spec
    looking for the sentence about `filename` resolving as a local path. Say where the
    knowledge came from.
  what_to_redact: >-
    Nothing here is sensitive — it is your own code and the transmission behaviour is
    documented publicly. Do not publish your route list wholesale; describe the pattern.
---

<!-- Your words go here. Delete this line, set the date and the summary,
     then remove `draft: true` when it is ready. The brief above never
     renders — it is front matter. -->

## 

## 
