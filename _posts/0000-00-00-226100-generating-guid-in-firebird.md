---
title: |-
  Generating GUID in Firebird
date: 2007-07-28T18:27:00Z
tags:
  - Firebird
---
Some days ago I wrote post about "[How to store GUID values (not only from .NET) on a Firebird database][1]". In comments there was a really good point about generating GUID directly inside Firebird database. With current latest stable version (FB 2.0.1) this isn't possible. With 1.5 trunk version neither too. The only way how to do it, is to write UDF library with this function (or to download some UDF library, a lot of it has GUID-generate function). [I've never seen this written in stored procedure, but maybe ... ;)] This isn't good news. But it's not so bad. :) The new Firebird version 2.1, which is now in beta-stage, has a lot new function built-in - all functions from UDF-libs shipped with previous FB versions are now inside and also some new. One of these is also the GEN_UUID function. It's doing exactly what we need - returns universal unique number. Here's result from FB 2.1 Beta 1:

```text
SQL> select gen_uuid() from rdb$database;

GEN_UUID
================================
714BEC373EBC664990BB248A26111E04
SQL> select gen_uuid() from rdb$database;
GEN_UUID
================================
5831F10169030D46AB5A33FA15648D9C
SQL> select gen_uuid() from rdb$database;
GEN_UUID
================================
CCF4A86789D04F4B8BEE808C5CFCB852
```

[1]: {% include post_link id="225946" %}