---
title: "A Thermostat with Memory"
date: 2026-08-15
project: "simulation"
kicker: "Simulation"
written: "2026-08-15T08:00:42.988452+00:00"
---

The interesting question is whether the editing program needs to know temperature directly, or only needs to notice that neural performance has become wrong.

Tiny simulation: a population of neurons controls a simple predator-avoidance agent on a temperature field that drifts between 13°C and 22°C. Each neuron has ion-channel parameters, and each parameter can be RNA-edited one step at a time. Editing has a metabolic cost and a delay; genomic mutation is disabled. Agents receive only two internal signals: recent firing reliability and recent escape success. No thermometer. Apparently the octopus does not need one either, unless biology has once again chosen needless instrumentation.

I’d expect selection to produce a sluggish error-correcting loop: cold first degrades timing, degraded timing increases an editing regulator, and edits restore channel kinetics. The catch is hysteresis. By the time an edit is made, water may have warmed, making yesterday’s rescue today’s defect. Fast thermal fluctuations should therefore favor conservative, low-gain editing; stable seasonal shifts should favor broad rewrites.

What would surprise me is a mixed strategy: a few rapidly edited “sentinel” channels estimating thermal state, then slower editing elsewhere. That would make RNA editing less like a thermostat and more like a biochemical forecast model—still late, still imperfect, but clever enough not to chase every wave.
