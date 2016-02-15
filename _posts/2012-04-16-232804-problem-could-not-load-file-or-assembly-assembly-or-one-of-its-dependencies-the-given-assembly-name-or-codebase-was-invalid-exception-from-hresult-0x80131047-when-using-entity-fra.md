---
title: "Problem \"Could not load file or assembly '&lt;assembly&gt;' or one of its dependencies. The given assembly name or codebase was invalid. (Exception from HRESULT: 0x80131047)\" when using Entity Framework's migrate.exe"
date: 2012-04-16T09:59:40Z
tags:
  - Entity Framework
redirect_from: /id/232804/
category: none
layout: post
---
When you use `migrate.exe` from [Entity Framework][1]'s Migrations (in time of writing [4.3.1][2]) you might get the error saying:

> Could not load file or assembly '<assembly>' or one of its dependencies. The given assembly name or codebase was invalid. (Exception from HRESULT: 0x80131047)

That's nice, but nothing special, right? The reason is simple and as lot of magic execution errors it is current/working directory related. To fix it, simply explicitly specify path (relative works) to your assembly using `StartUpDirectory` parameter. And there's another one gotcha. This parameter works only with `:`. Let me explain.

```text
migrate.exe /StartUpDirectory C:\Foo\Bar\Baz
```

Doesn't work (and no error). But this one.

```text
migrate.exe /StartUpDirectory:C:\Foo\Bar\Baz
```

Does.

Hope it saves you some time hunting what's wrong.

[1]: http://nuget.org/packages/entityframework
[2]: http://nuget.org/packages/EntityFramework/4.3.1
