---
title: |
  Name and path of .NET program accessing Firebird database
date: 2008-12-05T08:25:00Z
tags:
  - .NET
  - Firebird
layout: post
---
Firebird 2.1 has a feature called monitoring tables. You can look at what's going on inside the database - like connections, running commands etc. For `mon$attachments` there's column called `mon$remote_process`, where you can find path (from client POV, of course) to the program. But this needs cooperation from client. And from now, FirebirdClient (ADO.NET provider for Firebird) does this cooperation. So when you connect to Firebird with your .NET application, you (or maybe better admin) is able to look at above mentioned table(s) and see what commands is your application executing etc.