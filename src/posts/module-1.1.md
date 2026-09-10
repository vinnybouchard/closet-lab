---
title: "The 976 MB partition nobody thinks about"
date: 2026-01-01
topic: Home lab
summary: 
draft: true
module: "1.1"
brief:
  angle: >-
    "The 976 MB partition nobody thinks about." Almost no one can say what is in their
    ESP or why it has to be FAT32, and the answer is genuinely interesting — the
    firmware's own specification constrains your filesystem choice.
  evidence_to_capture: >-
    `efibootmgr -v` showing the shim path, `df -h /boot/efi` showing 1% used, and
    `mokutil --sb-state` saying disabled. The three together make the point on their
    own: the machinery is installed and switched off.
  the_honest_part: >-
    You have shim in the boot path and Secure Boot disabled, which is a very common
    state and one most people do not know they are in. Say what you decided and why. "I
    looked at the threat model and chose not to" is a strong sentence; not having looked
    is the thing to avoid.
  what_to_redact: >-
    The root filesystem UUID and the ESP's partition GUID. They are not credentials, but
    they are unique identifiers for your specific machine and there is no reason to
    publish them. Sizes, paths and versions are all safe.
---

<!-- Your words go here. Delete this line, set the date and the summary,
     then remove `draft: true` when it is ready. The brief above never
     renders — it is front matter. -->

## 

## 
