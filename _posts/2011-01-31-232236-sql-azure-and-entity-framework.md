---
title: "SQL Azure and Entity Framework"
date: 2011-01-31T10:34:49Z
tags:
  - Azure
  - Cloud
  - SQL Azure
redirect_from: /id/232236/
category: none
layout: post
---
From time to time I get a question about [SQL Azure][1] and [Entity Framework][2]. Can I use it? Does it work? Etc. Because the SQL Azure is in fact a special version (you can check [unsupported][3] and [partially supported][4] T-SQL statements) of MS SQL Server it works without any hassle. That's the short story.

The following lines will quickly guide you through the steps of using SQL Azure with Entity Framework. You need to have and Azure account ready. There's no way to install SQL Azure to your own server or something like that. First login in to [sql.azure.com][5] and select some project you have there. This will bring you this screen.

![image]({{ site.address }}/i/232236/azure_ef_1.png)

By default only `master` database is created and it's up to you to create additional database. Right now you can create from two editions and few sizes: Web and Business and from 1GB to 50GB. The price you'll pay depends on this selection (but not only). For purpose of this article I created 1GB Web edition database.

![image]({{ site.address }}/i/232236/azure_ef_2.png)

On the main screen you have a button to get a connection string. I'm often using it, as it's easier for me to get information from it than compose it from pieces on screen. :) Mine is:

```text
Data Source=lskqxi46a0.database.windows.net;Initial Catalog=test;Persist Security Info=True;User ID=jiri@lskqxi46a0;Password=******;MultipleActiveResultSets=True;Encrypt=True
```

After these initial steps we can start using the database. Because I was too lazy to create tables and so on manually I tested one feature of Entity Framework I'm not much familiar with. It's Model First. You simply create the conceptual model and later generate SQL script from it for your database (yes, Firebird has support too ;)). I created basic "blogging system" model. `Author` has many `Post`s. `Post`s have many `Tag`s. Right clicking on model and selecting `Generate database from model` resulted in my case in simple script.

```sql
-- --------------------------------------------------
-- Entity Designer DDL Script for SQL Server 2005, 2008, and Azure
-- --------------------------------------------------
-- Date Created: 01/29/2011 16:40:18
-- Generated from EDMX file: C:\Users\Jiri\Desktop\ConsoleApplication3\ConsoleApplication3\Model1.edmx
-- --------------------------------------------------
SET QUOTED_IDENTIFIER OFF;
GO
USE [test];
GO
IF SCHEMA_ID(N'dbo') IS NULL EXECUTE(N'CREATE SCHEMA [dbo]');
GO
-- --------------------------------------------------
-- Dropping existing FOREIGN KEY constraints
-- --------------------------------------------------
IF OBJECT_ID(N'[dbo].[FK_BlogPostTag_BlogPost]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[BlogPostTag] DROP CONSTRAINT [FK_BlogPostTag_BlogPost];
GO
IF OBJECT_ID(N'[dbo].[FK_BlogPostTag_Tag]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[BlogPostTag] DROP CONSTRAINT [FK_BlogPostTag_Tag];
GO
IF OBJECT_ID(N'[dbo].[FK_BlogPostAuthor]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[BlogPosts] DROP CONSTRAINT [FK_BlogPostAuthor];
GO
-- --------------------------------------------------
-- Dropping existing tables
-- --------------------------------------------------
IF OBJECT_ID(N'[dbo].[BlogPosts]', 'U') IS NOT NULL
    DROP TABLE [dbo].[BlogPosts];
GO
IF OBJECT_ID(N'[dbo].[Authors]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Authors];
GO
IF OBJECT_ID(N'[dbo].[Tags]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Tags];
GO
IF OBJECT_ID(N'[dbo].[BlogPostTag]', 'U') IS NOT NULL
    DROP TABLE [dbo].[BlogPostTag];
GO
-- --------------------------------------------------
-- Creating all tables
-- --------------------------------------------------
-- Creating table 'BlogPosts'
CREATE TABLE [dbo].[BlogPosts] (
    [ID] int IDENTITY(1,1) NOT NULL,
    [Created] datetime  NOT NULL,
    [Heading] nvarchar(max)  NOT NULL,
    [Content] nvarchar(max)  NOT NULL,
    [Author_ID] int  NOT NULL
);
GO
-- Creating table 'Authors'
CREATE TABLE [dbo].[Authors] (
    [ID] int IDENTITY(1,1) NOT NULL,
    [Name_FirstName] nvarchar(max)  NOT NULL,
    [Name_LastName] nvarchar(max)  NOT NULL,
    [LastLoggedIn] datetime  NOT NULL
);
GO
-- Creating table 'Tags'
CREATE TABLE [dbo].[Tags] (
    [ID] int IDENTITY(1,1) NOT NULL,
    [Name] nvarchar(max)  NOT NULL
);
GO
-- Creating table 'BlogPostTag'
CREATE TABLE [dbo].[BlogPostTag] (
    [BlogPosts_ID] int  NOT NULL,
    [Tags_ID] int  NOT NULL
);
GO
-- --------------------------------------------------
-- Creating all PRIMARY KEY constraints
-- --------------------------------------------------
-- Creating primary key on [ID] in table 'BlogPosts'
ALTER TABLE [dbo].[BlogPosts]
ADD CONSTRAINT [PK_BlogPosts]
    PRIMARY KEY CLUSTERED ([ID] ASC);
GO
-- Creating primary key on [ID] in table 'Authors'
ALTER TABLE [dbo].[Authors]
ADD CONSTRAINT [PK_Authors]
    PRIMARY KEY CLUSTERED ([ID] ASC);
GO
-- Creating primary key on [ID] in table 'Tags'
ALTER TABLE [dbo].[Tags]
ADD CONSTRAINT [PK_Tags]
    PRIMARY KEY CLUSTERED ([ID] ASC);
GO
-- Creating primary key on [BlogPosts_ID], [Tags_ID] in table 'BlogPostTag'
ALTER TABLE [dbo].[BlogPostTag]
ADD CONSTRAINT [PK_BlogPostTag]
    PRIMARY KEY NONCLUSTERED ([BlogPosts_ID], [Tags_ID] ASC);
GO
-- --------------------------------------------------
-- Creating all FOREIGN KEY constraints
-- --------------------------------------------------
-- Creating foreign key on [BlogPosts_ID] in table 'BlogPostTag'
ALTER TABLE [dbo].[BlogPostTag]
ADD CONSTRAINT [FK_BlogPostTag_BlogPost]
    FOREIGN KEY ([BlogPosts_ID])
    REFERENCES [dbo].[BlogPosts]
        ([ID])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO
-- Creating foreign key on [Tags_ID] in table 'BlogPostTag'
ALTER TABLE [dbo].[BlogPostTag]
ADD CONSTRAINT [FK_BlogPostTag_Tag]
    FOREIGN KEY ([Tags_ID])
    REFERENCES [dbo].[Tags]
        ([ID])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
-- Creating non-clustered index for FOREIGN KEY 'FK_BlogPostTag_Tag'
CREATE INDEX [IX_FK_BlogPostTag_Tag]
ON [dbo].[BlogPostTag]
    ([Tags_ID]);
GO
-- Creating foreign key on [Author_ID] in table 'BlogPosts'
ALTER TABLE [dbo].[BlogPosts]
ADD CONSTRAINT [FK_BlogPostAuthor]
    FOREIGN KEY ([Author_ID])
    REFERENCES [dbo].[Authors]
        ([ID])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
-- Creating non-clustered index for FOREIGN KEY 'FK_BlogPostAuthor'
CREATE INDEX [IX_FK_BlogPostAuthor]
ON [dbo].[BlogPosts]
    ([Author_ID]);
GO
-- --------------------------------------------------
-- Script has ended
-- --------------------------------------------------
```

