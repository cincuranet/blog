---
title: "FirebirdClient on NuGet"
date: 2011-08-13T14:31:36Z
tags:
  - .NET
  - Announcements &amp; Invitations
  - Firebird
  - NuGet
redirect_from: /id/232492/
category: none
layout: post
---
Yep, it's done. Now you can download [FirebirdClient][1] from [NuGet][2]. From [nuget.org/List/Packages/FirebirdSql.Data.FirebirdClient][3] to be precise.

It took me a while to find some time to create the package and publish it. But recently I started using NuGet quite often, so assigned this task higher priority.

The build there is same as the default one (targets .NET 4 CLR) you can download from site. Later I'd like to incorporate into package other versions (different CLRs, [Mono][4] builds, ...) too. Maybe the other pieces like WebProviders, DDEX (?) and unstable builds could be there too. I'll think about it more.

Hope you're excited as I'm and you'll enjoy it. :)

[1]: http://www.firebirdsql.org/en/net-provider/
[2]: http://nuget.org
[3]: http://nuget.org/List/Packages/FirebirdSql.Data.FirebirdClient
[4]: http://www.mono-project.com/