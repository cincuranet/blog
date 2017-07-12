---
title: |-
  Useful methods on Entity Framework Core's DbContext
date: 2017-07-12T14:42:00Z
tags:
  - Entity Framework
  - Entity Framework Core
---
I completely missed some handy methods on Entity Framework Core's `DbContext`. Maybe you did too. And that would be a pity.

<!-- excerpt -->

The methods I'm talking about are known to you for sure. These methods were originally available (and still are) on `DbSet<T>` - `Add`, `Remove`, `AddRange`, `RemoveRange`. The problem with having these on `DbSet<T>` is that you have to know the type (or the `DbSet<T>` property) to call these. Doable, but clearly not a smooth sailing. Instead of using _reflection_ you might end up using _change tracker_ directly, where most of the methods take or return plain `object` values.

On Entity Framework Core the path is super easy. These methods are available directly on `DbContext`. For example [`Add(object)`][1] and [`Add<TEntity>(TEntity)`][2]. What's more, as I mentioned, these methods are `virtual` and thus you can _override_ these and put a custom logic there, if you need to (don't forget this isn't the only way to i.e. add object to the _change tracker_).

Looks like somebody was thinking about this. Thumbs up.

[1]: https://github.com/aspnet/EntityFramework/blob/dev/src/EFCore/DbContext.cs#L810
[2]: https://github.com/aspnet/EntityFramework/blob/dev/src/EFCore/DbContext.cs#L641