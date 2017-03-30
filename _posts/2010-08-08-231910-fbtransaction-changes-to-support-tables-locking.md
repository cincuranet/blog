---
title: |-
  FbTransaction changes to support tables locking
date: 2010-08-08T17:52:42Z
tags:
  - .NET
  - Firebird
layout: post
---
[Firebird][1] has a feature allowing you to specify tables you want to lock (read or write and exclusive/protected/shared) when starting transaction. <small>(Note that Firebird still uses [MGA/MVCC][2]. This is just a feature to support some scenarios.)</small> We had constants in [ADO.NET Provider for Firebird][3] for some time, but using them resulted in wrong parameters being sent to the server and followed by exception. :)

Today I implemented support for this locking ([tracker item][4], [mailing list thread][5]). That means sending proper sequences. The [`FbTransactionOptions` class created earlier for timeout support][6] was extended with new property `LockTables`. You can use to specify table name and lock specification. The lock specification there is in fact only subset of all options you can specify for transaction (same enumeration). You can put there whatever you want other options will be simply ignored.

Small example:

```csharp
conn.BeginTransaction(new FbTransactionOptions()
	{
		TransactionBehavior = FbTransactionBehavior.ReadCommitted,  // etc.
		LockTables = new Dictionary<string, FbTransactionBehavior>
		{
			{ "TABLE_1", FbTransactionBehavior.LockWrite | FbTransactionBehavior.Shared },
			{ "TABLE_2", FbTransactionBehavior.LockWrite | FbTransactionBehavior.Exclusive }
		}
	});
```

Here I'm specifying that for `TABLE_1` shared (huh :)) write lock will be placed and for `TABLE_2` exclusive (that sounds better, isn't it?) write lock will be placed. Similarly you can go with `LockRead`.

Available right now in [weekly builds][7] and [SVN][8].

[1]: http://www.firebirdsql.org
[2]: http://en.wikipedia.org/wiki/Multiversion_concurrency_control
[3]: http://www.firebirdsql.org/index.php?op=files&id=netprovider
[4]: http://tracker.firebirdsql.org/browse/DNET-338
[5]: http://firebird.1100200.n4.nabble.com/Transaction-configuration-with-the-ADO-NET-Data-provider-for-Firebird-td2311603.html
[6]: {% post_url 2008-10-20-228524-timeout-for-wait-transactions-in-firebirdclient %}
[7]: http://netprovider.cincura.net
[8]: http://firebird.svn.sourceforge.net/viewvc/firebird/NETProvider/