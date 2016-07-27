---
title: "Continuous builds for Entity Framework"
date: 2012-08-12T16:52:50Z
tags:
  - .NET
  - Continuous Integration
  - Entity Framework
  - Entity SQL
  - LINQ
  - TeamCity
redirect_from: /id/232986/
layout: post
---
If you're following everything around [Entity Framework][1] at least a little you know it's now open source. Except the obvious think of having sources available for study, bug finding, improvements etc. there's also option to play with bleeding edge features available. If you're into it or there's one particular bug fix that changes the world for you into piece and happiness instantly I have a good news for you.

On my build server I set up continuous build (after every commit) and all the binaries that Entity Framework solution produces are precooked for you. The top level folder in the [package][2] is always the revision "number" so you know from what commit the build is.

Currently I'm running unit tests, but ignoring results. Because some are failing. :) I'll try to solve the problems soon.

If there'll be interest I can also create automatically [NuGet][3] package and publish it, currently don't know it's worth, considering it's really from every commit and thus probably very unstable.

Go grab the [package][4] and have fun.

> 18.9.2012: Entity Framework nightly builds are now available at [CodePlex][5].

[1]: http://msdn.com/ef
[2]: http://build.cincura.net/guestAuth/repository/download/bt11/.lastSuccessful/EF.zip
[3]: http://www.nuget.org
[4]: http://build.cincura.net/guestAuth/repository/download/bt11/.lastSuccessful/EF.zip
[5]: http://entityframework.codeplex.com/wikipage?title=Nightly%20Builds