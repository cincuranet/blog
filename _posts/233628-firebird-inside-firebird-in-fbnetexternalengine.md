---
title: |-
  Firebird inside Firebird in FbNetExternalEngine
date: 2017-06-05T09:54:00Z
tags:
  - .NET
  - C#
  - Databases in general
  - Firebird
  - SQL
---
Because I can load any .NET code in [_FbNetExternalEngine_][1] I had and idea, probably since November last year, to try to load Firebird Embedded inside it all that in server (I know completely useless). So I did it.  

<!-- excerpt -->

#### Regular TCP/IP connection to Firebird

Initially I started with something less challenging. Just connecting back to [Firebird][2] to know everything in [FirebirdClient][3] is working fine in my environment.

```csharp
public static IEnumerator<ValueTuple<string>> NetworkSelect(string connectionString, string command)
{
	using (var conn = new FbConnection(connectionString))
	{
		conn.Open();
		using (var cmd = conn.CreateCommand())
		{
			cmd.CommandText = command;
			using (var reader = cmd.ExecuteReader())
			{
				while (reader.Read())
				{
					var values = new object[reader.FieldCount];
					reader.GetValues(values);
					yield return ValueTuple.Create(string.Join("|", values.Select(x => x.ToString().Trim())));
				}
			}
		}
	}
}
``` 

```sql
recreate procedure network_select(connection_string varchar(1000), command varchar(1000))
returns (item varchar(4000))
external name 'FooBar!FooBar.FirebirdOverNetwork.NetworkSelect'
engine FbNetExternalEngine;
```

I made the `NetworkSelect` procedure open with parameters to be able to play with it a little. I did simple test running `select * from network_select('database=localhost:ext;user=sysdba;password=masterkey', 'select * from mon$attachments');`.

With `SET LIST ON` is received this nice result.  

```text
ITEM                            51|8480|0|C:\USERS\JIRI\DOCUMENTS\DEVEL\BIN\FBNETEXTERNALENGINE\EXT|Cache Writer|||||0|30.05.2017 10:15:26|1||14||||||1

ITEM                            52|8480|0|C:\USERS\JIRI\DOCUMENTS\DEVEL\BIN\FBNETEXTERNALENGINE\EXT|Garbage Collector|||||0|30.05.2017 10:15:26|1||15||||||1

ITEM                            54|8480|1|C:\USERS\JIRI\DOCUMENTS\DEVEL\BIN\FBNETEXTERNALENGINE\EXT|SYSDBA|NONE|TCPv4|127.0.0.1/61365|8480|0|30.05.2017 10:15:29|1|C:\Users\Jiri\Documents\devel\bin\FbNetExternalEngine\firebird.exe|16|5.9.1.0|P13|x2pc|Jiri|Srp|0

ITEM                            53|8480|1|C:\USERS\JIRI\DOCUMENTS\DEVEL\BIN\FBNETEXTERNALENGINE\EXT|SYSDBA|NONE|TCPv6|::1/61364|8952|4|30.05.2017 10:15:26|1|C:\Users\Jiri\Documents\devel\bin\FbNetExternalEngine\isql.exe|28|WI-V3.0.2.32703 Firebird 3.0|P15|x2pc|jiri|Srp|0
```

I think I'm ready to try Embedded.

#### Native connection using Embedded

Just to clarify why is this so tempting (and geeky as well). The flow is roughly as this: Firebird Server (native) → FbNetExternalEngine (native to managed) → procedure (managed) → FirebirdClient (managed to native) → `fbclient.dll` (native). Pretty awesome, right? ;)

```csharp
public static IEnumerator<ValueTuple<DateTime?>> MagicHappensHere(string name)
{
	var baseDir = Path.GetDirectoryName(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location));
	var builder = new FbConnectionStringBuilder()
	{
		Database = Path.Combine(baseDir, "plugins", name),
		ServerType = FbServerType.Embedded,
		UserID = "sysdba",
		ClientLibrary = Path.Combine(baseDir, "fbclient.dll"),
	};
	var connectionString = builder.ToString();
	FbConnection.CreateDatabase(connectionString, true);
	using (var conn = new FbConnection(connectionString))
	{
		conn.Open();
		using (var cmd = conn.CreateCommand())
		{
			cmd.CommandText = "select mon$creation_date from mon$database";
			yield return ValueTuple.Create((DateTime?)cmd.ExecuteScalar());
		}
	}
}
```

```sql
recreate procedure magic_happens_here(name varchar(100))
returns (item timestamp)
external name 'FooBar!FooBar.FirebirdEmbedded.MagicHappensHere'
engine FbNetExternalEngine;
```

In this code I create a new Firebird database based on the parameter and then I return the date and time when it was created (which should be pretty much "now"). Simple execution `execute procedure magic_happens_here('test.fdb');` with the result.

```text
                     ITEM
=========================
2017-05-30 10:32:40.9470
```

#### From Firebird to SQL Azure

At this point I realized, although this is a nice test, I can do something useful. I created [Azure SQL][4] database with AdventureWorksLT content and went coding. What about selecting all products? Maybe for import that would make sense.

```csharp
public static IEnumerator<(int?, string, string)> AdventureWorksProducts()
{
	using (var conn = new SqlConnection(AzureConnectionString))
	{
		conn.Open();
		using (var cmd = conn.CreateCommand())
		{
			cmd.CommandText = "select ProductId, Name, ProductNumber from SalesLT.Product";
			using (var reader = cmd.ExecuteReader())
			{
				while (reader.Read())
				{
					var productId = (int?)reader.GetInt32(0);
					var name = reader.GetString(1);
					var productNumber = reader.GetString(2);
					yield return (productId, name, productNumber);
				}
			}
		}
	}
}
```

```sql
recreate procedure adventure_works_products()
returns (product_id int, name varchar(50) character set utf8, product_number varchar(25) character set utf8)
external name 'FooBar!FooBar.FetchFromAzure.AdventureWorksProducts'
engine FbNetExternalEngine;
```

Execution couldn't be simpler - `select * from adventure_works_products;`.

```text
  PRODUCT_ID NAME                                               PRODUCT_NUMBER
============ ================================================== =========================
         680 HL Road Frame - Black, 58                          FR-R92B-58
         706 HL Road Frame - Red, 58                            FR-R92R-58
         707 Sport-100 Helmet, Red                              HL-U509-R
         708 Sport-100 Helmet, Black                            HL-U509
         709 Mountain Bike Socks, M                             SO-B909-M
         710 Mountain Bike Socks, L                             SO-B909-L
         711 Sport-100 Helmet, Blue                             HL-U509-B
...
```

Rows as expected. This I think is very useful scenario. One can easily load or dump data from/into any other database or ever XML or JSON or CSV or ...

#### Closing

What I like is that with the _FbNetExternalEngine_ you have a lot of options, whole .NET Framework ecosystem is available with little effort directly from SQL. Looking forward to see what people will do (and what crazy idea I'll get). 

[1]: {{ include "post_link" 233625 }}
[2]: https://firebirdsql.org/
[3]: https://www.nuget.org/packages/FirebirdSql.Data.FirebirdClient/
[4]: https://azure.microsoft.com/en-us/services/sql-database/?v=16.50