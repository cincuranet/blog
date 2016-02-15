---
title: "Value of particular column from all (some) tables in database dynamically in Firebird"
date: 2012-01-11T18:05:42Z
tags:
  - Firebird
  - SQL
redirect_from: /id/232657/
category: none
layout: post
---
A question came to me last week. It was simple. Given the column I'd like to query all tables in database for this column (with some condition) and get values back. It was on [Firebird][1] so I jumped into system tables and generated query on the fly in [`execute block`][2] (aka anonymous [stored procedure][3]).

The idea is simple. First get all table names (views and system tables excluded, but you can also exclude i.e. temporary tables) with this column (to be able to later run the query successfully), then concatenate some strings to build the query (with condition for the column) and finally use [`execute statement`][4] to run the query. The `into` clause will fill the variable and `suspend` will send the result (row) to client.

```sql
execute block
returns (table_name varchar(100), column_value varchar(100))
as
declare variable column_name varchar(100);
begin
  column_name = upper('id'); /* put here your column name */
  for select rdb$relation_name from rdb$relations r
    where rdb$system_flag = 0 /* no system tables */ and
    rdb$view_blr is null /* no views */ and
    exists(select 1 from rdb$relation_fields rf where rf.rdb$relation_name = r.rdb$relation_name and rf.rdb$field_name = :column_name)
    into :table_name do
  begin
    execute statement 'select cast(' || column_name || ' as varchar(100)) from ' || table_name || ' where /* put your condition here */' into :column_value;
    suspend;
  end
end
```

As a modification you can also instead of running _n_ queries create one big string with `union all`-ing all queries and run just this one. You should compare execution plans and speed to see which one performs better. Then you would use [`for execute statement ... do`][5] do process results.

[1]: http://www.firebirdsql.org
[2]: http://www.firebirdsql.org/file/documentation/reference_manuals/reference_material/html/langrefupd25-execblock.html
[3]: http://en.wikipedia.org/wiki/Stored_procedure
[4]: http://www.firebirdsql.org/file/documentation/reference_manuals/reference_material/html/langrefupd25-psql-execstat.html
[5]: http://www.firebirdsql.org/file/documentation/reference_manuals/reference_material/html/langrefupd25-psql-forexecstatdo.html
