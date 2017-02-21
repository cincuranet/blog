---
title: |
  Instead of triggers in MS SQL and Entity Framework problem
date: 2009-04-18T10:42:00Z
tags:
  - Entity Framework
  - MS SQL Server
layout: post
---
I don't like the model of instead of and after triggers in MS SQL. The before and after ones are, in my opinion, better. Anyway I needed to do some complex tests, not possible with check constraints, before inserting. Hence I jumped into instead of trigger. No problem in a view. Or not? 

The Entity Framework is smart enough to get all server generated columns back when inserting (or updating) – see [StoreGeneratedPattern][1]. But the problem is how the identity column, often used for primary keys, is retrieved. The command issued after insert looks like (particular shape depends on other store generated columns and concurrency checks): `select <PK column> from <some table> where @@ROWCOUNT > 0 and <PK column> = scope_identity()`.The problem is, that if you generate new PK value in trigger, it is different scope. Thus this command returns zero rows and EF will throw exception. 

Hmm, this isn't the way. :( So one of the solutions is move away from instead of triggers and use stored procedures (remember that you need all three) and result binding (you [might be forced][2] to create SPs (of fake ones in SSDL) for some related objects too). It's not easiest solution, but works nice and you don't have to introduce hacks etc.

[1]: http://msdn.microsoft.com/en-us/library/bb738536.aspx
[2]: http://msdn.microsoft.com/en-us/library/cc716711.aspx