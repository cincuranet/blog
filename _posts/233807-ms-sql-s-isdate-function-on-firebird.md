---
title: |-
  MS SQL's ISDATE function on Firebird
date: 2020-01-23T18:59:00Z
tags:
  - Firebird
  - MS SQL Server
  - SQL
---
MS SQL has an [`ISDATE` function][1] that "returns 1 if the expression is a valid date, time, or datetime value; otherwise, 0". Although I never used it or had a scenario for it, I was porting some code from MS SQL to Firebird and this function was used, hence I had to create it.

<!-- excerpt -->

As the documentation says it's checking for valid `date` or `time` or `datetime`. I would say a better design would be to have separate functions for different types. And that's also what I'm going to do in Firebird. You can create other variations easily or combine it to one.

```sql
recreate function is_date (val varchar(1000))
returns boolean
as
declare dummy date;
begin
	begin
		begin
			dummy = cast(val as date);
		end
		when any do
		begin
			return false;
		end
	end
	return true;
end
```

The idea is pretty simple. I try to cast the given "string" into a `date` and if that fails `false` is returned. Otherwise it's `true`. I return `boolean` because [Firebird supports this datatype][2]. The extra `begin`-`end` is there so I can have the second `return` statement after `when any` (which is basically catch-all exception handler). Similarly with the assignment to `dummy`; just to make Firebird happy.

Given the calling of internal function and user defined functions in Firebird is the same, there's nothing preventing you to pretend it is an internal function.

[1]: https://docs.microsoft.com/en-us/sql/t-sql/functions/isdate-transact-sql
[2]: https://firebirdsql.org/file/documentation/release_notes/html/en/3_0/rnfb30-ddl-enhance.html#rnfb30-ddl-boolean