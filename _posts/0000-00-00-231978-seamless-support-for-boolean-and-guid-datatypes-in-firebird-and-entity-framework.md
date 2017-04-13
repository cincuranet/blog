---
title: |-
  Seamless support for Boolean and GUID datatypes in Firebird and Entity Framework
date: 2010-09-06T13:48:42Z
tags:
  - Entity Framework
  - Entity SQL
  - Firebird
  - LINQ
layout: post
---
It may came as a shock but [Firebird][1] does not have direct support for neither bools nor guids. On the other hand people around Firebird are smart and came with more or less standard solutions for both. The bool is easy, just use number with constraint to 0 or 1. For guid we (ab)use special character set available in engine. It's called `OCTETS` and it's exactly what you think it is. Just a bunch of binary data, without any other interpretation from engine. That means `CHAR(16)` and the above character set is a perfect match for storing (not only) guids.

On the other side, where [.NET Framework][2] and [Entity Framework][3] lives, the bool and guid datatypes are core part of both frameworks. This created a small mismatch or better to say inconvenience. It wasn't showstopper but working with (or actually without) it wasn't pleasure either.

But this is over, since today, I used similar [trick we used for "identity" columns][4] and added two new special keyword (if I can call it like that). `#BOOL#` and `#GUID#`. When you use these (we're looking for these in whole comment, so you can place it anywhere you want), your model will contain properties with accordant types. (Note, we're not doing any checks whether your underlying datatype is compatible, it's up to you.) Similarly the internals of Entity Framework support were improved to handle these changes correctly (as well as [Model First][5] support).

If you wanna try it, grab it from [SVN][6] or [weekly builds][7] and enjoy. And report any problems you encounter, of course.

[1]: http://www.firebirdsql.org
[2]: http://www.microsoft.com/net/
[3]: http://msdn.microsoft.com/en-us/library/bb399572.aspx
[4]: {% include post_id_link.txt id="230841" %}
[5]: http://blogs.msdn.com/b/adonet/archive/2009/11/05/model-first-with-the-entity-framework-4.aspx
[6]: http://firebird.svn.sourceforge.net/svnroot/firebird/NETProvider/trunk/
[7]: http://netprovider.cincura.net