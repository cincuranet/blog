---
title: |-
  Ultimate EFv4 CTP4 Code First (full mapping) example (using Firebird)
date: 2010-07-26T18:25:28Z
tags:
  - Entity Framework
  - Firebird
  - MS SQL Server
layout: post
---
There's a lot of content for latest CTP, CTP4, for Entity Framework "new features". It's mainly focused on Code First stuff, that fills the triad with Database First and Model First. I like Code First but what I also like is maintainable code. Hence I was more trying not to use [convention-over-configuration][1], in opinion good for only small projects, and focus on specifying everything the way _I_ want it to be, especially with my database structure (yes, I'm data consistency and storage freak).

Let's model some kind of simple library and try to use there couple of Entity Framework's features. And to make things worse, try to do it with [ADO.NET provider for Firebird][2].

Good news is I succeeded. My database structure was my first and non-touchable object (to be honest the first was the idea what to create and how to represent it in database) together with the idea of objects.

Here's the script for [Firebird][3] database ([Did you noticed we're fully Entity Framework 4 compatible?][4]). <small>See the quoted column names? Yes, not nice, but later in mapping in C# it looks nicer. ;) And I mixed the mapping with one for MS SQL Server (see below).</small>

```sql
RECREATE TABLE Authors (
	"id" INT NOT NULL,
	"FirstName" VARCHAR(255) NOT NULL,
	"LastName" VARCHAR(255) NOT NULL,
CONSTRAINT PK_Authors PRIMARY KEY ("id")
);
RECREATE TABLE Books (
	"id" INT NOT NULL,
	"Discriminator" char(2) NOT NULL,
	"Title" VARCHAR(1000) NOT NULL,
	"Published" TIMESTAMP NOT NULL,
	"ID_Author" INT NOT NULL,
	"IssuesPerYear" SMALLINT,
	"Price" DECIMAL(9,0),
CONSTRAINT PK_Books PRIMARY KEY ("id")
);
RECREATE TABLE Languages (
	"id" INT NOT NULL,
	"LanguageName" VARCHAR(100) NOT NULL,
	"LanguageAbbrevation" CHAR(3),
CONSTRAINT PK_Languages PRIMARY KEY ("id")
);
RECREATE TABLE Translators (
	"id" INT NOT NULL,
CONSTRAINT PK_Translators PRIMARY KEY ("id")
);
RECREATE TABLE Translators_Languages (
	"ID_Language" INT NOT NULL,
	"ID_Translator" INT NOT NULL,
CONSTRAINT PK_Translators_Languages PRIMARY KEY ("ID_Language", "ID_Translator")
);
ALTER TABLE Books ADD CONSTRAINT FK_Book_Author FOREIGN KEY ("ID_Author")
REFERENCES Authors("id")
ON DELETE CASCADE
;
ALTER TABLE Translators_Languages ADD CONSTRAINT FK_TL_Languages FOREIGN KEY ("ID_Language")
REFERENCES Languages("id")
ON DELETE NO ACTION
;
ALTER TABLE Translators_Languages ADD CONSTRAINT FK_TL_Translators FOREIGN KEY ("ID_Translator")
REFERENCES Translators("id")
ON DELETE NO ACTION
;
ALTER TABLE Translators ADD CONSTRAINT FK_TypeConstraint FOREIGN KEY ("id")
REFERENCES Authors("id")
ON DELETE NO ACTION
;
```

So it's time to create mapping right? Nope. Now I'll switch my brain from [ER thinking][5] into [OO thinking][6] mode. Here's the world of entities (sure I made some adjustments to fit some Entity Framework features, like [Complex Types][7]):

```csharp
public abstract class Book
{
	public int ID { get; protected set; }
	public string Title { get; set; }
	public DateTime Published { get; set; }
	public Author Author { get; set; }
	public int AuthorID { get; set; }
}
public class RealBook : Book
{
	public decimal Price { get; set; }
}
public class Magazine : Book
{
	public short IssuesPerYear { get; set; }
}
public class Author
{
	public int ID { get; protected set; }
	public Name FullName { get; set; }
	public ICollection<Book> Books { get; set; }
	public Author()
	{
		this.Books = new List<Book>();
	}
}
public class Translator : Author
{
	public ICollection<Language> Languages { get; set; }
	public Translator()
	{
		this.Languages = new List<Language>();
	}
}
public class Language
{
	public int ID { get; protected set; }
	public string LanguageName { get; set; }
	public string LanguageAbbrevation { get; set; }
}
#region Complex Types
public class Name
{
	public string FirstName { get; set; }
	public string LastName { get; set; }
}
#endregion
```

