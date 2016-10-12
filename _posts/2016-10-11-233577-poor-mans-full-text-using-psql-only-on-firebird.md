---
title: "Poor man's full-text search using PSQL only on Firebird"
date: 2016-10-11T16:56:00Z
tags:
  - Databases in general
  - Firebird
  - SQL
redirect_from: /id/233577/
layout: post
---
I was presenting this idea on [this year's Firebird Conference][1]. It's an idea, working with some constraints of Firebird, but one can take it as an inspiration and maybe extend it to another usage on another platform. We had quite a productive discussion about possible improvements (I'll describe mines at the end), but unless the people will provide the ideas in comments here too, you'll have to use your own brain (you should've been there ;)).

I'll show you the initial idea with some simple speed improvement of PSQL code itself. And then describe options in how to store it better, mostly because it's very specific to needs and you'll need to tune it for your scenario.
  
<!-- excerpt --> 

#### Motivation

The whole idea came from the need to do _something like_ full-text fuzzy in [Fast 5][2] software. The basic `LIKE '%<something>%'` was OK-ish (with `UPPER`), but damn slow. It's slow because Firebird cannot use index for this type of match and because we are searching in a lot of fields (to make it simple for clients) `OR`-ing them together. Some real full-text solution with dictionaries and stop words and synonyms and fuzzy search was thrown over the board, because we wanted something easy to maintain. The `LIKE '%<something>%'` is actually OK _for us_, it just needed to be faster.

#### Expectations

> Yours might vary. These were ours and helped shape the whole idea.

Because we know where and how the search is used, we know our clients search for words inside longer strings. It's always beginning of the word (like "cok" when searching for "coke" in "one bottle of coke") or end of the word (when the beginning was misheard or something like that). Never in the middle.

#### Getting the words

So first I need to get the words from the whole strings and then search them quickly. 

Splitting the string to words is not difficult. I just need to split on non-alphanumeric character, handling properly accents because the strings are not just US-ASCII. I first created a `D_FT_TERM` domain like this.

```sql
CREATE DOMAIN D_FT_TERM AS
VARCHAR(...)
COLLATE UNICODE_CI_AI;
```

Because it has `CI` and `AI` collate I don't have to explicitly deal with `UPPER` or `LOWER` and accents. Thanks to the beauty of regular expressions in Firebird 2.5 I can simply do `NOT SIMILAR TO '[[:ALNUM:]]'` to detect my word boundaries. The initial code really checked characters one by one and accumulated these into the buffer.

```sql
cnt = 1;
s_length = character_length(s);
result = '';
while (cnt <= s_length) do
begin
	item = substring(s from cnt for 1);
	if (item not similar to '[[:ALNUM:]]') then
	begin
		if (result <> '') then
		begin
			suspend;
		end
		result = '';
	end
	else
	begin
		result = result || item;
	end
	cnt = cnt + 1;
end
if (result <> '') then
begin
	suspend;
end
```

It works fine, but it's unnecessary slow because there's a lot of strings handling. So instead of accumulating into the buffer I can just keep two numbers and do the `SUBSTRING` just before the `SUSPEND`.

```sql
var_i = 1;
var_start = 1;
var_length = character_length(in_value);
while (var_i <= var_length) do
begin
	if (cast(substring(in_value from var_i for 1) as d_ft_term) not similar to '[[:ALNUM:]]') then
	begin
		if (var_i > var_start) then
		begin
			out_result = substring(in_value from var_start for var_i - var_start);
			suspend;
		end
		var_start = var_i + 1;
	end
	var_i = var_i + 1;
end
if (var_i > var_start) then
begin
	out_result = substring(in_value from var_start for var_i - var_start);
	suspend;
end
```

#### Storing the words

The trigger on table modification will call the above procedure, get the words and store these in a separate table. The table is just an ID of record from some table you're interested in and the word itself.

```sql
CREATE TABLE T_FT_TERMS (
	F_TERM  D_FT_TERM
	F_ID BIGINT)
```

And the trigger just gets the words from interesting columns (here for example the `f_fullname` and `f_address`) and stores them.

```sql
if (updating or deleting) then
begin
	delete from t_ft_terms where f_id = old.f_id;
end   
if (inserting or updating) then
begin
	insert into t_ft_terms(f_term, f_id)
	select result, new.f_id
	from ft_tokenize(new.f_fullname)
	union all
	select result, new.f_id
	from ft_tokenize(new.f_address);
end
```

I know you're screaming how inefficient this is and how better you can make it. Hold it there. I just want to keep the initial idea extra simple and then start building the improvements.

#### Indexing

Now the critical part. Indexing will make it fast, if done properly. I need to be smart. Fact #1: Firebird can use index for prefix match. So the `LIKE '<something>%'` will use index and will be fast (faster than "natural scan"). Now the remaining suffix match. Bit of fumbling around and I realized the suffix match is actually reversed prefix match. Fact #2: The `LIKE '%abc'` is the same as `LIKE 'cba%'` on reversed words. 

Because we know, when the clients search, let's say, for my name, it's going to be `jir` (just typing it as it goes) or `iri` (misheard the first letter, unable to spell, etc.).

Getting it all together. I can express the match like (no pun intended) this.

```sql
-- prefix match will work (first case)
'jiri' LIKE 'jir%'
```

Or. 

```sql
-- reversed suffix match will work (second case)
'irij' LIKE 'iri%'
```

Thus the indices on the table will be two (I don't need to store the reversed word because I can use functional index).

```sql
CREATE INDEX IDX_FT_TERM ON T_FT_TERMS (F_TERM);
CREATE INDEX IDX_FT_TERM_REVERSE ON T_FT_TERMS COMPUTED BY (REVERSE(F_TERM));
```

Of course indexing the `F_ID` field is a good idea too. 

#### Searching

With all the parts together I can easily encapsulate search query into shape like this.

```
select distinct f_id
from t_ft_terms
where f_term starting :term or reverse(f_term) starting reverse(:term)
```

With this query Firebird will be able to use both `IDX_FT_TERM` and `IDX_FT_TERM_REVERSE` indices. And very likely I'll be joining with the source table I'm searching, to get the fields I'm looking for, so the PK index will do it's magic too.

#### Optimizations

Basically the biggest problem with `T_FT_TERMS` table is the size. I'm storing every word for every string multiple times if it's there multiple times. Not doing any matching, hence ignoring the `CI`-ness and `AI`-ness of the column. Simple `MERGE` statement will help a lot here. 

Also if two strings contain same word I store it twice with different IDs. If you have a lot of repetitions two tables might be better. Something like `T_FT_TERMS` and `T_FT_OCCURENCES` with 1:N relation. But it's good to measure the result, because the extra join might defeat the density of the index.

One might also consider not backing up this table using the `skip_data` switch of `gbak` (or `FbBackup`/`FbStreamingBackup`) or storing it in a separate database completely and using `ON EXTERNAL DATASOURCE`.

Stop words are easy to add into the splitting function, if you can detect the language or know the language in advance.

I'll leave those as an excercise for the reader. ;)

Feel free to share your ideas in the comments.

#### Conclusion

Thanks to the relaxed expectations (see above) the indexing does not need to handle a lot of combinations. So the index fits into the memory and has some significant benefit. The regular expressions together with `CI` and `AI` collation helped to create "real" words without knowing all the possible reasonable characters from Unicode in advance. And the biggest help was realizing the suffix match can be transformed to prefix match in reverse so the index will be used (which it has to be to get some decent speed). 

[1]: http://firebirdsql.org/en/firebird-conference-2016/
[2]: http://www.sms-timing.com/karting-software