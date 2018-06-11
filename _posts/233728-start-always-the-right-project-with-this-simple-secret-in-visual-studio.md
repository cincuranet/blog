---
title: |-
  Start always the right project with this simple secret in Visual Studio
date: 2018-06-11T11:05:00Z
tags:
  - Visual Studio
---
You know that feeling. You're working in a project, hammering awesome code line after line. And then you hit F5 to see the magnificence, ..., and a wrong project starts. Or you're testing multiple applications and always clicking _Set as Startup Project_. Not anymore. I'll show you a small little secret that will make this pain a history (or at least will eliminate portion of it).

<!-- excerpt -->

Right-click on a solution node and select _Set StartUp Projects..._. The small little radio button on top, called _Current selection_ is your target.

![Current selection]({% include post_ilink, post: page, name: "current_selection.png" %})

From now on, whatever file is opened in editor or whatever file (or any node) is selected in the _Solution Explorer_, marks the corresponding project as a startup project. Here you can see it in action.

![Demo]({% include post_ilink, post: page, name: "demo.gif" %})

Given that all of this can be done easily using a keyboard, I think, in skilled hands, it can be a good timesaver.