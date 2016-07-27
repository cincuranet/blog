---
title: "Running commands on Firebird in background and canceling"
date: 2010-04-03T16:30:32Z
tags:
  - .NET
  - Firebird
redirect_from: /id/231316/
layout: post
---
The soon to be released Firebird 2.5 has a new ability to cancel running command (or any operation currently being processed by server) via API (in 2.1 you can do it via monitoring tables). This is a nice feature, interesting not only for database administration tools.

I was working on supporting it for a while in [.NET provider][1], but I'm happy to say that it's done (though I may tune the boundaries based on feedback). From some initial proposal in [list][2] I picked one following the design of SqlClient, as it's a de facto standard in ADO.NET world.

So right now you can do:

```csharp
using (FbConnection conn = new FbConnection(@"database=localhost:rrr.fdb;user=sysdba;password=masterkey"))
{
	conn.Open();
	//conn.DisableCancel();
	//conn.EnableCancel();
	using (FbCommand cmd = conn.CreateCommand())
	{
		cmd.CommandText =
@"execute block
as
declare cnt int;
begin
cnt = 999999999;
while (cnt > 0) do
begin
--cnt = cnt-100;
end
end";
		IAsyncResult ar = cmd.BeginExecuteNonQuery(null, null);
		Thread.Sleep(4000);
		Console.WriteLine("Canceling");
		cmd.Cancel();
		try
		{
			object result = cmd.EndExecuteNonQuery(ar);
		}
		catch(FbException ex)
		{
			Console.WriteLine(ex.Message);
		}
```

and you'll get the result (even though the loop in fact never ends):

```text
Canceling
operation was cancelled
```

Of course, you can screw things up by i.e. starting command and then trying to do something else with connection/transaction/command (the ADO.NET providers are not thread safe by default).

Oh, BTW, if you wanna test it, download [weekly build][3]. ;)

[1]: http://firebirdsql.org/index.php?op=files&id=netprovider
[2]: http://firebirdsql.org/index.php?op=lists
[3]: http://netprovider.cincura.net/