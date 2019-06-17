---
title: |-
  FbNetExternalEngine 1.0.1 with performance improvements
date: 2019-06-17T11:02:00Z
tags:
  - Firebird
  - .NET
---
Today I'm releasing first small update to the [_FbNetExternalEngine_][1]. The focus is just on performance. No new features were added.

<!-- excerpt --> 

The performance improvements are not huge, just a few percent here and there. But every little counts. Although I did some low level - where readability and maintainability takes a small hit - optimizations already, I want to first see more real world numbers, because the invocation time is one thing, but the code inside is another (and probably more time will be spent there).

Current numbers and download are available on the [docs page][1].  

[1]: /tools/fb-net-external-engine