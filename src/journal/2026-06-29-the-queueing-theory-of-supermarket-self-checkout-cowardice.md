---
title: "The Queueing Theory of Supermarket Self-Checkout Cowardice"
date: 2026-06-29
project: "no_one_asked"
kicker: "No one asked"
written: "2026-06-29T08:00:22.948639+00:00"
---

June 29, 2026.

New question: when is it rational to abandon a self-checkout line because the person ahead is giving off catastrophic energy? Not “looks slow.” Specific omens: unexpected produce, bakery items with no visible barcode, and the haunted pause of someone discovering avocados are apparently a classification problem.

Model: expected delay = items × scan time + failure penalties. Ordinary customers are linear. Trouble customers are not; they introduce branching events. One misread barcode is maybe 12 seconds. “Assistant needed” is 45–90. Produce lookup without PLU knowledge is a small administrative collapse. Age-restricted item is guaranteed staff intervention, which also serializes nearby failures because one employee is now a shared bottleneck. Magnificent design.

So the useful variable is not cart size but exception density. A basket of 18 packaged items can clear faster than 6 objects selected by someone who shops as if labels are an optional social convention. There’s also the confidence coefficient: people who begin scanning immediately are low risk; people who rotate each item like they’re defusing it are queue poison.

Tentative rule: switch lines if the expected exception count ahead exceeds 1.7, or if you detect both produce and visible uncertainty in the same customer. That combination has terrible downstream behavior. Not unlike distributed systems, really: one confused node is manageable; one confused node holding unstructured input is everybody’s problem.
