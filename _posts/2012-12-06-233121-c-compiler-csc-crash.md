---
title: "C# compiler (CSC) crash"
date: 2012-12-06T11:03:52Z
tags:
  - C#
  - Programming in general
redirect_from: /id/233121/
category: none
layout: post
---
Last week I was doing fairly simple change in a project I'm currently working on daily. Added a controller, model, few DTOs and orchestrated all this together using some methods from "library". I had clean focus what to do and some pieces of new methods I already had in existing methods. So I partly also did small refactoring. While typing the code I noticed the red squiggles etc. are behaving weird already. When I was done with change I invoked build process and suddenly everything went wrong.

First: 

![image]({{ site.url }}/i/233121/csharp_crash.png)

Quickly followed by: 

![image]({{ site.url }}/i/233121/csharp_crash2.png)

Well, let's try some basic healing steps. Restarting Visual Studio (2012); no luck. Deleting all `bin`, `obj` etc. and restarting Visual Studio; no luck either. OK, time to use big guns. Restarting complete machine; no luck.

Looking at the detailed build log I found (among tens of other errors below):

```plain
CSC : error CS0583: Internal Compiler Error (0xc0000005 at address 00FE7AFB): likely culprit is 'BIND'
```

Little bit search on internet didn't brought anything helpful. So I decided to reproduce it. If it was working five minutes ago, it's not going to be hard to pinpoint what caused it. So I created copy of project's current state and reverted back. Then I started slowly adding pieces back and/or copying new files back. Surprisingly (and luckily) the problem went away.

Probably some bad coincidence, order of files, ..., who knows. Thus if you face same or seemingly same error, try to redo your steps from working state. It's probably going to work. And if not, report it, you have a reproducible test case, what's better, isn't it?
