---
title: "Firebird Embedded in comparison to SQL Server Compact Edition 4"
date: 2010-07-04T15:00:11Z
tags:
  - .NET
  - Databases in general
  - Entity Framework
  - Entity SQL
  - Firebird
  - LINQ
  - MS SQL Server Compact Edition
layout: post
---
Scott Guthrie recently posted article about [New Embedded Database Support with ASP.NET][1]. This made me think about other options, [Firebird][2] in particular, and advantages and disadvantages. What I'm going to do is to very shortly introduce [Firebird Embedded][3] here and then compare it with features Scott wrote in his article.

Firebird Embedded, shortly, is Firebird database server in one DLL. No need to install etc., just load this DLL and use it. To be precise, there are some other DLLs, i.e. to support national charsets, but it's still in under 10MB all. The database itself is built from same sources as "full" server and it's not limited in any way.

_Works with Existing Data APIs_ - as I said, Firebird Embedded is based on same codebase as "full" server, thus the SQL and API is same. And not only this, the ADO.NET provider for Firebird works with it and you're programming using same thinking.

_No Database Installation Required_ and _Database Files are Stored on Disk_ - databases created by Firebird Embedded are stored wherever you want, with any extension. Firebird itself doesn't have any `master` database, thus even the "full" server works with any (valid database) file.

_Shared Web Hosting Scenarios Are Now Supported with SQL CE 4_ - sure you don't need to install anything with Firebird Embedded, that's why it's called Embedded. And not only this, from version 2.5, you can open database from different processes, i.e. IIS worker process and Apache workers or some console application doing something in background.

_ Visual Studio 2010 and Visual Web Developer 2010 Express Support_ - as the tool set for Firebird Embedded is exactly same as for "full" Firebird, you can use DDEX (aka Server Explorer support), Entity Framework (LINQ), ...

_ Supports Both Development and Production_ - this is something I'm silently expecting. But yes, you can do the same with Firebird Embedded too.

_ Easy Migration to SQL Server _ - ahh, my favorite point. The Firebird Project has of course whopping number of tools to support migration from Embedded to "full". The most used is … nothing. The databases are fully compatible and you can switch servers without any other tools, migration, conversion, … Just place it where you want it and connect to it, either with "full" or Embedded Firebird. And to switch your application? Again nothing. Same ADO.NET provider, just change connection string, if needed. Mostly you'll add server IP address and maybe different path and manually switch server type, if you want. Really the migration is so simple. It is one minute task and thanks to same tool set, no matter what you version your targeting during development, your application will work with the other as well without any additional effort.

You like Firebird Embedded? I do, a lot. SQL Server Compact Edition 4 looks promising, but Firebird has something to offer as well. And recall, it's based on same sources as "full" Firebird, very mature codebase, examined with tons of installations.

[1]: http://weblogs.asp.net/scottgu/archive/2010/06/30/new-embedded-database-support-with-asp-net.aspx
[2]: http://www.firebirdsql.org
[3]: http://www.firebirdsql.org/manual/fbmetasecur-embedded.html