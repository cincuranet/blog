---
title: |-
  Using string interpolation for ADO.NET parameters
date: 2017-08-16T07:30:00Z
tags:
  - C#
  - SQL
---
I was reading the [announcement about Entity Framework Core 2][1] the other morning and saw "String interpolation in raw SQL methods" paragraph. This was already in preview(s) and I kind of took it as granted, not thinking about how it's done or what it is doing. Not this time. Somehow my curiosity kicked in and I decided to create same feature and maybe do something with it.

Of course, I could peek into sources, but I decided to use the idea, but build it myself from scratch. I like the idea of using already existing feature from C# and then using for different, but reasonable, purpose. String interpolation and SQL parameters are exactly this.

<!-- excerpt -->

The string interpolation feature works on top of [`FormattableString` class][2]. Basically whenever there's a `$"whatever"` it's an instance of `FormattableString` class. For my testing let's create a method with this signature `IEnumerable<object[]> Query(FormattableString sql, DbConnection connection, DbTransaction transaction = null)`. So I can pass any string, with parameters as interpolated string, connection and optionally transaction and I want this to be safely executed with proper parameters.

```csharp
public static IEnumerable<object[]> Query(FormattableString sql, DbConnection connection, DbTransaction transaction = null)
{
	using (var cmd = connection.CreateCommand())
	{
		if (transaction != null)
		{
			cmd.Transaction = transaction;
		}
		var parameters = sql.GetArguments().Select((e, i) =>
		{
			var p = cmd.CreateParameter();
			p.ParameterName = $"@p{i}";
			p.Value = e;
			return p;
		}).ToArray();
		cmd.Parameters.AddRange(parameters);
		cmd.CommandText = string.Format(sql.Format, parameters.Select(x => x.ParameterName).ToArray());
		using (var reader = cmd.ExecuteReader())
		{
			while (reader.Read())
			{
				var values = new object[reader.FieldCount];
				reader.GetValues(values);
				yield return values;
			}
		}
	}
}
```

There's some classic ADO.NET orchestration around and will skip this focusing only on ` FormattableString`. I'm using `GetArguments` to get all the values passed for the interpolated string. These will become the parameters' values. From these I construct regular `DbParameter`s with name `@pN`. Remaining piece is to replace the `{N}` in the string - same as in good old `string.Format` days one would write manually - with proper values. In this case parameter names. Given the `Format` property already contains a string ready to be passed to, already mentioned, `string.Format`, it's just about passing parameter names and it's done.

The usage feels very natural to me. It fits the language. And it's also the reason why I did this small brain training. Have a look yourself.

```csharp
using (var conn = new FbConnection("database=localhost:test.fdb;user=sysdba;password=masterkey"))
{
	conn.Open();
	var id = -1;
	var id2 = -10;
	foreach (var item in Database.Query($"select * from mon$attachments where mon$attachment_id <> {id2} and mon$attachment_id <> {id}", conn))
	{
		Console.WriteLine(string.Join("|", item));
		Console.WriteLine();
	}
}
```

This can be extended to almost make a raw SQL a first-ish class citizen in C# I think. While I was thinking about pursuing it a little bit more, maybe like a super thin wrapper-type ORM, I stopped for a while and did some research, because I'm surely not the first one to have this idea. And I've found [_FormattableSql_][3] project, that looks 95%-like I imagined where I'd like to end up.

[1]: https://blogs.msdn.microsoft.com/dotnet/2017/08/14/announcing-entity-framework-core-2-0/
[2]: https://msdn.microsoft.com/en-us/library/system.formattablestring(v=vs.110).aspx
[3]: https://github.com/garrettpauls/FormattableSql