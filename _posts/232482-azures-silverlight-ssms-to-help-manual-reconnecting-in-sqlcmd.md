---
title: |-
  Azure's Silverlight SSMS to help manual reconnecting in sqlcmd
date: 2011-08-11T12:03:28Z
tags:
  - Azure
  - Azure SQL
---
I'm a console guy. I like to work from whatever is text based (yes, I do remember DOS (the real one, not the black hole window in Windows), I'm old ;)). That's why I'm doing most of my MS SQL Server/Azure SQL database work though `sqlcmd`. But on Azure SQL I'm often being disconnected because I'm reading the results, testing something etc. and the connection is simply closed by server to save resources. Reconnecting is pain and slows me down.

But yesterday I was working in Silverlight version of SSMS that's available on Azure (although you can connect to any other server), just to try it. Well it's little bit slower, but it has a query window so I'm able to type command and that's what I need (maybe some shortcut to execute it). And I realized, that even if I'm not doing anything for couple of minutes, the connection is reopened when I start doing something.

That's nice. I don't have to install full blown SQL Server Management Studio and still have comfortable work.