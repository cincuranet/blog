---
title: |-
  One day of my life - debugging SQL generator for Entity Framework support in .NET provider for Firebird
date: 2012-05-29T18:48:57Z
tags:
  - Entity Framework
  - Firebird
  - Life
  - SQL
---
Couple of days back I was hunting some problem in code, that processes and later translates [LINQ][1] queries preprocessed by [Entity Framework][2]. The bottom line is that you are in code, where you have pieces of query, you're rewriting these (even partially) or exchanging/adding new pieces if needed. You don't have whole picture, because pieces are changing and so on.

So even if you partially know what you are producing, at the end you have to look at final SQL command and see whether it's correct and/or semantically same as previous one, if you applied some changes or optimizations.

It took my roughly a day to find cause of issue and fix it. During this I created a lot of notes with commands and did a lot comparisons. I am placing these here, thus you can take a look at these and enjoy the feeling with me. If you're interested, you can also check the [SqlGenerator][3] class, where I was working mainly.

```sql
SELECT
"Skip1"."Limit1"."id_memo" AS "id_memo",
"Skip1"."Limit1"."id_text_grup" AS "id_text_grup",
"Skip1"."Extent2"."nom_grup" AS "nom_grup"
FROM ( SELECT SKIP (0) "Limit1"."id_memo" AS "id_memo", "Limit1"."id_text_grup" AS "id_text_grup1", "Extent2"."id_text_grup" AS "id_text_grup2", "Extent2"."nom_grup" AS "nom_grup"
	FROM   (SELECT FIRST (45) "Extent1"."id_memo" AS "id_memo", "Extent1"."id_text_grup" AS "id_text_grup"
		FROM "memos" AS "Extent1"
		ORDER BY "Extent1"."id_memo" ASC ) AS "Limit1"
	LEFT OUTER JOIN "texts_grups" AS "Extent2" ON "Limit1"."id_text_grup" = "Extent2"."id_text_grup"
	ORDER BY "Limit1"."id_memo" ASC
)  AS "Skip1"
```

```sql
SELECT SKIP (0)
"Limit1"."id_memo" AS "id_memo",
"Limit1"."id_text_grup" AS "id_text_grup",
"Extent2"."nom_grup" AS "nom_grup"
FROM   (SELECT FIRST (45) "Extent1"."id_memo" AS "id_memo", "Extent1"."id_text_grup" AS "id_text_grup"
	FROM "memos" AS "Extent1"
	ORDER BY "Extent1"."id_memo" ASC ) AS "Limit1"
LEFT OUTER JOIN "texts_grups" AS "Extent2" ON "Limit1"."id_text_grup" = "Extent2"."id_text_grup"
```

```sql
SELECT SKIP (0)
"Limit1"."id_memo" AS "id_memo",
"Limit1"."id_text_grup" AS "id_text_grup",
"Extent2"."nom_grup" AS "nom_grup"
FROM   (SELECT FIRST (45) "Extent1"."id_memo" AS "id_memo", "Extent1"."id_text_grup" AS "id_text_grup"
	FROM "memos" AS "Extent1"
	ORDER BY "Extent1"."id_memo" ASC ) AS "Limit1"
LEFT OUTER JOIN "texts_grups" AS "Extent2" ON "Limit1"."id_text_grup" = "Extent2"."id_text_grup"
```

```sql
SELECT SKIP (0)
"Limit1"."id_memo" AS "id_memo",
"Limit1"."id_text_grup" AS "id_text_grup",
"Extent2"."nom_grup" AS "nom_grup"
FROM   (SELECT FIRST (45) "Extent1"."id_memo" AS "id_memo", "Extent1"."id_text_grup" AS "id_text_grup"
	FROM "memos" AS "Extent1"
	ORDER BY "Extent1"."id_memo" ASC ) AS "Limit1"
LEFT OUTER JOIN "texts_grups" AS "Extent2" ON "Limit1"."id_text_grup" = "Extent2"."id_text_grup"
ORDER BY "Limit1"."id_memo" ASC
```

```sql
SELECT SKIP (0)
"D"."id_memo" AS "id_memo",
"D"."id_text_grup" AS "id_text_grup",
"E"."nom_grup" AS "nom_grup"
FROM   (SELECT FIRST (45) "C"."id_memo" AS "id_memo", "C"."id_text_grup" AS "id_text_grup"
	FROM "memos" AS "C"
	ORDER BY "C"."id_memo" ASC ) AS "D"
LEFT OUTER JOIN "texts_grups" AS "E" ON "D"."id_text_grup" = "E"."id_text_grup"
ORDER BY "D"."id_memo" ASC
```

