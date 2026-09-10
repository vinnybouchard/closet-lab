---
title: "A UPS is not a battery, it is a deadline"
date: 2026-01-01
topic: Home lab
summary: 
draft: true
module: "0.1"
brief:
  angle: >-
    "A UPS is not a battery, it is a deadline." The interesting content is not that you
    own one — it is that the low-battery threshold is a number *you* chose, sitting in a
    text file, and that the vendor's default was wrong for your machine.
  evidence_to_capture: >-
    The `upsc cyberpower` output. The three-unit split from `systemctl`. The `ignorelb`
    + `override.battery.charge.low` pair, with the explanation of why overriding
    firmware here is the conservative choice rather than the reckless one.
  the_honest_part: >-
    The previous UPS could not carry this machine at all — and not on watts, which is
    what everyone checks, but on **waveform**, which almost nobody does. Write that up
    plainly. "I bought the wrong thing for a reason that is not in any buying guide" is
    a better post than a specification table, and it is the part a reader will remember.
  what_to_redact: >-
    Nothing here is sensitive. Model numbers, voltages and thresholds are all safe to
    publish — this is the rare module with no publication boundary to respect.
---

<!-- Your words go here. Delete this line, set the date and the summary,
     then remove `draft: true` when it is ready. The brief above never
     renders — it is front matter. -->

## 

## 
