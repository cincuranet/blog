---
title: "Gotcha with Firebird 3, COUNT and ExecuteScalar's common casting pattern"
date: 2016-03-02T10:01:00Z
tags:
  - Firebird
  - C#
layout: post
---
There's a common pattern used in ADO.NET with [`ExecuteScalar`][1] method. And this one is going to be bit broken with changes introduced in Firebird 3 (currently RC2).

Very often you're selecting number of values from some table (probably based on some condition). And the code looks like this.

<!-- excerpt -->

```csharp
using (var cmd = connection.CreateCommand())
{
	cmd.CommandText = "select count(*) from rdb$database";
	return (int)cmd.ExecuteScalar();
}
```

But the `COUNT` function in Firebird 3 now returns 64bit integer (described in release notes). So the above casting will fail. The `ExecuteScalar` is returning `object` so it can return whatever needed. In this case the `long` is wrapped into it. Casting it to `int` is obviously going to fail.

There's a bunch of options. Sure you can do the casting in SQL directly and then it datatype will be fine. It's just bit clunky. Maybe better option is to not cast it to some type directly, but convert it. .NET offers a handy [`Convert` class][2] where a [`ToInt32` method][3] is. With that it's enough that the value `ExecuteScalar` returned is a "number" and fit's into `int` (which it should if it worked before).

```csharp
using (var cmd = connection.CreateCommand())
{
	cmd.CommandText = "select count(*) from rdb$database";
	return Convert.ToInt32(cmd.ExecuteScalar());
}
```

And it's OK again. I think I'll not be alone changing a lot of code as customers will start using Firebird 3. :)

[1]: https://msdn.microsoft.com/en-us/library/system.data.common.dbcommand.executescalar(v=vs.110).aspx
[2]: https://msdn.microsoft.com/en-us/library/system.convert(v=vs.110).aspx
[3]: https://msdn.microsoft.com/en-us/library/23511zys(v=vs.110).aspx