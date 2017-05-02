---
title: |-
  ADO.NET provider for Firebird 2.7.7 released
date: 2012-05-24T13:26:22Z
tags:
  - .NET
  - Databases in general
  - Entity Framework
  - Entity SQL
  - Firebird
  - LINQ
layout: post
---
The 2.7.7 version of ADO.NET provider for Firebird is ready for download. This version contains some bug fixes as well as new functionality.

From bug fixes I'd like to point out to:

* fixes of Firebird events handling and receiving
* FbConnection.GetSchema("ForeignKeyColumns") fixes
* Entity Framework query generator fixes

The functionality is mainly about:

* [database triggers][1]
* `WaitTimeout` being `TimeSpan` rather than plain number

You can find all details in [tracker][2] and download it from [website][3] or [NuGet][4].

[1]: {% include post_link id="232871" %}
[2]: http://tracker.firebirdsql.org/secure/IssueNavigator.jspa?reset=true&pid=10003&fixfor=10466
[3]: http://www.firebirdsql.org/en/net-provider/
[4]: http://nuget.org/packages/firebirdsql.data.firebirdclient