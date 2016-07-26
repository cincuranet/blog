---
title: "Custom encryption of field with Entity Framework"
date: 2013-01-22T09:23:31Z
tags:
  - Encryption
  - Entity Framework
  - Security
redirect_from: /id/233147/
category: none
layout: post
---
Yesterday there was a good question on Twitter with `[#efhelp][1]` hashtag. The core is about using [Entity Framework][2] to store entities, that store the properties encrypted somehow. So it's custom encryption on client side (not on server). Of course, I could take Entity Framework sources and modify some file, but I wanted to do it with official release. The assumption I'm working with is that the entity itself knows how to encrypt and decrypt data (another valid approach might be that the `[DbContext][3]` does that).

<!-- excerpt -->

The problem is, that the entity itself doesn't know when it's providing data to EF's code (and hence it should be encrypted) and when to "normal" code (unencrypted). But we can kind of get this info (except looking at stack trace, which might be very slow). I [used similar approach as I did few years back with validation][4], before it was added directly to EF's API.

Here's the code:

```csharp
class MyContext : DbContext
{
	public MyContext()
		: base(@"server=(localdb)\mssql;integrated security=true;database=test;")
	{ }

	public IDbSet<SuperSecured> SuperSecured { get; set; }

	public override int SaveChanges()
	{
		var secured = this.ChangeTracker.Entries()
			.Where(x => x.State == EntityState.Added || x.State == EntityState.Modified)
			.Where(x => x.Entity is ISecured)
			.Select(x => x.Entity as ISecured)
			.ToArray();
		foreach (var item in secured)
		{
			item.Unlock();
		}
		try
		{
			return base.SaveChanges();
		}
		finally
		{
			foreach (var item in secured)
			{
				item.Lock();
			}
		}
	}
}

interface ISecured
{
	void Lock();
	void Unlock();
}

class SuperSecured : ISecured
{
	const string EncryptedStringPrefix = "X";

	bool _locked;

	public SuperSecured()
	{
		_locked = true;
	}

	public int ID { get; set; }
	public string Name { get; set; }
	string _topSecret;
	public string TopSecret
	{
		get
		{
			return _locked
				? Decrypt(_topSecret)
				: _topSecret;
		}
		set
		{
			_topSecret = IsEncrypted(value)
				? value
				: Encrypt(value);
		}
	}

	public static string Encrypt(string s)
	{
		return EncryptedStringPrefix + new string(s.Reverse().ToArray());
	}

	public static string Decrypt(string s)
	{
		return new string(s.Remove(0, 1).Reverse().ToArray());
	}

	public static bool IsEncrypted(string s)
	{
		return s.StartsWith(EncryptedStringPrefix);
	}

	public void Lock()
	{
		_locked = true;
	}

	public void Unlock()
	{
		_locked = false;
	}
}
```

```csharp
using (var ctx = new MyContext())
{
	if (ctx.Database.Exists())
		ctx.Database.Delete();
	ctx.Database.Create();
	ctx.SuperSecured.Add(new SuperSecured() { Name = "Testing", TopSecret = "This is not a palindrome ;)" });
	ctx.SaveChanges();
	ctx.SuperSecured.ToList().ForEach(x => Console.WriteLine("{0}|{1}", x.Name, x.TopSecret));
}
```

First a note. The "encryption" here isn't smart even a little. It's just to be there. Do not even think about using it. ;) So how it works?

Let's start with `SaveChanges` method. This method looks, before doing any saving, for entities with `ISecured` interface (It might be good idea not to expose this interface to public, but it's up to you. ;)). Then every entity is switched to _unlocked_ state. Unlocked means, that it will provide raw data, encrypted. Then the saving goes and finally the same entities (the collection is materialized before) are switched back to locked state. The _locked_ and _unlocked_ state is simply switching between providing clean decrypted data or raw encrypted data respectively. That's for the saving.

What about reading. Here we don't have a directly one place where this happens. So I used another trick that's often used. Because what's the problem here? We need to distinguish between user code storing some values (this data should be encrypted) and EF's infrastructure storing values while materializing entities (this data is already encrypted). So the trick is to us some kind of flag or marker to recognize whether the data is encrypted or not (again my implementation is way too dumb, just proof of concept). If so, store it as is, it'll decrypted in `getter`. Else encrypt.

Nothing magical, right? :) Feel free to comment and/or improve.

[1]: {{ site.address }}{% post_url 2011-11-11-232567-improved-efhelp-hashtag-cooperation-with-efhelp %}
[2]: http://msdn.com/ef
[3]: http://msdn.microsoft.com/en-us/library/system.data.entity.dbcontext(v=vs.103).aspx
[4]: {{ site.address }}{% post_url 2009-02-24-229056-onvalidate-like-validation-in-entity-framework %}