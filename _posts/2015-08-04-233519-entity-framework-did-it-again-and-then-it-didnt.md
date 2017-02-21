---
title: |
  Entity Framework did it again. And then it didn't.
date: 2015-08-04T15:43:00Z
tags:
  - NuGet
  - Entity Framework
layout: post
---
If you have been with Entity Framework long enough you remember it had quite a ride with versions. Let's have a small recap, shall we? That will give us some context for recent days.

<!-- excerpt -->

The first version of Entity Framework (at that time called _ADO.NET Entity Framework_) was just `v1`. It was released with .NET 3.5 SP1 (yes, SP1). Then the `v4` came out. There was no `v2` or `v3`. The `v4` had it's number aligned with .NET Framework version (.NET Framework 4 being obviously the version where it was introduced). Then the .NET Framework 4.5 was released. But the next major version of Entity Framework was numbered `v5`. At that time the decision had been made to switch to semantic versioning. Then then `v6` was released. This version was first version not coupled to .NET Framework. It was (is) standalone NuGet package (although previous version had parts as NuGet as well).

The `v6` NuGet package is called `EntityFramework`. I would say a good choice. So you're keeping this one up-to-date and that's it. But lately the started to be some magic happening. Basically creating NuGet package with version in a name - `EntityFramework7` to be exact. Semantic versioning on NuGet goes out of window. When I read the proposal I was laughing. Because it was nice to see another magic going to happen with versions. You can read everything [here][1], [here][2] and [here][3].

Eventually the arguments were so strong the team decided to keep just `EntityFramework` and really stick to versioning. So it's happy end.

It was just so déjà vu.

Some historical references: [link][4], [link][5], [link][6].

[1]: https://github.com/aspnet/EntityFramework/issues/2508
[2]: https://github.com/aspnet/Announcements/issues/42
[3]: https://github.com/aspnet/EntityFramework/wiki/NuGet-Package-Naming
[4]: http://thedatafarm.com/blog/data-access/ef4-ef4-ef4/
[5]: {% post_url 2012-01-13-232666-entity-framework-5-0 %}
[6]: {% post_url 2012-01-15-232675-entity-framework-5-0-2 %}