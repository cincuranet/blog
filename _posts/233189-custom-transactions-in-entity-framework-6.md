---
title: |-
  Custom transactions in Entity Framework 6
date: 2013-03-13T14:58:05Z
tags:
  - Databases in general
  - Entity Framework
---
[Entity Framework 6 will come with a nice feature of being able to use custom transactions][1]. You can either manually start new one with some isolation level (in fact this was possible even before, just little bit more code) or - and this is really nice, because I had questions about this (and did some custom hacks in Firebird's provider) couple of times. So I like it. And I like it also because finally the transactions are (at least in my eyes) of same importance as connections (where the support was good before).

<!-- excerpt -->

There's one thing, I think, that will make it even better. Something like "transaction factory". The motivation behind is, that you often need to have a specific set up for the transactions and use it always (with maybe few exceptions). The `UseTransaction` method seems to have one drawback: you need to access the connection (that means either from context or from other place where you stored it) and start the transaction. Later commit or rollback it. You can do it easily for `SaveChanges`/`SaveChangesAsync`. But for queries? You'll need to create and use your own plumbing/infrastructure throughout the code. But adding some point, where you can plug in (and also though resolver/configuration), might make it very easy.

```csharp
// i.e. Func<DbConnection, DbTransaction>
dbContextInstance.TransactionFactory = connection => (connection as MyDbConnection).BeginTransaction(/* some crazy setup */);  // MyDbConnection is the actual store connection
```

Of course, you might say: "And who is going to commit/rollback it?". You might opt-in for default behavior - no error = commit, rollback else. Or handle it manually in some `OnCommit`/`OnRollback` events (or factory again to make it more enterprise-ish 8-)).

Anyway I don't want to discuss all the details of actual implementation or how it aligns to current state. Just a opinion and high level overview of my thoughts.

If you might have questions or need some examples or motivations, let me know in comments. I have handful of these.

[1]: http://entityframework.codeplex.com/wikipage?title=Improved%20Transaction%20Support