---
title: |-
  Faster MS SQL database existence checking with Entity Framework Core and Entity Framework 
date: 2018-10-03T09:31:00Z
tags:
  - Entity Framework Core
  - MS SQL Server
  - Azure SQL
  - SqlClient
---
Bit out of frustration when demoing features newest versions of Entity Framework Core, I've found out a new feature of `SqlClient` (`SqlConnection` to be precise) that's available since .NET 4.5.1 that might affect speed when working often without existing database.

<!-- excerpt -->

What I'm talking about is [_Idle Connection Resiliency_ feature][1] (oddly I've found only PHP version). For our discussion the important part is that `SqlClient` performs retry with a small delay when opening the connection fails. This is usually good. But there are at least two places, when using Entity Framework Core or Entity Framework, where this is not desired.

One is when executing _Migrations_ and not having a database at all. The other is when using `EnsureDeleted` and `EnsureCreated` combination, like when executing (integration) tests. Luckily the solution is pretty easy. Simply add `ConnectRetryCount=0` to the connection string and you're good to go. This will turn off the _Idle Connection Resiliency_ feature, thus it's not without, maybe, undesired side-effect.  

Let's see this in action. Below is simple code that uses `EnsureDeleted` and `EnsureCreated` (the `ElapsedRestart`, as the name suggests, returns elapsed time and restarts the stopwatch).

```csharp
using (var db = new MyContext())
{
	var sw = Stopwatch.StartNew();
	Console.WriteLine("Deleting");
	db.Database.EnsureDeleted();
	Console.WriteLine(sw.ElapsedRestart());
	Console.WriteLine("Creating");
	db.Database.EnsureCreated();
	Console.WriteLine(sw.ElapsedRestart());

	Console.WriteLine();

	Console.WriteLine("Deleting");
	db.Database.EnsureDeleted();
	Console.WriteLine(sw.ElapsedRestart());
	Console.WriteLine("Creating");
	db.Database.EnsureCreated();
	Console.WriteLine(sw.ElapsedRestart());
}
```

Without the `ConnectRetryCount=0` we can roughly 10 seconds delay first during `EnsureDeleted`, because the database does not exist and then in second batch during `EnsureCreated`, for the same reason. 

```plain
Deleting
00:00:11.3410613
Creating
00:00:00.4671336

Deleting
00:00:00.0261642
Creating
00:00:10.2167985
```

Adding the `ConnectRetryCount=0` makes it flow without any delays.

```
Deleting
00:00:00.7322148
Creating
00:00:00.4016524

Deleting
00:00:00.0207446
Creating
00:00:00.1830252
```

At the moment this cannot be changed programmatically, thus there's not much Entity Framework Core or Entity Framework can do. But it's already tracked ([CoreFX][2], [EFCore][3], [EF6][4]), so there's a hope.  

[1]: https://docs.microsoft.com/en-us/sql/connect/php/connection-resiliency?view=sql-server-2017
[2]: https://github.com/dotnet/corefx/issues/14644
[3]: https://github.com/aspnet/EntityFrameworkCore/issues/7283
[4]: https://github.com/aspnet/EntityFramework6/issues/148