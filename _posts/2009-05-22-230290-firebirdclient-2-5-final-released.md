---
title: "FirebirdClient 2.5 Final released"
date: 2009-05-22T07:50:00Z
tags:
  - .NET
  - Entity Framework
  - Firebird
  - LINQ
  - Visual Studio
layout: post
---
I'm happy to announce, after about 47 000 000 seconds of thinking and development, release of FirebirdClient 2.5. This new shiny release contains couple of very interesting new features:

* Entity Framework support. Entity Framework is new, rich OR mapping and modeling tool, sitting on the top of ADO.NET. It is store agnostic, using ADO.NET provider to work smoothly, and the FirebirdClient has now build-in support for it.
* Windows integrated auth. Firebird server is now able on Windows to authenticate users using a system (ActiveDirectory, etc.), and when you omit username and password FirebirdClient will try to negotiate with server this kind of authentication.
* Timeout for wait transactions.

One of the early adopters, SMS-Timing, of Entity Framework support for Firebird comments:

> Thanks to Jiri's ([link][2]) work the Firebird .NET Data Provider made a lot of progress and is now even supporting the Entity Framework. Because of the adaptations we were able to use the newest .NET technologies in a modern programming environment together with a well known Firebird Database. In our industry (entertainment) the customers expect new and exciting software, and therefore the development tools need to be cutting edge. These developments in Firebird have a big impact on our products, and we hope that it brings the same boost to the Firebird Community itself. A preview of our newest software: [www.fast4thefuture.com][3], [http://www.sms-timing.com/en/software_kiosk.php][4].


You can download the new version on [http://www.firebirdsql.org/index.php?op=files&id=netprovider][5].

[1]: http://tracker.firebirdsql.org/sr/jira.issueviews:searchrequest-printable/temp/SearchRequest.html?&pid=10003&fixfor=10170&fixfor=10340&fixfor=10261&fixfor=10240&fixfor=10230&status=5&status=6&sorter/field=issuekey&sorter/order=DESC&tempMax=1000
[2]: http://www.x2develop.com/
[3]: http://www.fast4thefuture.com/
[4]: http://www.sms-timing.com/en/software_kiosk.php
[5]: http://www.firebirdsql.org/index.php?op=files&id=netprovider