---
title: "I audited my own secrets and one of them was world-readable"
date: 2026-01-01
topic: Learning the setup
summary: 
draft: true
module: "2.1"
brief:
  angle: >-
    "I audited my own secrets and one of them was world-readable." A finding on your own
    machine, found by a command anyone can run, with an honest severity assessment. That
    last part is what makes it credible: a post that calls a `0744` token on a
    single-user box a critical vulnerability is less impressive than one that says *low
    severity, and the real problem is that nothing noticed.*
  evidence_to_capture: >-
    The `stat` output showing `600`, `600`, `744` side by side. It tells the whole story
    in three lines.
  the_honest_part: >-
    You did not know. The intended state and the actual state had drifted and no check
    existed to catch it. Say what you changed, and whether you added anything that would
    notice next time.
  what_to_redact: >-
    The filenames are fine and the modes are fine — publishing "this file was
    world-readable" is safe *once you have fixed it*. Never publish the contents, and do
    not publish the exact absolute path.
---

<!-- Your words go here. Delete this line, set the date and the summary,
     then remove `draft: true` when it is ready. The brief above never
     renders — it is front matter. -->

## 

## 
