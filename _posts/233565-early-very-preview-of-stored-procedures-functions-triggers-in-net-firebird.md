---
title: |-
  Early (very) preview of stored procedures (functions, triggers) in .NET in Firebird
date: 2016-07-06T05:57:00Z
tags:
  - .NET
  - C#
  - Databases in general
  - Firebird
  - SQL
---
> [Follow-up post.][6]

[Firebird 3][3] - with it's new plugin architecture - has a feature that allows execute stored procedures, functions and triggers in environment different from inside engine. Basically one can write (or rather use) plugin that allow to write i.e. triggers in different language like C++ (or any native code). Nice. But I like to write in .NET and C#.

So I set out to try to write such plugin and funnel the data to and from .NET where it will be executed...

<!-- excerpt -->

> Given it's a very early and rough bits I suggest you only play with it if you're prepared to hit some bumps on the road and work though it. And of course I'd not do it in a production environment.

The basic concept is simple. I have to write small (preferably very) plugin in native code and as soon as possible jump to .NET and continue there. Firebird will then load this plugin and everything will magically work. Right now I have first pieces to share - only stored procedures are supported and except blobs all datatypes should work (although there's very little validation, so you can shoot yourself into foot very easily).

You can download the [32-bit build][1] or [64-bit build][2] depending on what Firebird bitness you're running. The .NET part is actually the same, it's just the native part.

The plugin needs to be first registered in `plugins.conf`.

```text
Plugin = FBNETEXTERNALENGINE {
	Module = $(dir_plugins)/FbNetExternalEnginePlugin
	Config = FBNETEXTERNALENGINE_config
}

Config = FBNETEXTERNALENGINE_config {
}
```

Obviously both files need to be in `plugins` directory. Once that's done you can start writing custom procedures in .NET. 

Right now the rules are pretty relaxed and, as I said, very little validation is in place. All types need to be nullable and you common sense between mapping from/to database types to .NET types applies (see below for example with all types used). Currently the parameter names do not matter. Matching is done on position.

Return type is always [`IEnumerator<T>`][4] - so `yield return ...` and `yield break` is your friend - where `T` is any type having `ItemX` properties, like [`Tuple<...>`][5]. This is something I'm still thinking about how to nicely pass values back. C# 7 would definitely help here. I'll maybe see more clearly when functions and triggers take shape.

```csharp
namespace Example
{
	public static class Procedures
	{
		public static IEnumerator<Tuple<int?, string, long?, short?, string, DateTime?, DateTime?, TimeSpan?, bool?, float?, double?, decimal?, decimal?>> Demo(int? i, string s, long? @long, short? @short, string @char, DateTime? timestamp, DateTime? date, TimeSpan? time, bool? boolean, float? @float, double? @double, decimal? @decimal, decimal? numeric)
		{
			yield return new Tuple<int?, string, long?, short?, string, DateTime?, DateTime?, TimeSpan?, bool?, float?, double?, decimal?, decimal?>(i, s, @long, @short, @char, timestamp, date, time, boolean, @float, @double, @decimal, numeric);
			yield return new Tuple<int?, string, long?, short?, string, DateTime?, DateTime?, TimeSpan?, bool?, float?, double?, decimal?, decimal?>(i + 1, s + nameof(Demo), @long + 1, (short?)(@short + 1), @char.TrimEnd() + "_" + nameof(Demo), timestamp?.AddDays(1).AddHours(1), date?.AddDays(1), time?.Add(TimeSpan.FromMinutes(1)), !boolean, @float + 1.1f, @double + 1.1, @decimal + 1.1m, numeric + 1.1m);
		}

		public class Tuple<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13>
		{
			public T1 Item1 { get; }
			public T2 Item2 { get; }
			public T3 Item3 { get; }
			public T4 Item4 { get; }
			public T5 Item5 { get; }
			public T6 Item6 { get; }
			public T7 Item7 { get; }
			public T8 Item8 { get; }
			public T9 Item9 { get; }
			public T10 Item10 { get; }
			public T11 Item11 { get; }
			public T12 Item12 { get; }
			public T13 Item13 { get; }

			public Tuple(T1 item1, T2 item2, T3 item3, T4 item4, T5 item5, T6 item6, T7 item7, T8 item8, T9 item9, T10 item10, T11 item11, T12 item12, T13 item13)
			{
				Item1 = item1;
				Item2 = item2;
				Item3 = item3;
				Item4 = item4;
				Item5 = item5;
				Item6 = item6;
				Item7 = item7;
				Item8 = item8;
				Item9 = item9;
				Item10 = item10;
				Item11 = item11;
				Item12 = item12;
				Item13 = item13;
			}
		}
	}
}
```

Once you have your assembly compiled you can copy it to some place (start place for relative paths is `plugins` directory) and define the stored procedure.

```sql
recreate procedure demo (
  in_int integer = null,
  in_s varchar(20) = null,
  in_long bigint = null,
  in_short smallint = null,
  in_char char(20) = null,
  in_timestamp timestamp = null,
  in_date date = null,
  in_time time = null,
  in_boolean boolean = null,
  in_float float = null,
  in_double double precision = null,
  in_decimal decimal(18,4) = null,
  in_numeric numeric(18,4) = null
) 
returns (
  out_int integer,
  out_s varchar(20),
  out_long bigint,
  out_short smallint,
  out_char char(20),
  out_timestamp timestamp, 
  out_date date,
  out_time time,
  out_boolean boolean,
  out_float float,
  out_double double precision,
  out_decimal decimal(18,4),
  out_numeric numeric(18,4)
)
external name 'Example!Example.Procedures.Demo'
engine FbNetExternalEngine;
```

Important part is the `external name` in format `<assembly location without extension>!<namespace[.namespace...].method>` and `engine`.

I'd like to hear some feedback whether this is something you'd like to see move forward (else it was nice brain excercise for me :)) and probably help move it forward. And also general ideas about how it could take shape.

Some ideas I have in my head:

* Allow the routine to attach to current transaction. So in the same as transaction as the routine is being executed one would be able to use regular `FbConnection` etc.
* Load (and unload) the assembly with routines only when needed.
* Caching of some heavy reflection calls.
* _Maybe_ (to make it extra interesting :)) ability to store the code of the routine in a table and compile and execute it on the fly (with some caching). 

[1]: {{ include "post_ilink" page "FbNetExternalEngine32.7z" }}
[2]: {{ include "post_ilink" page "FbNetExternalEngine64.7z" }}
[3]: http://firebirdsql.org/
[4]: https://msdn.microsoft.com/en-us/library/78dfe2yb(v=vs.110).aspx
[5]: https://msdn.microsoft.com/en-us/library/dd386941(v=vs.110).aspx
[6]: {{ include "post_link" 233566 }}