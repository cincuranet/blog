---
title: |-
  Entity Framework and Firebird Embedded
date: 2009-04-13T16:03:00Z
tags:
  - Entity Framework
  - Firebird
---
Did you ever think about how cool would it be to have fully featured SQL database, without installation (just `xcopy`) and with Entity Framework support?

I was wondering whether the Entity Framework support I'm creating in FirebirdClient will work with Embedded version. Taking into account that the communication layers are under the EF support, there should be no problem. But you'll never be sure until you try it. ;) And it works!

So what you need to do? Well almost nothing. Just change connection string and it works. But maybe you're starting with fresh app, thus I'll give you some advices. To be able to generate proper model (at least the SSDL), you need 2.5 Beta 1 (released couple days ago) – it has the left outer join bug fixed. Also since 2.5 you'll be able to connect to database using different applications, therefore debugging the application and using i.e. isql together is even easier. On the development machine you probably already have .NET Framework 3.5 with SP1, but also remember to have it on target machine. (Saying that you need FirebirdClient is I think worthless. ;))

And that's pretty much it. After you finish your app you can deploy it with i.e. 2.1 Embedded (it's the current stable), the app will run just fine.

Isn't it nice? Full power of proper database server and full power of Entity Framework all in one.