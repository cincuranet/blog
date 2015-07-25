---
title: "Firebird - unique index vs. unique constraint"
date: 2008-04-14T19:29:00Z
tags:
  - Firebird
redirect_from: /id/227384/
category: none
layout: post
---
From time to time I got a question about the difference between unique key and unique constraint. Both elements enforcing uniqueness across values in column(s). But the unique index cannot be used in referential integrity constraints. The unique index can be considered as a "tool" for unique constraint.