```sql
SELECT SKIP (0) "Limit1"."id_memo" AS "id_memo", "Limit1"."id_text_grup" AS "id_text_grup", "Extent2"."nom_grup" AS "nom_grup" FROM   (SELECT FIRST (45) "Extent1"."id_memo" AS "id_memo", "Extent1"."id_text_grup" AS "id_text_grup" FROM "memos" AS "Extent1" ORDER BY "Extent1"."id_memo" ASC ) AS "Limit1" LEFT OUTER JOIN "texts_grups" AS "Extent2" ON "Limit1"."id_text_grup" = "Extent2"."id_text_grup"
```

```sql
SELECT SKIP (0) "Limit1"."id_memo" AS "id_memo", "Limit1"."id_text_grup" AS "id_text_grup1", "Extent2"."id_text_grup" AS "id_text_grup2", "Extent2"."nom_grup" AS "nom_grup" FROM   (SELECT FIRST (45) "Extent1"."id_memo" AS "id_memo", "Extent1"."id_text_grup" AS "id_text_grup" FROM "memos" AS "Extent1" ORDER BY "Extent1"."id_memo" ASC ) AS "Limit1" LEFT OUTER JOIN "texts_grups" AS "Extent2" ON "Limit1"."id_text_grup" = "Extent2"."id_text_grup" ORDER BY "Limit1"."id_memo" ASC
```

```sql
SELECT SKIP (0) "D"."id_memo" AS "id_memo", "D"."id_text_grup" AS "id_text_grup", "E"."nom_grup" AS "nom_grup" FROM   (SELECT FIRST (45) "C"."id_memo" AS "id_memo", "C"."id_text_grup" AS "id_text_grup" FROM "memos" AS "C" ORDER BY "C"."id_memo" ASC ) AS "D" LEFT OUTER JOIN "texts_grups" AS "E" ON "D"."id_text_grup" = "E"."id_text_grup" ORDER BY "D"."id_memo" ASC
```

```sql
SELECT
"H"."id_memo_data" AS "id_memo_data",
"H"."id_memo" AS "id_memo",
"H"."id_idioma" AS "id_idioma",
"H"."text" AS "text"
FROM   (SELECT SKIP (3)
	"C"."id_memo" AS "id_memo",
	(SELECT
		COUNT("D"."A1") AS "A1"
		FROM ( SELECT
			1 AS "A1"
			FROM "memos_data" AS "E"
			WHERE "C"."id_memo" = "E"."id_memo"
		)  AS "D") AS "C1"
	FROM "memos" AS "C"
	ORDER BY "C"."C1" DESC ) AS "G"
INNER JOIN "memos_data" AS "H" ON "G"."id_memo" = "H"."id_memo"
```

```sql
SELECT
"H"."id_memo_data" AS "id_memo_data",
"H"."id_memo" AS "id_memo",
"H"."id_idioma" AS "id_idioma",
"H"."text" AS "text"
FROM   (SELECT SKIP (3) "B"."id_memo" AS "id_memo", "B"."C1" AS "C1"
	FROM ( SELECT
		"C"."id_memo" AS "id_memo",
		(SELECT
			COUNT("D"."A1") AS "A1"
			FROM ( SELECT
				1 AS "A1"
				FROM "memos_data" AS "E"
				WHERE "C"."id_memo" = "E"."id_memo"
			)  AS "D") AS "C1"
		FROM "memos" AS "C"
	)  AS "B"
	ORDER BY "B"."C1" DESC ) AS "G"
INNER JOIN "memos_data" AS "H" ON "G"."id_memo" = "H"."id_memo"
```

```sql
SELECT
"H"."id_memo_data" AS "id_memo_data",
"H"."id_memo" AS "id_memo",
"H"."id_idioma" AS "id_idioma",
"H"."text" AS "text"
FROM   (SELECT SKIP (3) "skip"."id_memo" AS "id_memo", "skip"."C1" AS "C1"
	FROM ( SELECT
		"C"."id_memo" AS "id_memo",
		(SELECT
			COUNT("D"."A1") AS "A1"
			FROM ( SELECT
				1 AS "A1"
				FROM "memos_data" AS "E"
				WHERE "C"."id_memo" = "E"."id_memo"
			)  AS "D") AS "C1"
		FROM "memos" AS "C"
	)  AS "skip"
	ORDER BY "skip"."C1" DESC ) AS "G"
INNER JOIN "memos_data" AS "H" ON "G"."id_memo" = "H"."id_memo"
```

[1]: http://msdn.microsoft.com/en-us/library/bb308959.aspx
[2]: http://msdn.com/ef
[3]: http://firebird.svn.sourceforge.net/viewvc/firebird/NETProvider/trunk/NETProvider/source/FirebirdSql/Data/Entity/SqlGenerator.cs?view=markup