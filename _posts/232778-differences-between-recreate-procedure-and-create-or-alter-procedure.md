---
title: |-
  Differences between "recreate procedure/..." and "create or alter procedure/..."
date: 2012-04-03T14:17:11Z
tags:
  - Firebird
  - SQL
---
I was recently in a talk related to [Firebird][1] and I found, that people are not aware of these two constructs. Either they don't know both or don't know they differ. These statements are doing similar stuff, but the evil is in details.

So what's the big deal? Both are kind of "updating" the procedure (or other object types). But the first one will first drop the procedure and then create it back again (yes, dependencies may break that). On the other hand, the another is creating the procedure if it doesn't exist yet or altering it otherwise. Dependencies aside, what else might be "attached" to procedure? Yes, it's i.e. access rights (grants). The former one will not keep these. You're responsible to granting access to it again. The other one will, it's just alter of procedure definition.

If not used carefully, you can easily break the database. Either one isn't correct in all cases. Always use what's appropriate for your scenario.

[1]: http://www.firebirdsql.org