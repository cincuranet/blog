---
title: |-
  Logging and caching queries in EF
date: 2009-06-14T12:03:55Z
tags:
  - .NET
  - Entity Framework
  - Firebird
  - LINQ
layout: post
---
[Jarek Kowalski][1] posted to MSDN Code Gallery [wrappers][2] for any ADO.NET Entity Framework provider with ability to do caching and logging.

For me especially the logging (EFTracingProvider) is interesting, as I'm always checking queries sent to database. For selects it's plausible with [ToTraceString][3] method (but not with i.e. query.First()), but looking for CUD is not so easy. With [EF provider for Firebird][4], you can check, by default, Output window of Visual Studio, where all queries are placed or use any listener to write these i.e. to the file (this logging is only in debug builds of FirebirdClient).

I was thinking about creating some wrapped provider, but this is better (and without work ;)).

[1]: http://blogs.msdn.com/jkowalski/archive/2009/06/11/tracing-and-caching-in-entity-framework-available-on-msdn-code-gallery.aspx
[2]: http://code.msdn.com/EFProviderWrappers
[3]: {% post_url 2008-05-26-227674-how-to-show-sql-command-created-by-entity-framework %}
[4]: http://www.firebirdsql.org/index.php?op=files&id=netprovider