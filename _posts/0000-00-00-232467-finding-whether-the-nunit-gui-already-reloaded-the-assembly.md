---
title: |-
  Finding whether the NUnit GUI already reloaded the assembly
date: 2011-06-20T12:14:57Z
tags:
  - NUnit
  - Test Driven Development (TDD)
layout: post
---
When I'm fixing bugs found by [unit tests][1] it's quick process - run test, spot the problem, fix it, build, run again. The problem is, that often, during the build I switch to other window and then to [NUnit][2] GUI. And then I don't know whether the assembly with tests was already reloaded (and hence contains the fix) or not. So I often reloaded it again, just to be sure a.k.a wasting time.

But today I found a way to distinguish that. When the tests are done, the progress bar is at 100% (and has some color based on result of the test run). After (automatic) reloading, the progress bar is at 0% (so no color).

Easy, isn't it?

[1]: http://en.wikipedia.org/wiki/Unit_testing
[2]: http://www.nunit.org/