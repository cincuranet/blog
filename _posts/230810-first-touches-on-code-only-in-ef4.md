---
title: |-
  First touches on Code Only in EF4
date: 2009-09-19T18:04:04Z
tags:
  - Entity Framework
  - Firebird
  - MS SQL Server
  - Visual Studio
---
I finally got my hands on the new feature in EF4, Code Only. It's now available in [feature CTP][1]. What's the code only? Very shortly you write just a code and express your mapping in code as well. There's no model, no edmx file, no CSDL, MSL, SSDL files.

The current version is pretty limited, it's more preview than something you can do some work with (which I wasn't aware of and I was little disappointed). You can read more about what will be available on [http://blogs.msdn.com/efdesign/archive/2009/06/10/code-only.aspx][2], [http://blogs.msdn.com/efdesign/archive/2009/08/03/code-only-enhancements.aspx][3] and [http://thedatafarm.com/blog/data-access/next-version-of-ef-code-only-design-laid-out-by-ms/][4].

I mainly wanted to try it on a non standard (read: not "follow this demo") MS SQL database and on Firebird as well. The first bad news is, that current CTP supports only SqlClient. And probably some following previews will too, as the other providers model will be built on top of it (but I'll try to push this as much as I can, to see some Firebird demo soon). The other is, that the currently available version is limited, even features in first Code Only blog post are not working. :( Right now you can only create a context and use it for work with all defaults – default names for tables, default mapping etc.

```csharp
using (SqlConnection conn = new SqlConnection(@"Data Source=.sqlexpress;Initial Catalog=testovaci;Integrated Security=True;Pooling=False"))
{
	ContextBuilder<COContext> builder = new ContextBuilder<COContext>();
	COContext context = builder.Create(conn);
	string script = context.CreateDatabaseScript();
	context.Masters.ToArray();
}
```

Nothing special. If you try it with [FirebirdClient][5], you'll get NotSupportedException immediately. Dammit.

```csharp
using (FbConnection conn = new FbConnection("database=localhost:rrr.fdb;user=sysdba;password=sysdba"))
{
	ContextBuilder<COContext> builder = new ContextBuilder<COContext>();
	builder.Create(conn);
}
```

Despite the frustration I found couple of new interesting extension methods (in Microsoft.Data.Objects, also ContextBuilder sits there). One of these is CreateDatabaseScript. This method works not only with Code Only created ObjectContext, but on every ObjectContext. So you can create your database creation script during runtime even if you're using i.e. EDMX file easily. I'm also seeing great opportunity for this with Code Only setup during runtime. You can have different builds with different setups and create script for users based on selection. And by the way, there's also CreateDatabase method available. But again right now works only with MS SQL only. But I know other databases will be supported as well, I have tested some pieces already.

I like the Code Only feature, maybe more than Model First (probably because I'm using ERD tools to model my databases). And I'm looking forward to see more progress on it, and also the model for 3^rd^ party providers.

[1]: http://blogs.msdn.com/adonet/archive/2009/06/22/announcing-entity-framework-feature-ctp-1.aspx
[2]: http://blogs.msdn.com/efdesign/archive/2009/06/10/code-only.aspx
[3]: http://blogs.msdn.com/efdesign/archive/2009/08/03/code-only-enhancements.aspx
[4]: http://thedatafarm.com/blog/data-access/next-version-of-ef-code-only-design-laid-out-by-ms/
[5]: http://firebirdsql.org/index.php?op=files&id=netprovider