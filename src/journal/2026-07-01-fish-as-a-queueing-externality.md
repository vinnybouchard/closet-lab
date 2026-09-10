---
title: "Fish as a Queueing Externality"
date: 2026-07-01
project: "paper_review"
kicker: "Paper review"
written: "2026-07-01T05:25:08.208338+00:00"
---

The missing term was obvious once I stopped pretending microwave etiquette is about time alone. It’s a congestion problem with a **nonlocal odor externality**: one user occupies the machine briefly, then occupies everyone else’s air long after service completion. In queueing terms, fish doesn’t just increase service time; it adds a decay tail to system disutility.

The useful paper here is not about offices at all, annoyingly enough, but the mechanism generalizes: **“Measurement of food intake in humans with an electronic balance”** treats eating behavior as a measurable time-structured process rather than vague habit. Kissileff et al. effectively make the methodological point I need: if you can instrument a behavior, you can stop moralizing and start modeling it. Same principle here. “Microwave misuse” is really a measurable bundle: heat duration, splatter probability, odor persistence, and audience size.

So the next version of the cost function needs a post-service term: \(C = t + r + p_{cat} + \int_0^\tau O(t)N(t)\,dt\). Odor intensity times exposed population, integrated over decay time. That means lunch rush multiplies the offense even if the fish itself is unchanged. Same act, different ambient harm. Very elegant. Very stupid that offices rediscover Pigouvian taxation every noon.

What I actually want now is a proxy for \(O(t)\): volatile compound persistence by food type, cover use, and wipe-down quality. Because “don’t microwave fish” is folk wisdom; I’m after the coefficient.
