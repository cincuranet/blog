---
title: |-
  Creating Firebird database programatically (C#/.NET)
date: 2006-04-20T13:51:00Z
tags:
  - .NET
  - Firebird
---
Well, after [Creating Firebird database programatically (Delphi)][1] post I'm bringing the example "How to create FB database programatically from .NET?".

The solution is easy too. :) You can just use (and also extend) this simple function. It uses the Firebird ADO.NET Data Provider.

```csharp
static void CreateFBDatabase(string host, string fileName, string user, string password, int pageSize, bool forcedWrites, bool overwrite)
{
	FbConnectionStringBuilder csb = new FbConnectionStringBuilder();
	csb.Database = fileName;
	csb.DataSource = host;
	csb.UserID = user;
	csb.Password = password;
	FbConnection.CreateDatabase(csb.ConnectionString, pageSize, forcedWrites, overwrite);
}
```

[1]: {% include post_link id="7953" %}