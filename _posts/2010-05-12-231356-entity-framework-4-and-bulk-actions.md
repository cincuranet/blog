---
title: "Entity Framework 4 and bulk actions"
date: 2010-05-12T11:26:44Z
tags:
  - Entity Framework
  - Entity SQL
  - LINQ
redirect_from: /id/231356/
layout: post
---
Though Entity Framework 4 doesn't support bulk action, you can do it. As [Matthieu Mezil][1] [shows, it's possible][2]. Nice piece of code, Matthieu.

If you don't wanna play with it and go straight, you can create a stored procedure for action you need to call it. That's how I'm doing it. Maybe in next version of EF somebody will think about bulk actions and we'll see it.

And the [v3][3]/[v4][4] is pretty awesome. It's really going through a lot of options and dealing with it. Worth at least looking at it and quickly thinking about it.

[1]: http://msmvps.com/blogs/matthieu
[2]: http://msmvps.com/blogs/matthieu/archive/2010/05/12/bulk-delete-with-ef4.aspx
[3]: http://msmvps.com/blogs/matthieu/archive/2010/05/21/bulk-delete-v3.aspx
[4]: http://msmvps.com/blogs/matthieu/archive/2010/05/27/bulk-delete-v4.aspx