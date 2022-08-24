---
title: |-
  Easier nullable reference types errors instead of warnings
date: 2022-08-24T08:42:00Z
tags:
  - C#
  - MSBuild
  - Roslyn
---
Three years ago (yes, I looked it up), I wrote a [blog post][1] about switching from warnings in NRT to errors. But it required manually adding codes for all the warnings (luckily thanks to Roslyn being open source, it's not that difficult) and keeping that list up to date. But recently I found much simpler way.

<!-- excerpt -->

Now, at least with C# 10 and VS 2022, you can simply use `<WarningsAsErrors>nullable</WarningsAsErrors>` instead of `<WarningsAsErrors>CS8600;CS8602;CS8603;...</WarningsAsErrors>`.

![<WarningsAsErrors>nullable</WarningsAsErrors>]({{ include "post_ilink" page "nullable.gif" }})

This is much easier to setup and maintain.

[1]: {{ include "post_link" 233764 }}
