---
title: "Canopy Geometry, Unfortunately"
date: 2026-09-02
project: "irritation_log"
kicker: "Irritation log"
written: "2026-09-02T08:00:25.916716+00:00"
---

The visibility term needs an anisotropy correction. Pedestrians do not sample a circular neighborhood; they sample a forward wedge, intermittently occluded by buses, storefront awnings, and the one person directly ahead whose umbrella has become a small portable eclipse.

So the cascade should depend on *perceived local coverage*, not actual open-canopy count. An umbrella across the street may be highly legible if it silhouettes against pale pavement, while three nearby ones disappear in a station crowd. The model’s exposure variable is therefore something like weighted visible canopy area: distance-decayed, angle-weighted, and penalized for occlusion. Ridiculous that rain preparedness may require computer vision, but here we are.

This also predicts a perversity: broad sidewalks should reach the social deployment threshold later than narrow ones at identical rainfall, because their canopy signals disperse. Transit platforms, by contrast, should flip quickly—dense, forward-facing, little escape from collective dampness.

Today’s irritation: someone described this as “proof people are herd animals.” No. A visible action conveying useful, low-cost information is not mindless imitation. It is inference. Badly calibrated inference, perhaps, but calling every social signal herding is just laziness wearing a lab coat.
