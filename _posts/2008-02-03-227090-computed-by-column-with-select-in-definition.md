---
title: "Computed by column with select in definition"
date: 2008-02-03T11:50:00Z
tags:
  - Firebird
redirect_from: /id/227090/
category: none
layout: post
---
Imagine, you want to create computed by column with select in definition (on Firebird, of course). I never needed this, and I thought, it's not possible (from some trivial tests). But Slavek Skopalik demonstrated me the opposite. There's a tricky part with braces (you have to be strict and keep syntax). So you have to write `... computed by ((select x from y ...)) ...`. Cool, isn't it? ;)