As you see I'm using pure [POCO][8]s.

So far we haven't touched any Entity Framework related stuff. So it's time to create our context and all [DAL][9] related stuff. Mine is very simple and exposes only few properties and methods, just to keep it simple and focus on the aim.

```csharp
public class LibraryContext : DbContext
{
	public LibraryContext(DbConnection connection)
		: base(connection)
	{
		this.ObjectContext.ContextOptions.LazyLoadingEnabled = false;
	}
	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		base.OnModelCreating(modelBuilder);
		modelBuilder.Configurations.Add(new BookConfiguration());
		modelBuilder.Configurations.Add(new AuthorConfiguration());
		modelBuilder.Configurations.Add(new TranslatorConfiguration());
		modelBuilder.Configurations.Add(new LanguageConfiguration());
		modelBuilder.Configurations.Add(new NameConfiguration());
	}
	public string CreateDatabaseScript()
	{
		return this.ObjectContext.CreateDatabaseScript();
	}
	public IDbSet<Book> Books
	{
		get { return this.Set<Book>(); }
	}
	public IDbSet<Author> Authors
	{
		get { return this.Set<Author>(); }
	}
}
public class DoNothingWithMyDatabase<TContext> : IDatabaseInitializer<TContext>
	where TContext : DbContext
{
	public void InitializeDatabase(TContext context)
	{ }
}
```

Pretty simple, isn't it. I'm using new stripped down objects DbContext (← [ObjectContext][10]) and IDbSet/DbSet (← [IObjectSet][11]/[ObjectSet][12]).

You may also notice, I've created object which implements `IDatabaseInitializer`. That's because, by default, Entity Framework will try to create database for you and check whether your database matches model (`CreateDatabaseOnlyIfNotExists`). _I_'m controlling my database. You have to add somewhere into your application before doing anything with the context call to `SetInitializer`:

```csharp
Database.SetInitializer(new DoNothingWithMyDatabase<LibraryContext>());
```

And finally we're ready to dive into the mapping. Again, you can type the mapping directly into overridden `OnModelCreating`, useful if you have only couple of diversions from [default conventions][13]. I created configuration classes where I specified as much as I want. And I need (almost) everything to be nailed down (remember, data consistency and storage freak ;)) as I don't want to be surprised when something in database or in entities changes and application will start behave weird.

```csharp
class BookConfiguration : EntityConfiguration&ltBook>
{
	public BookConfiguration()
	{
		this.HasKey(x => x.ID);
		this.Property(x => x.ID).IsIdentity();
		this.Property(x => x.Title).IsRequired().IsVariableLength().HasMaxLength(1000).IsUnicode();
		this.Property(x => x.Published);
		this.HasRequired(x => x.Author).WithMany(a => a.Books).WillCascadeOnDelete().HasConstraint((b, a) => b.AuthorID == a.ID);
		this.MapHierarchy()
			.Case<Book>(x => new
			{
				id = x.ID,
				Title = x.Title,
				Published = x.Published,
				ID_Author = x.AuthorID,
			})
			.Case<RealBook>(x => new
			{
				Discriminator = "B",
				Price = x.Price,
			})
			.Case<Magazine>(x => new
			{
				Discriminator = "M",
				IssuesPerYear = x.IssuesPerYear,
			})
#if FB
			.ToTable("BOOKS");
#else
			.ToTable("Books");
#endif
	}
}
class AuthorConfiguration : EntityConfiguration<Author>
{
	public AuthorConfiguration()
	{
		this.HasKey(x => x.ID);
		this.Property(x => x.ID).IsIdentity();
		this.HasMany(x => x.Books);
		this.MapHierarchy(x => new
		{
			id = x.ID,
			FirstName = x.FullName.FirstName,
			LastName = x.FullName.LastName,
		})
#if FB
		.ToTable("AUTHORS");
#else
		.ToTable("Authors");
#endif
		this.MapHierarchy().Case<Translator>(x => new
		{
			id = x.ID,
		})
#if FB
		.ToTable("TRANSLATORS");
#else
		.ToTable("Translators");
#endif
	}
}
class TranslatorConfiguration : EntityConfiguration<Translator>
{
	public TranslatorConfiguration()
	{
		this.HasMany(x => x.Languages).WithMany()
#if FB
			.Map("TRANSLATORS_LANGUAGES",
#else
			.Map("Translators_Languages",
#endif
				(t, l) => new
				{
					ID_Translator = t.ID,
					ID_Language = l.ID,
				});
	}
}
class LanguageConfiguration : EntityConfiguration<Language>
{
	public LanguageConfiguration()
	{
		this.HasKey(x => x.ID);
		this.Property(x => x.ID).IsIdentity();
		this.Property(x => x.LanguageName).IsRequired().IsVariableLength().HasMaxLength(100).IsUnicode();
		this.Property(x => x.LanguageAbbrevation).IsFixedLength().HasMaxLength(3).IsUnicode();
		this.MapSingleType(x => new
		{
			id = x.ID,
			LanguageName = x.LanguageName,
			LanguageAbbrevation = x.LanguageAbbrevation
		})
#if FB
		.ToTable("LANGUAGES");
#else
		.ToTable("Languages");
#endif
	}
}
class NameConfiguration : ComplexTypeConfiguration<Name>
{
	public NameConfiguration()
	{
		this.Property(x => x.FirstName).IsRequired().IsVariableLength().HasMaxLength(255).IsUnicode();
		this.Property(x => x.LastName).IsRequired().IsVariableLength().HasMaxLength(255).IsUnicode();
	}
}
```

