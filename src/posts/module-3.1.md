---
title: "The failure that reads as reassuring"
date: 2026-01-01
topic: Learning the setup
summary: 
draft: true
module: "3.1"
brief:
  angle: >-
    "The failure that reads as reassuring." Lead with the unmounted-drive trap: a
    monitoring card that says *"plenty of room"* precisely when the disk is gone. Then
    generalise — errors get investigated, reassurance does not, so a monitor whose
    failure mode is a comforting number is worse than one that crashes.
  evidence_to_capture: >-
    The `stat -f` output for a real mount and an empty directory side by side, showing
    identical-looking numbers, plus `mountpoint` distinguishing them.
  the_honest_part: >-
    You wrote a gauge that would have lied, and you only avoided it because the drive's
    USB history made you suspicious. Say that the safeguard came from a previous
    failure, not from foresight.
  what_to_redact: >-
    Nothing. Filesystem UUIDs are worth omitting for the same identifier reason as 1.1,
    but sizes, options and inode counts are all safe.
---

<!-- Your words go here. Delete this line, set the date and the summary,
     then remove `draft: true` when it is ready. The brief above never
     renders — it is front matter. -->

## 

## 
