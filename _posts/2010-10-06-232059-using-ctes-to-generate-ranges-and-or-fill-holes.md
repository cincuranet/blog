---
title: "Using CTEs to generate ranges and/or fill holes"
date: 2010-10-06T08:22:27Z
tags:
  - Databases in general
  - Firebird
  - SQL
redirect_from: /id/232059/
category: none
layout: post
---
[Common Table Expressions][1] are a tool to express things in SQL without need to write long queries or use procedural SQL. The ability to write recursive queries is even nicer and yesterday I had an idea how to use it little bit differently.

Often I'm generating data for reports and I'm trying to do as much as I can on database server. One common problem I'm facing with these reports is the need to include some "zero" data even for, in this case, days, where no data were available.

Imagine, you're doing something like this ([Firebird][2] syntax).

```sql
select data.d, sum(data.i) from
(
	select current_date as d, 1 as i from rdb$database
	union all
	select current_date, 1 from rdb$database
	union all
	select current_date+1, 2 from rdb$database
	union all
	select current_date+3, 5 from rdb$database
	union all
	select current_date+3, 2 from rdb$database
) data
group by data.d
```

It's OK, but you'll get data only for date that are present in database. But because you're generating report for whole month, as I did, it would be nice to have there the data too even with "zeros". Because then the logic on application side is much simpler, you just need to deal how to present the report's data.

If you have CTEs, it's pretty easy to use the recursiveness and generate the sequence, join it with original data and do what you have to do.

```sql
select range.d, coalesce(sum(data.i), 0) from
(
	select current_date as d, 1 as i from rdb$database
	union all
	select current_date, 1 from rdb$database
	union all
	select current_date+1, 2 from rdb$database
	union all
	select current_date+3, 5 from rdb$database
	union all
	select current_date+3, 2 from rdb$database
) data
right outer join
(
	with recursive padding as
	(
		select current_date as d from rdb$database
		union all
		select dateadd(day, 1, d) from padding where d < dateadd(month, 1, current_date)
	)
	select * from padding
) range
on (data.d = range.d)
group by range.d
```

I'm using here `right outer join` just to keep the original data above the sequence I'm generating. But you can swap the tables and use `left outer join` as it may be easier to read and maintain.

The code is pretty straightforward and if you used CTEs ever before, you'll be able to read. I'm simply generating the dates until I'm ready with the sequence (in this case one month) and then joining with original data. The outer join will ensure the holes are filled and nulls are there. These nulls are later processed with `coalesce` to "zero" values.

If you want to directly control the number of elements in sequence, simply use some counter.

```sql
with recursive padding as
(
	select current_date as d, 0 as cnt from rdb$database
	union all
	select dateadd(day, 1, d), cnt+1 from padding where cnt < 10
)
select * from padding
```

[1]: http://en.wikipedia.org/wiki/Common_table_expressions
[2]: http://www.firebirdsql.org
