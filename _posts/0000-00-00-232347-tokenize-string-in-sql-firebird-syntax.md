---
title: |-
  Tokenize string in SQL (Firebird syntax)
date: 2011-05-03T19:00:18Z
tags:
  - Firebird
  - SQL
---
Few days ago I wrote ["Some thoughts on denormalization" post][1]. Though concatenating data to one string is easy with there introduced function, splitting it back could be harder. I left it as exercise, but I feel, to make it complete, it's good to show one possible implementation.

Here's one I came with today (using [Firebird][2] syntax, however it's almost pure [SQL][3]), quickly. It's something I created from start to finish in one row and sure for some cases it could be optimized.

```sql
recreate procedure Tokenize(input varchar(1024), token char(1))
returns (result varchar(255))
as
declare newpos int;
declare oldpos int;
begin
	oldpos = 1;
	newpos = 1;
	while (1 = 1) do
	begin
		newpos = position(token, input, oldpos);
		if (newpos > 0) then
		begin
			result = substring(input from oldpos for newpos - oldpos);
			suspend;
			oldpos = newpos + 1;
		end
		else if (oldpos - 1 < char_length(input)) then
		begin
			result = substring(input from oldpos);
			suspend;
			break;
		end
		else
		begin
			break;
		end
	end
end
```

The procedure splits the `input` string using the specified `token`. The string can (or not) end with the token itself, the procedure will handle it.

```sql
select * from Tokenize('ab,cd,e', ',')
union all
select * from Tokenize('ab,cd,e,', ',');
union all
select * from Tokenize('ab,cd,e,,', ',');
```

What it is not handling is some form of quoting in case there's a token inside the element. Mainly because its intended purpose is to tokenize strings you can control ([see the previous post][4]) and because it will slow down the execution.

Feel free to improve it etc. (either post link to your solution or post the code in comments).

[1]: {% include post_link id="232323" %}
[2]: http://www.firebirdsql.org
[3]: http://en.wikipedia.org/wiki/SQL
[4]: {% include post_link id="232323" %}