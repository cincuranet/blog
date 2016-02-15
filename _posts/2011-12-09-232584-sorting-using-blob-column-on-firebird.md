---
title: "Sorting using blob column on Firebird"
date: 2011-12-09T19:27:25Z
tags:
  - Databases in general
  - Firebird
  - SQL
redirect_from: /id/232584/
category: none
layout: post
---
Imagine you have a blob column and you want to add sorting clause to your query based on that column. Crazy? Might be. On the other hand, why not?

[Firebird][1] allows you to use blob column for sorting. No problem. But the behavior might surprise you. I'm not going to deeply describe how the blobs are stored in Firebird database. Simply speaking, it's stored in separate data pages and inside row only `blob id` is stored. If you use blob column for sorting, Firebird isn't fetching the complete blob (though looks straightforward, it would be very slow), but rather uses `blob id` for sorting. You probably see the problem already - the `blob id` has nothing to do with content. Hence the sorting will be very likely broken.

But there's a solution. I'm assuming that you want to mainly sort on text blobs (though you can use it on binary blobs too). Simply cast the blob to i.e. `varchar(20)` (choose length that fits your needs) and sort using this. Yes, it's going to be slow, but if you need to do it often, you can precompute this column (using trigger etc.).

[1]: http://www.firebirdsql.org
