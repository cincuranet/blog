---
title: |-
  When NULL is not enough - NaN in Firebird
date: 2017-06-20T19:31:00Z
tags:
  - .NET
  - C#
  - Databases in general
  - Firebird
  - SQL
---
Did you know you can store `NaN` value in Firebird? You didn't? Me neither, until last week when [Slavomír Skopalík][1] showed me whole new world. It was in Delphi, so I was curious how it will turn out from .NET/[FirebirdClient][2].

<!-- excerpt -->

The `NaN` values is a special value of `double` type. It's declared as `0D / 0D`, which doesn't make much sense. But when you look what's under, you'll see `00 00 00 00 00 00 F8 FF`, which makes more sense. And given it's a "normal" value it shouldn't be a problem to save it to the Firebird from .NET. Let's try it.

```csharp
using (var conn = new FbConnection(ConnectionString))
{
	conn.Open();
	using (var cmd = conn.CreateCommand())
	{
		cmd.CommandText = "create table test (d double precision)";
		cmd.ExecuteNonQuery();
	}
	using (var cmd = conn.CreateCommand())
	{
		cmd.CommandText = "insert into test values (@d)";
		cmd.Parameters.Add("@d", double.NaN);
		cmd.ExecuteNonQuery();
	}
	using (var cmd = conn.CreateCommand())
	{
		cmd.CommandText = "insert into test values (@d)";
		cmd.Parameters.Add("@d", -double.NaN);
		cmd.ExecuteNonQuery();
	}
	using (var cmd = conn.CreateCommand())
	{
		cmd.CommandText = "insert into test values (@d)";
		cmd.Parameters.Add("@d", double.PositiveInfinity);
		cmd.ExecuteNonQuery();
	}
	using (var cmd = conn.CreateCommand())
	{
		cmd.CommandText = "insert into test values (@d)";
		cmd.Parameters.Add("@d", double.NegativeInfinity);
		cmd.ExecuteNonQuery();
	}
	using (var cmd = conn.CreateCommand())
	{
		cmd.CommandText = "select * from test";
		using (var reader = cmd.ExecuteReader())
		{
			while (reader.Read())
			{
				Console.WriteLine(reader[0]);
			}
		}
	}
}
```

As I was playing with it I tried saving also `-double.NaN`. And then also `double.PositiveInfinity` and `double.NegativeInfinity`. Because why not, right? :-)

The select then returns this. As expected.

```text
NaN
NaN
?
-?
```

I suppose the `-double.NaN` is `NaN` anyway, that's why the sign was "lost".

And from `isql`, to make sure it's really there and Firebird understands it (the missing sign for negative infinity in `isql`'s output is a [known issue][3]).

```text
SQL> select * from test;

                      D
=======================
                    NaN
                    NaN
               Infinity
               Infinity
```

And there you have it. I hope I never encounter such value in the database myself, as I can imagine a lot of fun it provides.

Nonetheless, if `NULL` is not enough for you, this is an escape plan. Now only the [`undefined`][4] is missing (because [`UNKNOWN`][5] is already there), then the hell can really begin. :-)

[1]: http://www.elektlabs.cz/
[2]: https://www.firebirdsql.org/en/net-provider/
[3]: http://tracker.firebirdsql.org/browse/CORE-5570
[4]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/undefined
[5]: https://en.wikipedia.org/wiki/Null_(SQL)#BOOLEAN_data_type