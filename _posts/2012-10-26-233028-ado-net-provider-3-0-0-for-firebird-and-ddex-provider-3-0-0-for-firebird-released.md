---
title: "ADO.NET provider 3.0.0 for Firebird and DDEX provider 3.0.0 for Firebird released"
date: 2012-10-26T13:00:11Z
tags:
  - .NET
  - Databases in general
  - Entity Framework
  - Entity SQL
  - Firebird
  - LINQ
layout: post
---
I'm pleased to announce version 3.0.0 of ADO.NET provider for Firebird and version 3.0.0 of DDEX provider for Firebird. ADO.NET provider 3.0.0 comes with couple of bug fixes and two major improvements.

1. Changed transaction isolation modes
2. New installer that updates machine.config

You can read more about the first at [DNET-337][1]. Basically now ReadCommitted and ReadUncommited are same. And using (among others) `FbTransactionBehavior.RecVersion`/`isc_tpb_rec_version`. That should better match the default behavior a lot of people is expecting.

The new MSI installer now not only installs all the necessary files, but also updates `machine.config` file and registers the assembly into GAC (you can select not to do it). So after full install, you don't have to do anything. You're just ready to go.

The rest of changes can be seen in [tracker log for this version][2].

The DDEX provider 3.0.0 comes with new installer as well. Now when you do the install, the DDEX provider is fully registered into Visual Studio (you can select version(s) during install) and ready to go as well. No need to fiddle with registry or any other files.

Hope you'll enjoy these improvements.

[1]: http://tracker.firebirdsql.org/browse/DNET-337
[2]: http://tracker.firebirdsql.org/secure/IssueNavigator.jspa?reset=true&pid=10003&fixfor=10470