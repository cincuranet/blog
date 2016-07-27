---
title: "Firebird and MS Sync Framework"
date: 2008-09-14T18:25:00Z
tags:
  - Firebird
  - Sync Framework
redirect_from: /id/228291/
layout: post
---
Few days ago I was playing with Sync Framework (if you're able to read Czech, you can check my [series about it][1]). You know, all testing and exploration I was always doing with SQL Server on server side. :) But this should work with any ADO.NET "equiped" database. So why not to test Firebird?

Because can't use builder to build commands, you have to a) write it from scratch b) look at builder's result and rewrite to FB syntax. Well, I was too lazy to rewrite all commands from my example (because it was bidirectional), so dig into download only scenario, inspired on [syncguru.com][2] with example with Oracle. As a local store I used SQL Server CE, of course.

First some definitions:

```sql
create table produkty (id int not null primary key, nazev varchar(100) not null, cena int not null);
alter table produkty add update_orig_id int default 0;
alter table produkty add update_stamp timestamp default current_timestamp;
alter table produkty add insert_stamp timestamp default current_timestamp;
create table produkty_tombstones (id int not null primary key, nazev varchar(100) not null, cena int not null, update_orig_id int, update_stamp timestamp, insert_stamp timestamp);
```

<small>Sorry for Czech names, too lazy to rewrite. ;)</small>

Update and delete triggers take as a home work. :) So the "magic" method looks like this:

```csharp
SyncAgent agent = new SyncAgent();
#region source connection
DbServerSyncProvider serverSyncProvider = new DbServerSyncProvider();
agent.RemoteProvider = serverSyncProvider;
FbConnection conn = new FbConnection(_dbFB);
serverSyncProvider.Connection = conn;
#endregion
#region local place
SqlCeClientSyncProvider clientSyncProvider = new SqlCeClientSyncProvider(_dbSQLCE);
agent.LocalProvider = clientSyncProvider;
#endregion
#region what to sync
SyncTable tableProdukty = new SyncTable("produkty");
tableProdukty.CreationOption = TableCreationOption.DropExistingOrCreateNewTable;
tableProdukty.SyncDirection = SyncDirection.DownloadOnly;
agent.Configuration.SyncTables.Add(tableProdukty);
#endregion
#region commands
SyncAdapter produkty = new SyncAdapter("produkty");
FbCommand produktyInsertCmd = new FbCommand();
produktyInsertCmd.CommandType = CommandType.Text;
produktyInsertCmd.CommandText = "SELECT id, nazev, cena FROM produkty " +
                              "WHERE insert_stamp is null OR (insert_stamp > @" +
                              SyncSession.SyncLastReceivedAnchor + " " +
                              "and insert_stamp <= @" + SyncSession.SyncNewReceivedAnchor + ")";
produktyInsertCmd.Parameters.Add("@" + SyncSession.SyncLastReceivedAnchor, FbDbType.TimeStamp);
produktyInsertCmd.Parameters.Add("@" + SyncSession.SyncNewReceivedAnchor, FbDbType.TimeStamp);
produkty.SelectIncrementalInsertsCommand = produktyInsertCmd;
FbCommand produktyUpdateCmd = new FbCommand();
produktyUpdateCmd.CommandType = CommandType.Text;
produktyUpdateCmd.CommandText = "SELECT id, nazev, cena FROM produkty " +
                  "WHERE (update_stamp > @" + SyncSession.SyncLastReceivedAnchor + ") " +
                  "and (update_stamp <= @" + SyncSession.SyncNewReceivedAnchor + ") " +
                  "and (insert_stamp <= @" + SyncSession.SyncLastReceivedAnchor + ") ";
produktyUpdateCmd.Parameters.Add("@" + SyncSession.SyncLastReceivedAnchor, FbDbType.TimeStamp);
produktyUpdateCmd.Parameters.Add("@" + SyncSession.SyncNewReceivedAnchor, FbDbType.TimeStamp);
produkty.SelectIncrementalUpdatesCommand = produktyUpdateCmd;
serverSyncProvider.SyncAdapters.Add(produkty);
#endregion
#region anchors
FbCommand anchorTimestampCmd = new FbCommand();
anchorTimestampCmd.CommandType = CommandType.Text;
//anchorTimestampCmd.CommandText = "select @" + SyncSession.SyncNewReceivedAnchor + " = GETUTCDATE()";
anchorTimestampCmd.CommandText = "select current_timestamp from rdb$database";
anchorTimestampCmd.Parameters.Add(
    new FbParameter("@" + SyncSession.SyncNewReceivedAnchor, FbDbType.TimeStamp)
    {
        Direction = ParameterDirection.Output,
        Value = DateTime.Now //hack this
    });
serverSyncProvider.SelectNewAnchorCommand = anchorTimestampCmd;
anchorTimestampCmd.Connection = conn;
FbCommand clientIdCmd = new FbCommand();
clientIdCmd.CommandType = CommandType.Text;
clientIdCmd.CommandText = "select 1 from rdb$database";
clientIdCmd.Parameters.Add(
    new FbParameter("@" + SyncSession.SyncOriginatorId, FbDbType.Integer)
    {
        Direction = ParameterDirection.Output,
        Value = 1 //hack this
    });
serverSyncProvider.SelectClientIdCommand = clientIdCmd;
#endregion
#region schema
SyncSchema syncSchema = new SyncSchema();
serverSyncProvider.Schema = syncSchema;
syncSchema.Tables.Add("produkty");
syncSchema.Tables["produkty"].Columns.Add("id");
syncSchema.Tables["produkty"].Columns["id"].AllowNull = false;
syncSchema.Tables["produkty"].Columns["id"].ProviderDataType = "int";
syncSchema.Tables["produkty"].PrimaryKey = new string[] { "id" };
syncSchema.Tables["produkty"].Columns.Add("nazev");
syncSchema.Tables["produkty"].Columns["nazev"].AllowNull = false;
syncSchema.Tables["produkty"].Columns["nazev"].ProviderDataType = "varchar";
syncSchema.Tables["produkty"].Columns["nazev"].MaxLength = 100;
syncSchema.Tables["produkty"].Columns.Add("cena");
syncSchema.Tables["produkty"].Columns["cena"].AllowNull = false;
syncSchema.Tables["produkty"].Columns["cena"].ProviderDataType = "int";
#endregion
SyncStatistics stats = agent.Synchronize();
```

I have to hack command parameters for ClientId and Timestamp, because with this simple command output parameters don't work (maybe you can tweak it with execute block, anyway ClientId will be in real scenario computed by some stored procedure or something like that, so no problem).

With custom command definitions you have to also define schema, else the provider wil not be able to infer it and synchronization fails. But this is easy.

And voila. When you run it, the synchronization works nice. Nice! :) If I find some time, I'll try to rewrite builder's commands for FB and check bidirectional sync.

[1]: http://www.vyvojar.cz/Series/6-ms-sync-framework.aspx
[2]: http://www.syncguru.com/projects/SyncServicesDemoOracle.aspx