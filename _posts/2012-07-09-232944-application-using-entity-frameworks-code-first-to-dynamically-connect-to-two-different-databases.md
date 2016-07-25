---
title: "Application using Entity Framework's Code First to dynamically connect to two different databases"
date: 2012-07-09T09:08:47Z
tags:
  - Databases in general
  - Entity Framework
  - Firebird
  - MS SQL Server
  - Oracle Database
redirect_from: /id/232944/
category: none
layout: post
---
I was doing Entity Framework [training][1] roughly two weeks ago and normally I have 99% of people working with [MS SQL][2]. This however I had two guys from some company, where they worked with different databases, as the product they are working on is able to use couple of different databases. What a great setup. Finally I can show how to use [Entity Framework][3] with non-MS SQL databases.

They were interested particularly in [Oracle Database][4], but I'm not that familiar with the 3rd party providers for Oracle Database so we agreed on using [Firebird][5]. ;) The code we wanted to try was to connect with same application (without recompile) to two different databases based on connection string (or connection object itself), without mapping hassle etc.

I chose Code First, because it's the mapping itself is more separated from other parts than in EDMX (although the EDMX can be split to CSDL, MSL and SSDL files as well, you'll then need to edit there manually or temporarily create EDMX file back again to use designer easily).

Let's start with the structure. It's basic Books - Authors example (sorry, names in Czech, but Book = Kniha, Author = Autor).

Firebird:

```sql
create table Knihy(
  ISBN varchar(20) character set ASCII primary key,
  Nazev varchar(100) character set utf8 not null,
  Cena decimal(10,4) not null,
  ID_Autor int not null
);
create table Autori(
  ID int primary key,
  Jmeno varchar(100) character set utf8 not null,
  Prijmeni varchar(100) character set utf8 not null
);
alter table Knihy add foreign key (ID_Autor) references Autori(ID);
```

MS SQL:

```sql
create table Knihy(
  ISBN varchar(20) primary key,
  Nazev nvarchar(100) not null,
  Cena money not null,
  ID_Autor int not null
);
create table Autori(
  ID int primary key,
  Jmeno nvarchar(100) not null,
  Prijmeni nvarchar(100) not null
);
alter table Knihy add foreign key (ID_Autor) references Autori(ID);
```

Now the C# code. I'll start with classes, then basic Code First structure and finally the mapping.

Classes:

```csharp
class Autor
{
	public int ID { get; set; }
	public string Jmeno { get; set; }
	public string Prijmeni { get; set; }
	public ICollection<Kniha> Knihy { get; set; }
}
class Kniha
{
	public string ISBN { get; set; }
	public string Nazev { get; set; }
	public decimal Cena { get; set; }
	public Autor Autor { get; set; }
	public int AutorID { get; set; }
}
```

First interesting point. The `DbContext` class needs to create proper mapping based on connection object used:

```csharp
class MyContext : DbContext
{
	public MyContext(DbConnection connection)
		: base(connection, true)
	{ }
	protected override void OnModelCreating(DbModelBuilder modelBuilder)
	{
		base.OnModelCreating(modelBuilder);
		if (Database.Connection is FbConnection)
		{
			modelBuilder.Configurations.Add(new FirebirdAutorConfiguration());
			modelBuilder.Configurations.Add(new FirebirdKnihaConfiguration());
		}
		else if (Database.Connection is SqlConnection)
		{
			modelBuilder.Configurations.Add(new MSSQLAutorConfiguration());
			modelBuilder.Configurations.Add(new MSSQLKnihaConfiguration());
		}
		else
			throw new NotSupportedException();
	}
	public IDbSet<Autor> Autori { get; set; }
	public IDbSet<Kniha> Knihy { get; set; }
}
```

Looking at `Database.Connection` type I switch between two different configurations. So the `DbContext` itself isn't dealing with the mapping.

Finally the mapping (second interesting point):

```csharp
class MSSQLAutorConfiguration : EntityTypeConfiguration<Autor>
{
	public MSSQLAutorConfiguration()
	{
		this.ToTable("Autori");
	}
}
class MSSQLKnihaConfiguration : EntityTypeConfiguration<Kniha>
{
	public MSSQLKnihaConfiguration()
	{
		this.HasKey(x => x.ISBN);
		this.Property(x => x.AutorID).HasColumnName("ID_Autor");
		this.HasRequired(x => x.Autor).WithMany(x => x.Knihy).HasForeignKey(x => x.AutorID).WillCascadeOnDelete(false);
		this.Map(map =>
			{
				map.Properties(x => new { x.ISBN, x.Nazev, x.Cena, x.AutorID });
				map.ToTable("Knihy");
			});
	}
}
class FirebirdAutorConfiguration : EntityTypeConfiguration<Autor>
{
	public FirebirdAutorConfiguration()
	{
		this.Property(x => x.ID).HasColumnName("ID");
		this.Property(x => x.Jmeno).HasColumnName("JMENO");
		this.Property(x => x.Prijmeni).HasColumnName("PRIJMENI");
		this.ToTable("AUTORI");
	}
}
class FirebirdKnihaConfiguration : EntityTypeConfiguration<Kniha>
{
	public FirebirdKnihaConfiguration()
	{
		this.HasKey(x => x.ISBN);
		this.Property(x => x.ISBN).HasColumnName("ISBN");
		this.Property(x => x.Nazev).HasColumnName("NAZEV");
		this.Property(x => x.Cena).HasColumnName("CENA").HasColumnType("decimal").HasPrecision(10, 4);
		this.Property(x => x.AutorID).HasColumnName("ID_AUTOR");
		this.HasRequired(x => x.Autor).WithMany(x => x.Knihy).HasForeignKey(x => x.AutorID).WillCascadeOnDelete(false);
		this.Map(map =>
		{
			map.Properties(x => new { x.ISBN, x.Nazev, x.Cena, x.AutorID });
			map.ToTable("KNIHY");
		});
	}
}
```

For MS SQL I took a chance to save some typing and let conventions to kick in and do some work for me. For Firebird, I had to type a little bit more. What may not be absolutely clear is fact, that the mapping classes (the ones derived from `EntityTypeConfiguration<T>`) can create hierarchy. It doesn't have to be just one level deep. So if you have i.e. same column names in both databases you can use `HasColumnName` in some base class and use i.e. just `HasColumnType` and `Map` in derived classes used later to configure model builder.

And to test it actually works and produces expected queries and so on, simple test code.

```csharp
static void Main(string[] args)
{
	Database.SetInitializer<MyContext>(null);
	var fb = new FbConnection("database=localhost:test;user=sysdba;password=masterkey");
	var mssql = new SqlConnection(@"Data Source=.\sqlexpress;Initial Catalog=test;Integrated Security=True");
	Test(fb);
	Test(mssql);
}
static void Test(DbConnection conn)
{
	using (MyContext c = new MyContext(conn))
	{
		Console.WriteLine(c.Autori
			.Where(a => a.Knihy.Any(k => k.Cena > 10.0m)).ToString());
	}
}
```

I hope everything is clear. If you have a question, comments are here for you, I'll try my best to answer. If you'd like to have a training, [let me know][6].

[1]: http://www.x2develop.com
[2]: http://www.microsoft.com/sqlserver/
[3]: http://msdn.com/ef
[4]: http://www.oracle.com/us/products/database/index.html
[5]: http://www.firebirdsql.org
[6]: {{ site.address }}/about/
