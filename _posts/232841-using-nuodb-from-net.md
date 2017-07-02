---
title: |-
  Using NuoDB from .NET
date: 2012-05-21T17:04:38Z
tags:
  - .NET
  - Databases in general
  - NewSQL
  - NoSQL
  - NuoDB
---
In [previous post][1] I introduced you [NuoDB][2], the so-called _NewSQL_ database. On this foundation we'll build today. Simple .NET/C# application to access the data, because if I can't program it why bother with it, right? :)

NuoDB has currently JDBC and [ODBC][3] drivers in the box. [Other drivers are created by community][4]. There's also [.NET driver][5] being created but it's based on C++ API implementation not a fully managed implementation.

OK, so for now we'll try the ODBC as it's in the box. If you installed NuoDB, the driver was installed to your system already. If you're going to deploy your application you should install it yourself. Whole ODBC is based on `DSN`s. You create one in advance and application the uses this one, with minimal knowledge advance how to connect to data source etc. Go to Control Panel > Administrative Tools > Data Sources (ODBC) and you can create DSN there. In [.NET][6] world we're used to use _connection strings_ to describe our data source, so instead of creating DSN manually, I'll [create it in application][7], just for my comfort.

The application is pretty simple, just to try something. Because NuoDB supports standard SQL, you can use constructs you're familiar with, like `CREATE TABLE` etc.

```csharp
using System;
using System.Data;
using System.Data.Odbc;
using System.Linq;
namespace NuoDB
{
	class Program
	{
		[System.Runtime.InteropServices.DllImport("ODBCCP32.dll")]
		static extern bool SQLConfigDataSource(IntPtr parent, int request, string driver, string attributes);
		static bool HandleDSN(bool remove)
		{
			return SQLConfigDataSource(IntPtr.Zero, remove ? /* ODBC_REMOVE_DSN */ 3 : /* ODBC_ADD_DSN */ 1,
			     "NuoDB ODBC Driver\0",
			     "DSN=TestChorusDSN\0UID=admin\0PWD=admin\0Database=TestChorus@localhost\0");
		}
		static void Main(string[] args)
		{
			const string Separator = "\t|\t";
			Console.WriteLine("Adding DSN...");
			HandleDSN(remove: false);
			var csb = new OdbcConnectionStringBuilder();
			csb.Dsn = "TestChorusDSN";
			using (var conn = new OdbcConnection(csb.ToString()))
			{
				Console.WriteLine("Opening connection...");
				conn.Open();
				Console.WriteLine("Starting transaction...");
				using (var tx = conn.BeginTransaction())
				{
					string tableName = string.Format("user.test{0}", DateTime.UtcNow.Ticks);
					using (var cmd = conn.CreateCommand())
					{
						cmd.Transaction = tx;
						cmd.CommandText = string.Format("create table {0} (id int primary key, foobar string not null)", tableName);
						Console.WriteLine("Creating table...");
						cmd.ExecuteNonQuery();
					}
					using (var cmd = conn.CreateCommand())
					{
						cmd.Transaction = tx;
						cmd.CommandText = string.Format("insert into {0}(id, foobar) values (?, ?)", tableName);
						cmd.Prepare();
						IDbDataParameter parameter;
						for (var i = 0; i < 10; i++)
						{
							cmd.Parameters.Clear();
							parameter = cmd.CreateParameter();
							parameter.Value = i;
							cmd.Parameters.Add(parameter);
							parameter = cmd.CreateParameter();
							parameter.Value = string.Format("value of {0}", i);
							cmd.Parameters.Add(parameter);
							Console.WriteLine("Inserting...");
							cmd.ExecuteNonQuery();
						}
					}
					using (var cmd = conn.CreateCommand())
					{
						cmd.Transaction = tx;
						cmd.CommandText = string.Format("select * from {0}", tableName);
						Console.WriteLine("Reading data...");
						using (var reader = cmd.ExecuteReader())
						{
							Console.WriteLine(string.Join(Separator, Enumerable.Range(0, reader.FieldCount).Select(x => reader.GetName(x))));
							while (reader.Read())
							{
								var values = new object[reader.FieldCount];
								reader.GetValues(values);
								Console.WriteLine(string.Join(Separator, values));
							}
						}
					}
					Console.WriteLine("Committing...");
					tx.Commit();
				}
			}
			Console.WriteLine("Removing DSN...");
			HandleDSN(remove: true);
		}
	}
}
```

First I create DSN for my application (using ugly raw method), using same chorus set up like in [previous post][8]. The driver is called `NuoDB ODBC Driver`. Then I just specify username (`UID`), password (`PWD`) and database (`Database`) in form `<chorus>@<location>`, same as if you're using `nuosql`. This DSN is also removed at the end.

Rest is simple .NET/C# code, same as any other [ADO.NET][9] code. Connection, transaction (if explicitly needed), command(s)...

I create table (hence DDL and ExecuteNonQuery works fine) with some magic 8-) name. Then some inserts with parameters (hence parameters, Prepare and ExecuteNonQuery with DML works) and finally select (hence basic stuff around ExecuteReader and IDataReader works).

Considering, I can store data in structured form in tables, use SQL and still be able to scale out easily, I think it's neat. What could be even better? Having ADO.NET driver (preferable fully managed) and [Entity Framework][10] (aka [LINQ][11]) support. Maybe in the future...

What's next? We'll explore some failure and scaling scenarios.

[1]: {% include post_link, id: "232827" %}
[2]: http://www.nuodb.com/
[3]: http://en.wikipedia.org/wiki/ODBC
[4]: http://github.com/nuodb/nuodb-drivers
[5]: http://github.com/nuodb/nuodb-drivers/tree/master/dotnet
[6]: http://microsoft.com/net
[7]: http://www.codeproject.com/Articles/7652/Dynamically-adding-DSN-names
[8]: {% include post_link, id: "232827" %}
[9]: http://msdn.microsoft.com/en-us/library/e80y5yhx
[10]: http://msdn.com/ef
[11]: http://msdn.microsoft.com/en-us/library/bb397926.aspx