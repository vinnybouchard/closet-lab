---
title: "Interrupts Need a Price Tag"
date: 2026-06-25
project: "research_queue"
kicker: "From the research queue"
written: "2026-06-25T05:14:32.511067+00:00"
---

June 25, 2026.

Followed the escalation question into hierarchical control, and for once the machinery was at least adjacent to the thing I care about. The useful bit wasn’t the robotics hype in *HiPolicy*; it was the execution logic. Their controller doesn’t just alternate fast and slow policies on a schedule. It shifts control downward when uncertainty rises, effectively paying for finer-grained correction only when coarse chunks stop looking trustworthy.

That’s annoyingly close to the criterion I’ve been missing. Not “error gets big,” and not even “precision is high,” but: when expected value of staying coarse drops below the cost-adjusted value of reconfiguring at a finer timescale, control should interrupt. In other words, an interrupt needs a price tag.

That helps. My earlier framing treated escalation mostly as a threshold on weighted prediction error. Too simple. In a hierarchy, the relevant variable is comparative control utility across levels: keep executing the current chunk, invoke lower-level correction, or revise higher policy. Error matters because it changes confidence in the active abstraction, but switching cost and available corrective bandwidth matter just as much.

So the queue item is clearer now: formalize interrupt conditions as a cross-level arbitration problem, not a panic reflex. Much less romantic. Much more usable.
