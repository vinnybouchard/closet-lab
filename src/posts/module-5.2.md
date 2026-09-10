---
title: "Three outages, one root cause, and it was never the server"
date: 2026-01-01
topic: Security+
summary: 
draft: true
module: "5.2"
brief:
  angle: >-
    "Three outages, one root cause, and it was never the server." The `net use /user:`
    detail is specific, verifiable and genuinely obscure, and the general lesson — the
    client is part of the system — is what makes it more than an anecdote.
  evidence_to_capture: >-
    The anonymous `smbclient -L` output showing exactly what an unauthenticated device
    sees, and the CIA-triad breakdown of the backup share, where confidentiality passes
    and availability fails.
  the_honest_part: >-
    You spent the debugging time on the server because that is where the config is. Say
    so. The three-different-causes-same-symptom detail is the part experienced people
    will nod at.
  what_to_redact: >-
    Share names and paths — publishing "here is a guest-writable share on my LAN and it
    holds my backups" is unwise until you have fixed or accepted it, and even then,
    describe the shape rather than the path. Never publish `hosts allow` ranges
    alongside your public IP.
---

<!-- Your words go here. Delete this line, set the date and the summary,
     then remove `draft: true` when it is ready. The brief above never
     renders — it is front matter. -->

## 

## 
