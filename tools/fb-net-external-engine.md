---
title: FbNetExternalEngine
no_page: true
layout: page
---
### FbNetExternalEngine

#### Introduction

_FbNetExternalEngine_ is plugin for Firebird 3+ that allows you to write stored procedures, functions (not yet) and triggers (not yet) in any .NET language. There's no limitation on what you can or cannot do in the code. Full power of .NET and .NET eco-system is available for you.

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
* Return type has to be `IEnumerator<(T1, T2, ..., Tn)>` (or `IEnumerator<ValueTuple<T1, T2, ..., Tn>>`), where `Tx` is from set of supported types (see below) or `void`.
* Input arguments have to from set of supported types (see below).
* No overload resolution (method names have to be unique).
* `VARCHAR(n)` has to be `UTF-8` (can be defined on parameter).

##### Supported types (C# terminology)

`int?`, `string`, `short?`, `long?`, `DateTime?`, `TimeSpan?`, `bool?`, `float?`, `double?`, `decimal?`, `byte[]`

The mapping from/to database types should be self explanatory. 

Database `NULL` maps to C# `null`.

##### Limitations on types (C# terminology)

* `BLOB SUB_TYPE TEXT` is not supported (maps to `byte[]`).
* `VARCHAR(n) CHARACTER SET OCTETS` is not supported.

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

Allows *hot swapping* of assemblies *from SQL* without restarting the server. Calling this procedure with new assembly data in `data` will replace it on the disc and invalidate internal caches. It can be called while other _FbNetExternalEngine_ pieces are executing code.

The assembly is not locked on disc, thus you can replace it directly manually as well. Then call the procedure with `data` set to `null`.

#### Performance

Single procedure call is about 3,54× slower compared to PSQL. That's about 0,008ms/call on my machine. The fetch from stored procedure is about 1,34× slower compared to PSQL.

#### Download

The plugin is now on-request only. Contact me if you're interested, with some description of your project.