I don't know whether it's worth to describe the lines. Should be understandable if you know how the entities and database look like. Just maybe small notice. Besides Complex Types we used two most common inheritance mapping scenarions - TPH aka Table Per Hierarchy for Books and TPT aka Table Per Type for Authors (there's also TPC (Table Per Concrete Type)). However if you have questions feel free to use comments, if I'll know answer I'll be happy to reply.

And finally some really simple application to test the result <small>(If you define `#define FB` it'll use Firebird database else [MS SQL Server][14].)</small>:

```csharp
Database.SetInitializer(new DoNothingWithMyDatabase<LibraryContext>());
Action<LibraryContext> doSomething = (context) =>
{
	Console.WriteLine(context.CreateDatabaseScript());
	var query = context.Books
		.Select(b => new
		{
			BookName = b.Title,
			AuthorName = b.Author.FullName.LastName + ", " + b.Author.FullName.FirstName
		})
		.OrderBy(x => x.BookName);
	Console.WriteLine((query as ObjectQuery).ToTraceString());
	var data = query.ToArray();
	foreach (var item in data)
	{
		Console.WriteLine("Book {0} written by {1}.", item.BookName, item.AuthorName);
	}
};
#if FB
using (LibraryContext context = new LibraryContext(new FbConnection(@"database=localhost:ctp4;username=sysdba;password=masterkey;pooling=true;")))
{
	doSomething(context);
}
#else
using (LibraryContext context = new LibraryContext(new SqlConnection(@"Data Source=.\sqlexpress;Initial Catalog=ctp4;Integrated Security=True;Pooling=False;MultipleActiveResultSets=True")))
{
	doSomething(context);
}
#endif
```

I'm glad I was able to figure out how to map everything without touching database structure (although it's pretty straightforward) or letting the default rules to kick in. Hope it will help you if you struggle with something (and hope the naming will not change much in future). It's also nice to see the whole infrastructure fits together and changing provider, in my case for Firebird's, doesn't make the code to blow out.

[1]: http://en.wikipedia.org/wiki/Convention_over_configuration
[2]: http://www.firebirdsql.org/index.php?op=files&id=netprovider
[3]: http://www.firebirdsql.org/
[4]: {% include post_id_link.txt id="231382" %}
[5]: http://en.wikipedia.org/wiki/Entity-relationship_model
[6]: http://en.wikipedia.org/wiki/Object-oriented_programming
[7]: http://msdn.microsoft.com/en-us/library/bb738472.aspx
[8]: http://en.wikipedia.org/wiki/Plain_Old_CLR_Object
[9]: http://en.wikipedia.org/wiki/Data_access_layer
[10]: http://msdn.microsoft.com/en-us/library/system.data.objects.objectcontext.aspx
[11]: http://msdn.microsoft.com/en-us/library/dd642094.aspx
[12]: http://msdn.microsoft.com/en-us/library/dd412719.aspx
[13]: http://blogs.msdn.com/b/efdesign/archive/2010/06/01/conventions-for-code-first.aspx
[14]: http://www.microsoft.com/sqlserver/