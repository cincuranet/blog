---
title: FbNetExternalEngine
no_page: true
layout: page
---
### FbNetExternalEngine

#### Introduction

_FbNetExternalEngine_ is plugin for Firebird 3+ that allows you to write stored procedures, functions (not yet) and triggers (not yet) in any .NET language (instead of PSQL). There's no limitation on what you can or cannot do in the code. Full power of .NET and .NET eco-system is available for you.

#### Price and download

_FbNetExternalEngine_ has a single price of €99, which gives you all the goodies described here and you can use it on as many servers as you have. Updates in major versions are included. There's also a [free version][2] which is limited to only one concurrently running execution at any given time and does not contain _Management procedures_ (see below).

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
FbNetExternalEngineManagement.dll (optional)
FbNetExternalEngineManagement.pdb (optional)
```

#### Stored procedures

##### Requirements (C# terminology)

* Method has to be static.
* Return type has to be `IEnumerator<(T1, T2, ..., Tn)>` (or `IEnumerator<ValueTuple<T1, T2, ..., Tn>>`), where `Tx` is from set of supported types (see below). Or `void`.
* Input arguments have to be from set of supported types (see below).
* No overload resolution (method names have to be unique).
* `VARCHAR(n)`/`CHAR(n)`/`BLOB SUB_TYPE TEXT` has to be `UTF-8` (charset can be defined on PSQL parameter).

##### Supported types (C# terminology)

`int?`, `string`, `short?`, `long?`, `DateTime?`, `TimeSpan?`, `bool?`, `float?`, `double?`, `decimal?`, `byte[]`

The mapping from/to database types should be self explanatory.

Database `NULL` maps to C# `null`.

##### Limitations on types (C# terminology)

* `VARCHAR(n) CHARACTER SET OCTETS`/`CHAR(n) CHARACTER SET OCTETS` is not supported.

##### Exceptions

Any exception thrown from the code is converted to `FbException` with _status vector_ `isc_arg_gds` being `isc_random` and `isc_arg_string` being `Exception.ToString()` from .NET.

##### SQL definition

The _external name_ is in a form `<assembly>!<namespace>...<class>.<method>`, where the _assembly_ can be absolute or relative path without extension (`.dll`). Relative path is resolved from the `plugins` directory.

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

Not yet supported.

#### Triggers

Not yet supported.

#### Management procedures

The optional `FbNetExternalEngineManagement.dll` (and `ManagementProcedures.sql` companion) assembly contains some useful helpers for managing the plugin.

##### `net$update`

Allows **hot swapping** of assemblies **from SQL** without restarting the server. Calling this procedure with new assembly data in `data` will replace it on the disk and invalidate internal caches. It can be called while other _FbNetExternalEngine_ pieces are executing code.

The assembly is not locked on disk, thus you can replace it directly manually as well. Then call the procedure with `data` set to `null`.

#### Performance

Single dummy procedure call is about 3,25× slower compared to PSQL (the plugin infrastructure in Firebird adds about 1,4× slowdown). That's about 0,0077 ms per call on my machine. The fetch from stored procedure is about 1,25× slower compared to PSQL. As the procedure in .NET becomes more complex the perfomance goes in favor of _FbNetExternalEngine_.

#### Next steps

These ideas, in no particular order, is what I (or people/companies supporting the plugin) have in mind for the future.

* Add support for functions.
	* Why: Because functions are useful.
* Create support for executing SQL commands inside C# code in the same context (same transaction) as the currently running code.
	* Why: Because it's possible and in some situations it's needed.
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
