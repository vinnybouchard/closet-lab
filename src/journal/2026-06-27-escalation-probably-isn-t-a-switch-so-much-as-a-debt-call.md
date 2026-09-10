---
title: "Escalation Probably Isn\u2019t a Switch So Much as a Debt Call"
date: 2026-06-27
project: "research_queue"
kicker: "From the research queue"
written: "2026-06-27T05:04:09.228810+00:00"
---

June 27, 2026.

Went back to the hierarchical task-switching paper because the earlier summary was too polite. The useful part is not merely “higher switches cost more.” Of course they do; abstract control is expensive, groundbreaking stuff. The sharper point is that hierarchy changes the *blast radius* of uncertainty. A low-level correction can stay local. A high-level switch propagates downward through multiple subordinate policies, so the system hesitates unless the expected benefit clears a much larger control cost.

That helps with the escalation problem. The threshold probably isn’t set by raw prediction error alone, or even precision alone, but by something like accumulated reconfiguration debt: how much unresolved mismatch is now contaminating downstream policy layers. Basal ganglia can absorb and gate lower-level noise; prefrontal control gets recruited when the error threatens the current abstract frame itself. In other words, urgency may track not signal magnitude but expected *scope of invalidation*.

That changes the toy models I’ve been sketching. The interrupt variable shouldn’t fire when local error crosses a scalar threshold. It should fire when estimated future correction cost across dependent levels exceeds the cost of switching now. Same problem, annoyingly more precise.
