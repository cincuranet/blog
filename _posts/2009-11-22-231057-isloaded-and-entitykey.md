---
title: |
  IsLoaded and EntityKey
date: 2009-11-22T21:25:20Z
tags:
  - Entity Framework
layout: post
---
Today I discovered behavior of Entity Framework that is completely logic, but may surprise you, as it surprised me. Simply consider two entities with 1-N relationship. If you're loading the "N-entity", you know, whether the "1-part" is in database, because the foreign key column has some value or is null. If it's null and you'll check the [IsLoaded][1] property of [EntityReference<T>][2] it will say true, even you didn't call [Load][3] method. And it's correct and smart, because you know that the value will be null (because of the null foreign key column).

But if you set the [EntityKey][4] of EntityReference<T> (because you're kind of simulating (i.e. for performance reasons) creating the association thru FK in EFv1) and SaveChanges, even after this, the IsLoaded will be true, Value will be null, but it will not be correct from point of view in current time. Sure working with EntityKey directly isn't the recommended way, unless you know what you're doing. On the other hand, if the EF is smart enough to state, that the EntityReference<T> was loaded for this null case (even if not explicitly), maybe it should be smart to invalidate this state when something changes in EntityKey (and changes are saved into database).

What do you think? Is it true or should you expect and know this when playing with EntityKey (as you should be probably enough experienced when using EntityKey)?

[1]: http://msdn.microsoft.com/en-us/library/system.data.objects.dataclasses.relatedend.isloaded.aspx
[2]: http://msdn.microsoft.com/en-us/library/bb297956.aspx
[3]: http://msdn.microsoft.com/en-us/library/bb896351.aspx
[4]: http://msdn.microsoft.com/en-us/library/system.data.entitykey.aspx