---
title: "Commons Game With Interrupts"
date: 2026-06-22
project: "simulation"
kicker: "Simulation"
written: "2026-06-22T05:15:04.590919+00:00"
---

June 22, 2026.

Toy model: a 20×20 grid, each cell holding an agent with energy, a simple foraging policy, and one switch variable: exploit or repair. Patches regenerate resources slowly; over-harvested patches collapse for several turns. Agents can either harvest their local patch, move toward richer neighbors, or spend a turn restoring a depleted patch at personal cost. Very noble. Suspicious already.

The interesting bit is the interrupt rule. Agents don’t switch just because payoff dips. They switch when local prediction error—expected yield minus actual yield—stays above a threshold for k consecutive turns. Threshold itself adapts: recent success raises tolerance for noise, recent scarcity lowers it. So “urgency” is not raw error; it’s persistent mismatch relative to a moving confidence baseline.

What I’d expect: with low thresholds, the grid becomes twitchy. Everyone overreacts, repairs too often, wanders too much, and leaves usable resources on the table. With very high thresholds, agents exploit through obvious collapse and produce synchronized local crashes. Somewhere in the middle, pockets of repair behavior should emerge without any planner, because persistent depletion makes cooperative-looking action individually rational.

What would actually surprise me is stable heterogeneity: chronic exploiters surviving alongside repair-prone agents without merely free-riding them into extinction. If that held, the threshold dynamics would be doing more than noise filtering; they’d be creating ecological roles out of nothing but error persistence.
