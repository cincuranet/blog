---
title: |-
  Playing with Astoria "offline"
date: 2009-07-18T09:42:06Z
tags:
  - Astoria "offline"
  - Entity Framework
  - Firebird
  - OData/Data Services (Astoria)
  - Sync Framework
---
Astoria so called offline has been released while ago. But until now I have no time and yen for playing with it. When I first heard about offline support for Astoria I was thinking, hmm that's going to be cool and though that it will be build inside the client itself, with an option to store this information and do offline work when no connection is available - something like "we suppose the connection is mostly available, hence this is only for the few cases when not".

But not. Astoria offline (at least the [preview][1] is based on, of course, regular Astoria and Entity Framework and then Sync Framework.So finally it works like this. You're doing queries using Entity Framework (local model) and local SQLCE database and if you need to get fresh data and/or push data back, you simply synchronize this source, using Sync Framework, with the webservice. That's a little bit different from what I was expecting. :)

I was playing with MS SQL Server as the source for webservice (but I'm also planing to use Firebird, but that needs some more hand work). Simple master-detail scenario for start (for conflicts and ordering testing it's enough).

```sql
create table sync_master(id int primary key, foo nvarchar(20) not null);
create table sync_detail(id int primary key, id_master int not null, bar nvarchar(20) not null);
alter table sync_detail add foreign key (id_master) references sync_master(id);
```

If you have your database ready, you'll add new model and the service. Currently the alpha preview generates you change script, to add some tracking columns into your tables and you'll simply run it. Good news is that you'll also get the script with drops and removes, thus after playing you can put tables back into original shape (but I still prefer playing on separate tables, as during testing I screw a lot of stuff). Configuration of service is more or less the same. Only change you have to do, is to allow synchronization.

```csharp
(config as IDataServiceConfiguration2).AllowSynchronization = true;
```

That's all. The service works as classic Astoria (I still get not used to ADO.NET Data Service name). Now the fun stuff comes. You can add any type of application to use the Astoria offline. I started with simple console application, to introduce as less as possible external screwing inputs.

First problem you may encounter is not working "auto setup" for offline work. I did dozen of apps and didn't find reliable way to make it work always. Close to this I was with these steps (but still not 100%):

* recompile the service
* view it in browser
* access one entity set
* hope for the best

Now when you add service reference to you project the additional process kicks in (should) and generates local SQLCE database, the model and some classes. When I was able to make this work, every time I reached the `Adding new database file to project...` step I get error message:

```text
An error occurred while processing the local data file:
Exception has been thrown by the target of an invocation.
```

Clicking OK and ignoring it worked and introduced none (as far as I'm aware of) problems later. No problem, remember it's alpha preview. With finally all set up, you can start playing.

```csharp
static void Main(string[] args)
{
	using (testovaciEntities ent = new testovaciEntities())
	{
		sync_master m = ent.sync_master.FirstOrDefault();
		if (m != null)
		{
			Console.WriteLine("Old: {0}", m.foo);
			m.foo = "b";
			Console.WriteLine("New: {0}", m.foo);
			ent.SaveChanges();
		}
		else
		{
			Console.WriteLine("No item");
		}
	}
	using (testovaciEntities ent = new testovaciEntities())
	{
		foreach (var item in ent.sync_master)
		{
			Console.WriteLine("ID: {0} t Foo: {1}", item.id, item.foo);
		}
	}
	Console.WriteLine("Syncing");
	Sync();
	Console.WriteLine("Done");
	using (testovaciEntities ent = new testovaciEntities())
	{
		foreach (var item in ent.sync_master)
		{
			Console.WriteLine("ID: {0} t Foo: {1}", item.id, item.foo);
		}
	}
}
static void Sync()
{
	var serviceSync = new DataServiceSyncProvider(new Uri("http://localhost:1744/WebDataService1.svc"), "global");
	var localSync = new ObjectContextSyncProvider(() => new testovaciEntities());
	localSync.ConflictHandler =
		(ISyncRecord sourceChange, ISyncRecord destinationChange) =>
		{
			Console.WriteLine("Conflict");
			return SyncConflictResolutionAction.SourceWins;
			//return SyncConflictResolutionAction.DestinationWins;
		};
	var so = new SyncOrchestrator();
	so.RemoteProvider = serviceSync;
	so.LocalProvider = localSync;
	so.Direction = SyncDirectionOrder.UploadAndDownload;
	so.StateChanged +=
		(object sender, SyncOrchestratorStateChangedEventArgs e) =>
		{
			Console.WriteLine("From {0} to {1}", e.OldState, e.NewState);
		};
	try
	{
		SyncOperationStatistics stats = so.Synchronize();
	}
	catch (Exception ex)
	{
		Console.WriteLine(ex.Message);
	}
}
```

I was expecting the synchronization to just work, and yep, it does. Anyway I was more interested in some conflicts, ordering etc. Because I was playing with Sync Framework when it was introduced and also done couple of presentations, I wasn't expecting some problems with ordering.

The conflict resolution is little bit different than in pure Sync Framework, but the idea behind is the same. Simply check SyncConflictResolutionAction enum (there's no MSDN doc for it right now). The synchronization worked for me as well, with some minor problems. Sometimes the conflict was resolved, but one source kept the old data. Maybe I'm doing something wrong, maybe it needs some support in ResolveSyncConflict on server side too. Never mind, I think in beta it will shine.

OK, that's pretty much all. It works, have some bugs (but remember it's alpha preview) and in some scenarios could be really useful. Let's try the Firebird - Entity Framework (and Astoria) works with Firebird, the Sync Framework too, so how hard can it be ...

[1]: http://www.microsoft.com/downloads/details.aspx?FamilyID=479F2216-E6F2-486F-80C9-2CFADE5082C1&displaylang=en