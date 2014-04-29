---
title: "ADO.NET provider for Firebird 3.1.0.0 is ready"
date: 2013-07-30T06:40:58Z
tags:
  - .NET
  - Announcements &amp; Invitations
  - C#
  - Databases in general
  - Entity Framework
  - Entity SQL
  - Firebird
  - LINQ
  - SQL
  - Visual Studio
category: none
layout: post
---
With <a href="{{ site.url }}{% post_url 2013-07-29-233371-firebirds-ado-net-provider-sources-has-a-new-home %}">yesterday's sources move</a> I have another good news. The version 3.1.0.0 of ADO.NET provider for Firebird is ready for your download!

<!-- excerpt -->

This version fixes few issues from previous version and adds some new features. For example sweep and error logging support to TraceAPI, support in installer for x64 systems, bunch of fixes in current Entity Framework support as well as initial support for Entity Framework 6 (download package with "EF6" in name). 

Entity Framework 6 is not currently released as RTM (thus there might be changes). Everything from infrastructure point of view should work, currently only full async stack is missing (for whole ADO.NET) and "Migrations" SQL generator.

Description of all changes is available in <a href="http://tracker.firebirdsql.org/secure/IssueNavigator.jspa?reset=true&pid=10003&fixfor=10491">tracker</a>.

You can get the bits from <a href="http://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient/">NuGet</a> (recommended) or from <a href="http://www.firebirdsql.org/en/net-provider/">FirebirdSQL.org site</a> (or <a href="http://sourceforge.net/projects/firebird/files/firebird-net-provider/3.1.0/">directly</a>).

Enjoy.
