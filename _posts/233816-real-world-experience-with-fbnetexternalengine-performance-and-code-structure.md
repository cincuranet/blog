---
title: |-
  Real world experience with FbNetExternalEngine performance and code structure
date: 2020-03-30T10:11:00Z
tags:
  - Firebird
  - .NET
---
I'm now going through piece of SQL code that contains a lot of stored procedures from over the years and lately also functions (in last year the migration to Firebird 3 really began) and looking into the code to identify functions and procedures to start the rewriting with using [_FbNetExternalEngine_][3]. I'm at the beginning, but I have some interesting piece I'd like to show.

<!-- excerpt -->

#### `SYS_ADD_TIME_TO_TIMESTAMP`

The first interesting function I found was `SYS_ADD_TIME_TO_TIMESTAMP`. It adds `TIME` to a given `TIMESPAN`, something that's not possible by direct `TIME`/`TIMESPAN` arithmetic in Firebird.

This is the original version, untouched.

```sql
RECREATE FUNCTION SYS_ADD_TIME_TO_TIMESTAMP (
	IN_TIME TIME,
	IN_TIMESTAMP TIMESTAMP)
RETURNS TIMESTAMP
AS
declare variable RESULT TIMESTAMP;
begin
  RESULT = dateadd(extract(millisecond from IN_TIME) millisecond to IN_TIMESTAMP);
  RESULT = dateadd(extract(second from IN_TIME) second to RESULT);
  RESULT = dateadd(extract(minute from IN_TIME) minute to RESULT);
  RESULT = dateadd(extract(hour from IN_TIME) hour to RESULT);
  return RESULT;
end
```

The C# version is slightly more readable and shorter.

```csharp
public static DateTime? AddTimeToTimestamp(TimeSpan? time, DateTime? datetime)
{
	if (time == null || datetime == null)
		return null;
	return ((DateTime)datetime).Add((TimeSpan)time);
}
```

Both functions are very simple, without any significant amount of logic or code. Still I thing that having tis logic in C# is more convenient than in PSQL.

With both functions in dummy database I created a simple loop and measured the time using _isql_.

```sql
execute block
as
declare variable cnt int;
declare variable dummy timestamp;
begin
	cnt = 100 * 1000;
	while (cnt > 0) do
	begin
		--dummy = SYS_ADD_TIME_TO_TIMESTAMP(CURRENT_TIME, cast('NOW' as timestamp));
		dummy = ADD_TIME_TO_TIMESTAMP(CURRENT_TIME, cast('NOW' as timestamp));
		cnt = cnt - 1;
	end
end
```

On my machine, with [FbNetExternalEngine 4.0.0][1] and [Firebird 3.0.5][2], the speed difference was about 14% in favor of PSQL. Which frankly isn't bad given the simplicity of the code.

#### `SYS_CONCATINATE`

Second function that caught my eye was this (also mind (or don't) the typo in name).

```sql
RECREATE FUNCTION SYS_CONCATINATE (
	IN_LEFT VARCHAR(2000),
	IN_RIGHT VARCHAR(2000),
	IN_SPLITTER VARCHAR(10) = null)
RETURNS VARCHAR(2000)
AS
begin
  if (IN_LEFT is null) then
  begin
	return IN_RIGHT;
  end
  else
  if (IN_RIGHT is null) then
  begin
	return IN_LEFT;
  end
  else
  begin
	return IN_LEFT || coalesce(IN_SPLITTER, ascii_char(13) || ascii_char(10)) || IN_RIGHT;
  end
end
```

Again, this is fairly simple function, but I selected it because I think in C#, especially with _switch expression_ the code can be really nicely written.

```csharp
public static string Concat(string left, string right, string splitter)
{
	return (left, right, splitter) switch
	{
		(null, _, _) => right,
		(_, null, _) => left,
		(_, _, null) => left + "\r\n" + right,
		(_, _, _) => left + splitter + right,
	};
}
```

I can write it in myriad different ways (i.e. using `StringBuilder`), I just went with the most natural for me.

In this instance the speed performance (executed and measured the same way as above) was about 28% in favor of PSQL. I was expecting it to perform bit worse, because I know I have some room for improvement in `string` handling in the plugin. But I was hoping for under 20%.

#### `TR_SES_STATE`

The last function I want to share is not about comparing performance, but simply about the code.

```sql
RECREATE FUNCTION TR_SES_STATE (
    IN_STATE D_SES_STATE)
RETURNS D_TINY_STRING
AS
begin
  return case IN_STATE
           when 0 then 'Idle'
           when 1 then 'Started'
           when 2 then 'Stopped'
           when 3 then 'Finished'
           when 4 then 'Paused'
           when 5 then 'Canceled'
         end;
end
```

Bunch of these procedures is in the database and it's basically taking some `enum` stored in database as a number and getting the "value" back. And we can probably discuss whether this should even be in the database, but the bottom line is, it's there and it was at some point needed.

From talking with developers, I know, the main hassle is keeping these in sync with what's in application code. By having this all in C#, maybe with nice `DisplayAtribute` and a bit of boilerplate code, this hassle can be easily eliminated.

#### Summary

By doing this I learned two pieces I want to take away from this. First is that some code can be easily shared from inside the application all the way into the database, without any manual or scripted synchronization. The other is that the performance is really close to PSQL for real code and as a bonus you have all the .NET libraries at your disposal, not mentioning, in my opinion, nicer language and tooling.

[1]: {% include post_link, id: "233815" %}
[2]: https://firebirdsql.org/en/downloads/
[3]: /tools/fb-net-external-engine