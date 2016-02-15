---
title: "Using Firebird inside Azure (without VM role)"
date: 2011-04-26T18:30:45Z
tags:
  - Azure
  - Cloud
  - Firebird
redirect_from: /id/232332/
category: none
layout: post
---
Recently I was playing with [Amazon EC2][1] trying what I could use it for. I was playing with [Firebird][2] there as well. But in fact you have virtual machine you can use. So using Firebird there wasn't that hard. But I got and idea about [Azure][3], because it's more platform for applications than computers.

Then the [VM role][4] was introduced and the challenge was somehow not so challenging. But ...

Yes, it was still in my mind. My rough idea was abuse [Firebird Embedded][5] and load it inside [Web or Worker role][6]. Only problem was where to store the database. Sure, the scaling will be compromised, but it's just "try it and see what could be done and let others (not) use it". 8-) The [CloudDrive][7] solved my problems about where to store the database.

So it was no-brainer to try it.

First some helper for CloudDrive use.

```csharp
public class CloudDriveHelper : IDisposable
{
	CloudDrive _drive;
	public string DriveLetter { get; private set; }
	public CloudDriveHelper(CloudStorageAccount storageAccount, string name, int cacheSize = 0, int driveSize = 1024)
	{
		CloudBlobClient client = storageAccount.CreateCloudBlobClient();
		CloudBlobContainer container = client.GetContainerReference("drives");
		container.CreateIfNotExist();
		string diskName = string.Format("{0}.vhd", name);
		_drive = storageAccount.CreateCloudDrive(container.GetPageBlobReference(diskName).Uri.ToString());
		try
		{
			_drive.Create(driveSize);
		}
		catch (CloudDriveException)
		{ }
		DriveLetter = _drive.Mount(cacheSize, DriveMountOptions.None);
	}
	public void Dispose()
	{
		Dispose(true);
	}
	~CloudDriveHelper()
	{
		Dispose(false);
	}
	void Dispose(bool disposing)
	{
		if (disposing)
		{
			_drive.Unmount();
			DriveLetter = null;
			_drive = null;
		}
	}
}
```

I added reference to [FirebirdSql.Data.FirebirdClient assembly][8]. I played with Firebird Embedded in package, but putting it to blob storage via CloudDrive would be easier, maybe next time. :) The environment in Azure is x64 (for Web and Worker roles, run by `WaWebHost` and `WaWorkerHost` respectively), so don't forget to use proper version. Anyway, then I abused Web role to see some results.

Simple controller action.

```csharp
public ActionResult Index()
{
	using (CloudDriveHelper drive = new CloudDriveHelper(Global.Account /* could be CloudStorageAccount.DevelopmentStorageAccount as well */, "firebird", driveSize: 1024))
	{
		string database = Path.Combine(drive.DriveLetter, "SomeDatabase.fdb");
		TestClass.CreateDatabase(database);
		ViewData["FirebirdVersion"] = TestClass.GetServerVersion(database);
		ViewData["SomeData"] = TestClass.SomeQuery(database).ToArray();
		return View();
	}
}
```

And some methods to do actual work.

```csharp
public static void CreateDatabase(string databasePath)
{
	FbConnection.CreateDatabase(CreateConnectionString(databasePath), true);
}
public static string GetServerVersion(string databasePath)
{
	using (FbConnection conn = new FbConnection(CreateConnectionString(databasePath)))
	{
		conn.Open();
		return conn.ServerVersion;
	}
}
public static IEnumerable<Tuple<string, object>> SomeQuery(string databasePath)
{
	using (FbConnection conn = new FbConnection(CreateConnectionString(databasePath)))
	{
		conn.Open();
		using (FbCommand cmd = conn.CreateCommand())
		{
			cmd.CommandText = "select * from mon$database";
			using (FbDataReader reader = cmd.ExecuteReader())
			{
				if (reader.Read())
				{
					for (int i = 0; i < reader.FieldCount; i++)
					{
						yield return Tuple.Create(reader.GetName(i), reader[i]);
					}
				}
			}
		}
	}
}
```

Well, it did worked OK. Before you think how cool is that I have some bad news. The cloud computing is mainly about scaling and elasticity. With this you have one drive and (have to have) one instance of Firebird working with it - you're not scaling. You can't scale with this solution. So it's more about being concept. However I came with two possible options, that are more realistic.

First is having one special Worker role processing some data and storing it in Firebird database (for whatever reason). The Azure machines are quite powerful and if you have everything there why to setup your own server... And I think this can be worth in some scenarios (apart not being fault tolerant etc.).

Other one builds on top of previous solution and abuses [Firebird's external tables][9]. You can load or store data via external tables to blob storage via CloudDrive and (re-)use already written logic in stored procedures (or triggers). Little crazy, I know hence I've not tried it (so maybe it's not doable). But technologies are here to use these on the edge.

As I said, the real world usage of all this isn't big, but as a exploration project it was fun. :)

[1]: http://aws.amazon.com/ec2/
[2]: http://www.firebirdsql.org
[3]: http://www.microsoft.com/windowsazure/
[4]: http://msdn.microsoft.com/en-us/gg502178
[5]: http://www.firebirdsql.org/manual/fbmetasecur-embedded.html
[6]: http://msdn.microsoft.com/en-us/library/gg432976.aspx
[7]: http://msdn.microsoft.com/en-us/library/microsoft.windowsazure.storageclient.clouddrive.aspx
[8]: http://www.firebirdsql.org/index.php?op=files&id=netprovider
[9]: http://www.firebirdsql.org/rlsnotesh/rlsnotes25.html#rnfb25-engine-exttblio
