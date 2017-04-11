---
title: |-
  Astoria 1.5 CTP2 - projections and counts
date: 2009-09-20T15:53:45Z
tags:
  - Entity Framework
  - OData/Data Services (Astoria)
layout: post
---
CTP2 for Astoria 1.5 has been released some days ago and this version comes with couple of new features. You can read about the list on [http://blogs.msdn.com/adonet/archive/2009/09/01/ado-net-data-services-v1-5-ctp2-now-available.aspx][1]. For me, the projections support and count support are the most exciting.

The lack of projections support was a pain if you had some big blob fields in your model. I sketched little workaround [here][2]. But since this version you can use the `$select` operator to get only columns you're interested in. You'll write for instance `http://foobar/Service.svc/Masters?$select=ID,Name,Details`, and you get back object with properties ID, Name and collection Details (for simple master-detail example). So you can easily get data except already mentioned big blob fields.

The other new feature is support for count. You can simply ask Astoria to return number of entities in particular query. You can use it without any filtering etc. i.e. `http://foobar/Service.svc/Masters/$count` or with other operators as well, i.e. `$filter`: `http://foobar/Service.svc/Masters/$count?$filter=Name eq 'rrr'`. So you don't have to fetch all the data returned just to get the final number. And that's not all. You can get count of entities in result also inline. With keyword `$inlinecount` you get the result and the count as well. The query `http://foobar/Service.svc/Masters?$inlinecount=allpages&$top=2` will return at most two entities and count of all. On the other hand the `http://foobar/Service.svc/Masters?$inlinecount=allpages&$filter=ID lt 5&$top=2` will return count of entities where `ID < 5` and only two of these. Simply the `$inlinecount` is applied to whole result after all `$filter`s have been applied. This inline count is pretty nice especially for classic "list of products" view with paging not to overload the user.

Looking forward to see the new version of Astoria, [Astoria "offline"][3] and Entity Framework v4 all released.

[1]: http://blogs.msdn.com/adonet/archive/2009/09/01/ado-net-data-services-v1-5-ctp2-now-available.aspx
[2]: {% post_url 0000-00-00-230674-select-method-kind-of-in-ado-net-data-services-to-exclude-big-blob-fields %}/
[3]: {% post_url 0000-00-00-230768-playing-with-astoria-offline %}/