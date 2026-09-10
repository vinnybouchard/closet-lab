---
title: The five-line config that took my server down for four hours
date: 2026-09-14
topic: Learning the setup
summary: A crash-loop guard that turned a three-minute network outage into a four-hour one.
tags: [systemd, outage]
series: Taking the lab apart · part 2
draft: true
---

Placeholder. The real post is module 1.2's brief — lead with the arithmetic.

```ini
StartLimitIntervalSec=60
StartLimitBurst=5
RestartSec=5
```

Five retries, five seconds apart, is twenty-five seconds — all of it inside a
sixty-second window.

## What actually happened

## The general shape
