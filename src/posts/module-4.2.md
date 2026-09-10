---
title: "NAT is not a firewall, and my IPv6 address proves it"
date: 2026-01-01
topic: Security+
summary: 
draft: true
module: "4.2"
brief:
  angle: >-
    "NAT is not a firewall, and my IPv6 address proves it." Most home-network security
    writing stops at "you're behind NAT so you're fine", and the v6 half of the same
    machine is a concrete counterexample you can measure.
  evidence_to_capture: >-
    The two different public IPs from one host, and a successful outbound v6 ping beside
    the global address. If lab 3 finds something reachable, that is the post; if it
    finds nothing reachable, *how you established that* is the post.
  the_honest_part: >-
    You did not know whether inbound v6 was filtered until you tested it. Almost nobody
    does. Say what you assumed and what turned out to be true.
  what_to_redact: >-
    **Your public IPv4 and the full IPv6 prefix.** They geolocate you and identify your
    household. Mask them (`76.157.x.x`) or omit them entirely — the argument works fine
    without the real numbers.
---

<!-- Your words go here. Delete this line, set the date and the summary,
     then remove `draft: true` when it is ready. The brief above never
     renders — it is front matter. -->

## 

## 
