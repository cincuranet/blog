---
title: |-
  FbNetExternalEngine 2.0 released - functions and performance
date: 2019-07-08T18:38:00Z
tags:
  - Firebird
  - .NET
---
It has been few exciting weeks and days lately and today I'm happy to introduce you to [_FbNetExternalEngine_][1] version 2.0. This version adds support for functions and also improves performance (on top of [previous improvements][2]).

<!-- excerpt -->

Let's start with functions. It's pretty simple. You have a static function that accepts and returns one of the supported types (see [docs][1]) and you can then declare in the database using the `external name` and `engine` clauses. Usage is as with any other function. Comparing the performance, empty function invocation takes about 2,6 μs on my machine and is about 2,6 times slower compared to PSQL. Obviously once the function actually does something the performance against PSQL starts improving.

Speaking about performance. I have spent quite some time in various tools looking for ways to improve. And it was always humbling - when I thought I can't find a way to make that part of code faster, I always found a way later and it was not even so much hacking and so on. Both functions and procedures benefit from any improvement, because there's a lot code shared across both paths. To give you some numbers, compared to previous release, the procedures are about 10-15% faster. And I'm not done. I have already few ideas how to improve even more, if it works. Can't wait to try it out (but I also wanted to release the functions support).

Documentation, examples and performance numbers are available on [this page][1].

Last but not least big thanks to [SMS-Timing][3] for sponsoring my work on the plugin.

[1]: /tools/fb-net-external-engine
[2]: {% include post_link, id: "233788" %}
[3]: http://www.sms-timing.com/