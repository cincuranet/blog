---
title: |-
  Error "The operation could not be completed" or "Exception has been thrown by the target of an invocation." when opening LINQ to SQL file in VS2008
date: 2008-05-08T13:21:00Z
tags:
  - LINQ
  - Visual Studio
---
Today I get error `The operation could not be completed` when I was trying to open *.dbml LINQ to SQL file. I have this developement environment in virtual machine and I did no installs or updates. Event Log also wasn't saying anything that could help. First classic shoots like restart, cleaning all temps, caches etc. - nothing. Still same problem.

I've tried to add new dbml to project (in worst case, I was ready to copy to content of files, because build was OK). Heureka, designer opened like a charm. But, :) when I dropped some table on designer's surface I got error `Exception has been thrown by the target of an invocation.`. Hmm, damn.

Thanks my paranoia I have backups of a lot of stuff, virtuals too. 1-2 hours of installing and I was back. When configuring my new-old machine everything worked fine. So I've installed some experimental stuff like Entity Framework beta, some VS updates required and added DDEX for Firebird. Just quick click-click-next-next. I opened the project and wanted to open dbml file, oh, the error was back again.

After this, I incidentally realised, that I've removed FirebirdClient assembly from GAC after installing DDEX. To make DDEX work I've installed 2.1 version, 'cause I have it built. But for testing Entity Framework support I'm using 2.5.x version and I was planning to add it later, 'cause I had no built assembly near my hands. Exactly this (removing FirebirdClient from GAC) I did few days ago, when I was debugging some reported issue. And that was the problem! How innocent and how devastating. :D

Adding assembly back to GAC solved the problem. Hope this helps somebody. ;) Wish I've found it sooner and saved time with copying and installing stuff.