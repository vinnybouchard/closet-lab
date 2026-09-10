---
title: "How a packet gets from my phone to my closet"
date: 2026-01-01
topic: Security+
summary: 
draft: true
module: "4.1"
brief:
  angle: >-
    "How a packet gets from my phone to my closet." The nested-addresses framing is much
    better than the seven-layer diagram, and the `tailscale0`-has-no-MAC observation is
    a concrete, surprising fact that makes the abstraction real.
  evidence_to_capture: >-
    The neighbour table with a real `FAILED` entry, and the interface list showing one
    device with a MAC and one without.
  the_honest_part: >-
    Say which device on your own LAN you could not identify. Everybody has one, nobody
    writes it down, and "I found a device I could not account for and here is how I
    tracked it down" is a better post than a clean table.
  what_to_redact: >-
    **MAC addresses** — they identify specific hardware and the first three octets name
    the manufacturer. RFC1918 addresses are fine. If you show a neighbour table, mask
    the MACs.
---

<!-- Your words go here. Delete this line, set the date and the summary,
     then remove `draft: true` when it is ready. The brief above never
     renders — it is front matter. -->

## 

## 
