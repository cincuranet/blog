---
title: "Timeout for wait transactions in FirebirdClient"
date: 2008-10-20T17:24:00Z
tags:
  - .NET
  - Firebird
layout: post
---
I have implemented new feature available from FB2.0, it's [timeout for wait transaction][1]. It's a nice feature, 'cause you can specify how long do you wanna wait before getting deadlock error. Thanks also to Dmitry Yemanov for debug (that also revealed couple of new bugs; now already fixed).

The current implementation is pretty straightforward. If you don't specify timeout then it's not used (which is important [for <FB2.0][2]). Else (and you're using wait transactions) is used. :) With this I redesigned a little bit the options for transactions. Now it's more flexible and open for future improvements. Defining options for transaction is little bit different:

```csharp
conn.BeginTransaction(new FbTransactionOptions() { TransactionBehavior = FbTransactionBehavior.Wait, WaitTimeout = 3 }))
```

Of course, you can create options object separately and put to method only variable. Changing old code to new one is just couple of rewriting, no new logic.

[Enjoy][3]!

[1]: http://tracker.firebirdsql.org/browse/DNET-165
[2]: http://tracker.firebirdsql.org/browse/DNET-193
[3]: https://netprovider.cincura.net/