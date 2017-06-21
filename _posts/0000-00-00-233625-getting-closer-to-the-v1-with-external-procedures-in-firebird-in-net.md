---
title: |-
  Getting closer to the "v1" with external procedures in Firebird in .NET
date: 2017-05-25T06:47:00Z
tags:
  - .NET
  - C#
  - Databases in general
  - Firebird
  - SQL
---
It's been a while since the [last time][5] I blogged about _FbNetExternalEngine_. That doesn't mean there was nothing happening. I was slowly working on it (really slowly, because of ... time), plus some companies took interest in it, confirming it's worth working on it and providing some feedback or nice-to-have features wishes (feel free to share your ideas in comments). So what's really new?

<!-- excerpt -->

As the [C# 7 came out][4], I played with it and decided it's a nice fit for this project to provide results from procedures. Even if you're not yet ready to use C# 7, you can use the `ValueTuple` direcly and create _external procedures_ because C# 7 just adds syntax sugar on top of it. The idea still the same. Input parameters are regular parameters as you'd expect. The returned type needs to be `IEnumerator<(...)>`. Here's an example.

```csharp
public static IEnumerator<(int?, int?)> IncrementInteger(int? i)
{
	yield return (i, i + 1);
}
```

Another big change - in fact it took a **lot of** try-error-repeat cycles, although the code is fairly straightforward at the end - is loading the assembly only when the execution is happening and releasing it right after. As you can probably guess, it is using [_application domains_][3]. What that means is that you can replace the assembly with your procedures on the fly without stopping the server. I'm really excited about this. Sadly it adds a little bit overhead with execution (because of the marshalling), but I haven't jumped into performance optimizations yet (or possibly providing two execution models).

If you'd like to give it a try, download [32-bit][1] or [64-bit][2] build and enjoy. The package contains `plugins.conf` to help you register the plugin and also `Example.dll` (with source) and corresponding SQL script showing all supported datatypes on both sides.

```csharp
namespace Example
{
	public static class Procedures
	{
		public static IEnumerator<(int?, int?)> IncrementInteger(int? i)
		{
			yield return (i, i + 1);
		}

		public static IEnumerator<(long?, long?)> IncrementBigint(long? i)
		{
			yield return (i, i + 1);
		}

		public static IEnumerator<(short?, short?)> IncrementSmallint(short? i)
		{
			yield return (i, (short?)(i + 1));
		}

		public static IEnumerator<(float?, float?)> IncrementFloat(float? i)
		{
			yield return (i, i + 1);
		}

		public static IEnumerator<(double?, double?)> IncrementDouble(double? i)
		{
			yield return (i, i + 1);
		}

		public static IEnumerator<(decimal?, decimal?)> IncrementDecimal(decimal? i)
		{
			yield return (i, i + 1);
		}

		public static IEnumerator<(decimal?, decimal?)> IncrementNumeric(decimal? i)
		{
			yield return (i, i + 1);
		}

		public static IEnumerator<(string, string)> ReverseVarchar(string s)
		{
			yield return (s, s?.Reverse());
		}

		public static IEnumerator<(string, string)> ReverseChar(string s)
		{
			yield return (s, s?.Reverse());
		}

		public static IEnumerator<(DateTime?, DateTime?)> AddDayTimestamp(DateTime? timestamp)
		{
			yield return (timestamp, timestamp?.AddDays(1));
		}

		public static IEnumerator<(DateTime?, DateTime?)> AddDayDate(DateTime? date)
		{
			yield return (date, date?.AddDays(1));
		}

		public static IEnumerator<(TimeSpan?, TimeSpan?)> AddHourTime(TimeSpan? time)
		{
			yield return (time, time?.Add(TimeSpan.FromHours(1)));
		}

		public static IEnumerator<(bool?, bool?)> NegateBoolean(bool? b)
		{
			yield return (b, !b);
		}

		public static IEnumerator<ValueTuple<DateTime?>> CurrentUtcTimestamp()
		{
			var value = DateTime.UtcNow;
			yield return new ValueTuple<DateTime?>(value);
		}
	}

	public static class Ext
	{
		public static string Reverse(this string s)
		{
			var chars = s.ToCharArray();
			Array.Reverse(chars);
			return new string(chars);
		}
	}
}
```

```sql
recreate procedure increment_integer(input int)
returns (original int, new int)
external name 'Example!Example.Procedures.IncrementInteger'
engine FbNetExternalEngine;

recreate procedure increment_bigint(input bigint)
returns (original bigint, new bigint)
external name 'Example!Example.Procedures.IncrementBigint'
engine FbNetExternalEngine;

recreate procedure increment_smallint(input smallint)
returns (original smallint, new smallint)
external name 'Example!Example.Procedures.IncrementSmallint'
engine FbNetExternalEngine;

recreate procedure increment_float(input float)
returns (original float, new float)
external name 'Example!Example.Procedures.IncrementFloat'
engine FbNetExternalEngine;

recreate procedure increment_double(input double precision)
returns (original double precision, new double precision)
external name 'Example!Example.Procedures.IncrementDouble'
engine FbNetExternalEngine;

recreate procedure increment_decimal(input decimal(18,4))
returns (original decimal(18,4), new decimal(18,4))
external name 'Example!Example.Procedures.IncrementDecimal'
engine FbNetExternalEngine;

recreate procedure increment_numeric(input numeric(18,4))
returns (original numeric(18,4), new numeric(18,4))
external name 'Example!Example.Procedures.IncrementNumeric'
engine FbNetExternalEngine;

recreate procedure reverse_varchar(input varchar(20))
returns (original varchar(20), new varchar(20))
external name 'Example!Example.Procedures.ReverseVarchar'
engine FbNetExternalEngine;

recreate procedure reverse_char(input char(20))
returns (original char(20), new char(20))
external name 'Example!Example.Procedures.ReverseChar'
engine FbNetExternalEngine;

recreate procedure add_day_timestamp(input timestamp)
returns (original timestamp, new timestamp)
external name 'Example!Example.Procedures.AddDayTimestamp'
engine FbNetExternalEngine;

recreate procedure add_day_date(input date)
returns (original date, new date)
external name 'Example!Example.Procedures.AddDayDate'
engine FbNetExternalEngine;

recreate procedure add_hour_time(input time)
returns (original time, new time)
external name 'Example!Example.Procedures.AddHourTime'
engine FbNetExternalEngine;

recreate procedure negate_boolean(input boolean)
returns (original boolean, new boolean)
external name 'Example!Example.Procedures.NegateBoolean'
engine FbNetExternalEngine;

recreate procedure current_utc_timestamp
returns (result timestamp)
external name 'Example!Example.Procedures.CurrentUtcTimestamp'
engine FbNetExternalEngine;
```

Right now I want to gather some feedback from you, work on some easy performance gains and start on functions. All this, at least now, will be _v1_ in my mind.

[1]: {% include post_ilink post=page name="FbNetExternalEngine32.7z" %}
[2]: {% include post_ilink post=page name="FbNetExternalEngine64.7z" %}
[3]: https://msdn.microsoft.com/en-us/library/2bh4z9hs(v=vs.110).aspx
[4]: https://docs.microsoft.com/en-us/dotnet/articles/csharp/whats-new/csharp-7
[5]: {% include post_link id="233566" %}