---
title: "SQL command when inserting M:N association with identity columns in the underlying table"
date: 2010-02-18T13:51:39Z
tags:
  - Databases in general
  - Entity Framework
  - MS SQL Server
redirect_from: /id/231230/
category: none
layout: post
---
Today I uncovered a magic command from Entity Framework v4 when you create M:N association and the underlying table is defined with both columns as identity and you insert there. I don't what's it good for, as this table in fact only stores the two IDs to connect other tables. But somebody may build some logic on identity there, sure.

When I first saw the command, I was completely stunned. I had no idea what's going on there and whether I see there one or more commands. You can have fun too:

```sql
declare @generated_keys table([ID_A] int, [ID_B] int)
insert [dbo].[A_B]
output inserted.[ID_A], inserted.[ID_B] into @generated_keys
default values
select t.[ID_A], t.[ID_B]
from @generated_keys as g join [dbo].[A_B] as t on g.[ID_A] = t.[ID_A] and g.[ID_B] = t.[ID_B]
where @@ROWCOUNT > 0
```

As an old school guy I was first looking for semicolons and then later tried to decode it by "parsing" the content.

Isn't it nice... :)
