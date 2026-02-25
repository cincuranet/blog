---
title: |-
  Introducing FirebirdDbComparer - library for comparing Firebird databases to create alter scripts
date: 2018-07-09T06:18:00Z
tags:
  - Firebird
  - .NET
  - .NET Core
  - Databases in general
---
When I first heard the idea of writing library for comparing databases' structures and producing alter scripts I thought it was a joke. I believed it would take months of work to get it into production quality, handling all the different cases and often also bugs or limitations in Firebird. That was 2015. It's 2018 now and I'm here, ready to introduce it.

<!-- excerpt -->

In 2015, when the idea started in SMS-Timing, I was skeptical about my ability to lift it from the ground in workable time-frame. Thus, for the hardest pushes, very sharp developer and friend Danny Van den Wouwer was brought over and we worked - mostly - together. In fact, Danny is one of the few people I ever worked with, when I needed to go for a [run][1] to "decompress", because my head hurt (literally) as we pushed each other.

In SMS-Timing the library was used since 2015/2016 extensively, in 2017 we had to do only few minor bug fixes. Based on confidence from that, I started pushing the idea of making it freely available (binary as well as source code). So here it is.

Hence if you need to compare to Firebird databases and generate alter scripts - both in text only as well as structured output you can process in your application further - this library is for you. Head to the [_FirebirdDbComparer_ page][2], read more technical text, get it and contribute if you find it useful.

[1]: https://www.strava.com/activities/1009527699
[2]: /tools/firebird-db-comparer