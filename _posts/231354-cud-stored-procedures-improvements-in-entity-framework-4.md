---
title: |-
  CUD stored procedures "improvements" in Entity Framework 4
date: 2010-05-08T15:55:51Z
tags:
  - Databases in general
  - Entity Framework
---
The EDM designer in Entity Framework 4 has a "nice" new feature. You, know in EFv1 you was forced to map all three CUD procedures or nothing. If you didn't do that, the validation feature told you. If you do the same in EFv4 the validation succeeds. Great, you may think. Finally I can use just procedures I really want (if you whatsoever want to use SPs and tight the logic into database when using ORM) to use and the rest will be generated for me. But nope. In fact the error will be thrown in runtime(!!!).

It's described in documentation. But I couldn't help but wonder, who did this decision??? I hate every error in runtime, I like my static compile time checking. It's much safer, in my opinion.