Now we can finally write some code to let Entity Framework do some dirty job. Let's create some authors and issue a non-trivial query to see what's what.

```csharp
using (Model1Container ctx = new Model1Container())
{
	Author a1 = new Author();
	a1.Name.FirstName = "Foo";
	a1.Name.LastName = "Bar";
	a1.LastLoggedIn = DateTime.Now;
	Author a2 = new Author();
	a2.Name.FirstName = "Jiri";
	a2.Name.LastName = "Cincura";
	a2.LastLoggedIn = DateTime.Now;
	ctx.Authors.AddObject(a1);
	ctx.Authors.AddObject(a2);
	ctx.SaveChanges();
	Debug.Assert(a1.ID != default(int));
	Debug.Assert(a2.ID != default(int));
	var blogPosts = ctx.Authors
		.Where(a => a.Name.LastName == "Cincura")
		.SelectMany(a => a.BlogPosts)
		.Where(bp => bp.Tags.Any(t => t.Name == "Databases" || t.Name == "Azure" || t.Name == "Cloud"))
		.Select(bp => new { bp.Heading, bp.Created });
	Console.WriteLine((blogPosts as ObjectQuery).ToTraceString());
	foreach (var blogPost in blogPosts)
	{
		Console.WriteLine(blogPost.Heading);
	}
}
```

Surprise. Nothing bloodthirsty. 8-) It works as expected. Two authors are created. You can check that by querying the table or by looking at database size at [sql.azure.com][6]. The query itself is standard T-SQL query you can run on MS SQL Server as well, nothing magic.

```sql
SELECT
[Extent1].[ID] AS [ID],
[Extent2].[Heading] AS [Heading],
[Extent2].[Created] AS [Created]
FROM  [dbo].[Authors] AS [Extent1]
INNER JOIN [dbo].[BlogPosts] AS [Extent2] ON [Extent1].[ID] = [Extent2].[Author_ID]
WHERE (N'Cincura' = [Extent1].[Name_LastName]) AND ( EXISTS (SELECT
	1 AS [C1]
	FROM  [dbo].[BlogPostTag] AS [Extent3]
	INNER JOIN [dbo].[Tags] AS [Extent4] ON [Extent4].[ID] = [Extent3].[Tags_ID]
	WHERE ([Extent2].[ID] = [Extent3].[BlogPosts_ID]) AND ([Extent4].[Name] IN (N'Databases',N'Azure',N'Cloud'))
))
```

Theory tells us, that if SQL Azure is more or less MS SQL Server database using more or less same wire protocol and more or less same T-SQL it should work. And it does. Here you have a small proof. Happy database-clouding.

[1]: http://www.microsoft.com/en-us/sqlazure/default.aspx
[2]: http://msdn.microsoft.com/en-us/library/bb399572.aspx
[3]: http://msdn.microsoft.com/en-us/library/ee336253.aspx
[4]: http://msdn.microsoft.com/en-us/library/ee336267.aspx
[5]: http://sql.azure.com
[6]: http://sql.azure.com