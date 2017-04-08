---
title: |-
  What roles is user able to use?
date: 2009-07-09T11:31:02Z
tags:
  - Firebird
layout: post
---
About a month ago there was a question in [Firebird (CZ) group][1] how to find whether the user is able to use particular role or to get all roles for user.

As you probably know, a lot of stuff (almost everything) is in system catalog (system tables). The only problem is to figure out what's the right set of parameters to use. To get all roles with users able to use it, you can use:

```sql
select rdb$relation_name as "Role", rdb$user as "User" from rdb$user_privileges
where rdb$privilege = 'M' and rdb$user_type = 8 and rdb$object_type = 13;
```

The `rdb$privilege = 'M'` is to get all _member of_ privileges, the `rdb$user_type = 8` is about getting records for _users_ and finally `rdb$object_type = 13` filters only for _roles_ records.

The `rdb$user_privileges` table contains all privileges defined for the database - tables, stored procedures, triggers, roles, ..., but also take into account that current versions of Firebird (<3.0) are storing users (only, not roles) in system wide security database.

[1]: http://groups.google.com/group/firebird_cz/