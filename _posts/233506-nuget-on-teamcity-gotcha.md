---
title: |-
  NuGet on TeamCity gotcha
date: 2015-05-10T11:40:00Z
tags:
  - TeamCity
  - Continuous Integration
---
I was moving our build server to new hardware and as I was checking whether everything works as expected - some builds have pretty complicated environment setup - I found issue or let's say behavior that might not be obvious related to [NuGet][2] handling on [TeamCity][1].

<!-- excerpt -->

The NuGet, by definition, contains all packages ever published. Because you don't know who might be using it (and might need to re-download it). But NuGet packages published by TeamCity from builds are artifacts as any other. And when the history of build configuration is [cleaned up][3] depending on your settings also the packages are effectively removed from the feed.

Then when you have a project that is using that "old" version you might have trouble building (I suppose you're not putting packages into VCS, of course) it. Luckily with TeamCity being, likely, your own build server you might be able to use some newer version (never a bad idea to use up-to-date binaries) or resolve some incompatibilities.

Thinking about it it makes perfect sense. It's the result of the behavior. But it's good to think about it in advance. Maybe having the clean up policy for the packages with bit more longer interval than other projects.

[1]: https://www.jetbrains.com/teamcity/
[2]: http://www.nuget.org/
[3]: https://confluence.jetbrains.com/display/TCD9/Clean-Up