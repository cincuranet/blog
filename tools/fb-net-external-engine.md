---
title: FbNetExternalEngine
no_page: true
layout: page
---
### FbNetExternalEngine

#### Introduction

_FbNetExternalEngine_ is plugin for Firebird 3+ that allows you to write stored procedures, functions and triggers (not yet) in any .NET language (instead of PSQL). There's no limitation on what you can or cannot do in the code. Full power of .NET and .NET eco-system is available for you.

#### Price and download

_FbNetExternalEngine_ has a single price of €99, which gives you all the goodies described here and you can use it on as many servers as you have. Updates within major versions are included. There's also a [free version][2] which is limited to only one concurrently running execution at any given time and does not contain _Integration interfaces_ and _Management procedures_ (see below).

You can place the order [here][1]. If you'd like to support the work on _FbNetExternalEngine_ even more - which would be greatly appreciated -, feel free to put your preferred amount into the note.

#### Instalation

1. Add these lines into `plugins.conf`.

```text
Plugin = FBNETEXTERNALENGINE {
	Module = $(dir_plugins)/FbNetExternalEnginePlugin
}
```

2. Copy these files into `plugins` directory.

```text
FbNetExternalEnginePlugin.dll
FbNetExternalEnginePlugin.pdb (optional)
FbNetExternalEngineManaged.dll
FbNetExternalEngineManaged.pdb (optional)
FbNetExternalEngineIntegration.dll
FbNetExternalEngineIntegration.pdb (optional)
FbNetExternalEngineManagement.dll (optional)
FbNetExternalEngineManagement.pdb (optional)
```

##### Supported types (C# terminology)

`int?`, `string`, `short?`, `long?`, `DateTime?`, `TimeSpan?`, `bool?`, `float?`, `double?`, `decimal?`, `byte[]`

The mapping from/to database types should be self explanatory.

Database `NULL` maps to C# `null`.

#### Common requirements  (C# terminology)

* Method has to be static.
* Input arguments have to be from set of supported types (see below).
* No overload resolution (method names have to be unique).
* `VARCHAR(n)`/`CHAR(n)`/`BLOB SUB_TYPE TEXT` has to be `UTF-8` (charset can be defined on PSQL parameter).

##### SQL definition

The _external name_ is in a form `<assembly>!<namespace>...<class>.<method>`, where the _assembly_ can be absolute or relative path without extension (`.dll`). Relative path is resolved from the `plugins` directory.

##### Limitations on types (C# terminology)

* `VARCHAR(n) CHARACTER SET OCTETS`/`CHAR(n) CHARACTER SET OCTETS` is not supported.

##### Exceptions

Any exception thrown from the code is converted to Firebird's `FbException` with _status vector_ `isc_arg_gds` being `isc_random` and `isc_arg_string` being `Exception.ToString()` from .NET.

Other exceptions in managed code are or derive from `ArgumentException`.

#### Stored procedures

##### Requirements (C# terminology)

* Return type has to be `IEnumerator<(T1, T2, ..., Tn)>` (or `IEnumerator<ValueTuple<T1, T2, ..., Tn>>`), where `Tx` is from set of supported types (see above). Or `void`.

##### Example

C# code is compiled into `Example.dll`.

```csharp
namespace Example
{
	public static class Procedures
	{
		public static IEnumerator<(int?, int?)> IncrementInteger(int? i)
		{
			yield return (i, i + 1);
		}
	}
}
```

```sql
create procedure increment_integer(input int)
returns (original int, new int)
external name 'Example!Example.Procedures.IncrementInteger'
engine FbNetExternalEngine;
```

Then you can call this procedure.

```text
SQL> select * from increment_integer(-20);

    ORIGINAL          NEW
============ ============
         -20          -19

SQL> execute procedure increment_integer(6);

    ORIGINAL          NEW
============ ============
           6            7
```

More examples in `Example.dll` and `Procedures.cs`/`Procedures.sql`.

#### Functions

##### Requirements (C# terminology)

* Return type has to be `T`, where `T` is from set of supported types (see above).

##### Example

C# code is compiled into `Example.dll`.

```csharp
namespace Example
{
	public static class Functions
	{
		public static int? IncrementInteger(int? i)
		{
			return i + 1;
		}
	}
}
```

```sql
create function increment_integer(input int)
returns int
external name 'Example!Example.Functions.IncrementInteger'
engine FbNetExternalEngine;
```

Then you can call this function.

```text
SQL> select increment_integer(-20) from rdb$database;

INCREMENT_INTEGER
=================
              -19

SQL> select increment_integer(6) from rdb$database;

INCREMENT_INTEGER
=================
                7
```

More examples in `Example.dll` and `Functions.cs`/`Functions.sql`.

#### Triggers

Not yet supported.

#### Integration interfaces

The extra `FbNetExternalEngineIntegration.dll` contains interfaces to integrate with the _FbNetExternalEngine_.

##### `IExecutionContext`

The last parameter of the procedure or function can be of type `IExecutionContext`. If so, such instance is provided. The interface contains multiple overloads of `Execute` method that allows executing SQL commands **within the context (transaction)** of currently running procedure or function.

```csharp
public static long? FullSelectFunction(IExecutionContext context)
{
	var data = context.Execute<int?, string>("select mon$attachment_id, mon$remote_process from mon$attachments").ToList();
	return data.LongCount();
}
```

```sql
recreate function full_select_function
returns bigint
external name 'Example!Example.ExecutionContext.FullSelectFunction'
engine FbNetExternalEngine;
```

At the moment input parameters are not supported (values have to be hardcoded) and at most 32 columns can be selected with `Execute` method.

More examples in `Example.dll` and `ExecutionContext.cs`/`ExecutionContext.sql`.

#### Management procedures

The extra `FbNetExternalEngineManagement.dll` (and `ManagementProcedures.sql` companion) assembly contains useful helpers for managing the plugin.

##### `net$update`

Allows **hot swapping** of assemblies **from SQL** without restarting the server. Calling this procedure with new assembly data in `data` parameter will replace it on the disk and invalidate internal caches. It can be safely called while other _FbNetExternalEngine_ pieces are executing code.

The assembly is not locked on disk, thus you can replace it directly manually as well. Then call the procedure with `data` set to `null`.

#### Performance

Dummy procedure call is about 2,55× slower compared to PSQL (the plugin infrastructure in Firebird adds about 1,4× slowdown). That's about 6,0 μs per call on my machine. The fetch from stored procedure's result set is about 1,18× slower compared to PSQL.

Dummy function call is about 2,19× slower compared to PSQL (the plugin infrastructure in Firebird adds about 1,2× slowdown). That's about 2,5 μs per call on my machine.

Concurrent execution adds about 4% per extra thread.

As the procedure or function in .NET becomes more complex the perfomance goes in favor of _FbNetExternalEngine_.

#### Next steps

These ideas, in no particular order, is what I (or people/companies supporting the plugin) have in mind for the future.

* Explore posibilities of using .NET Core.
	* Why: Because that would allow using _FbNetExternalEngine_ on Linux servers as well.
* Add support for `CHARACTER SET OCTETS`.
	* Why: Because it might be useful for certain scenarios.
* Add support for `async` methods.
	* Why: Because it will be convenient.

#### Notable sponsors

* SMS-Timing ([www.sms-timing.com](http://www.sms-timing.com/))
* Elekt Labs ([www.elektlabs.cz](http://www.elektlabs.cz/))

[1]: https://portal.fbnetexternalengine.com/Order
[2]: https://portal.fbnetexternalengine.com/DownloadFree
