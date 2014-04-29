---
title: "ADO.NET provider for Firebird 3.2.0.0 is ready"
date: 2013-10-05T10:06:00Z
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
There's a new version of FirebirdClient waiting for you. Numbered 3.2.0.0. You can get the bits from <a href="http://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient/">NuGet</a> (<a href="http://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient-EF6/">EF6-ready version</a>) or from <a href="http://www.firebirdsql.org/en/net-provider/">FirebirdSQL.org site</a> (or <a href="http://sourceforge.net/projects/firebird/files/firebird-net-provider/3.2.0/">directly</a>).

<!-- excerpt -->

All changes can be found <a href="http://tracker.firebirdsql.org/secure/ReleaseNote.jspa?version=10571&styleName=Text&projectId=10003&Create=Create">in tracker</a>. Most notable. Now we have <a href="{{ site.url }}{% post_url 2013-09-05-233412-nbackup-support-in-firebirdclient %}">support for NBackup</a> and "integrated security" works also on 64bit systems (fix contributed by Nathan Fox). 

Enjoy.
