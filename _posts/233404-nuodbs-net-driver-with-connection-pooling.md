---
title: |-
  NuoDB's .NET driver with connection pooling
date: 2013-08-24T06:52:51Z
tags:
  - .NET
  - Databases in general
  - NewSQL
  - NoSQL
  - NuoDB
---
Today I'd like to talk about connection pooling. Something that's well known for a lot of people in (not only) ADO.NET world.

<!-- excerpt -->

What it is? Let me tell you whole story. Opening and closing connection is not easy. In fact it might take a lot of time. There are a few steps involved. You need to resolve the hostname to IP, open the connection physically, the server needs to validate your credentials, you need to then close the first connection to broker and connect to agent and so on, just to name a few. That's a lot of work. Especially if you open and close connections for short isolated actions over and over again. Connection pooling is here to save you. At least in the new version of the driver. The idea behind is pretty simple. Instead of closing the connection when you say that, the connection is left open and placed into the "pool". Then later when you ask for new connection and open it, instead of doing all the work I mentioned above, the connection is taken from pool, ready to serve your needs. Of course you might be screaming about the resources wasted by keeping the connection open all the time. You can specify in connection string how long you'd like to keep the connection in pool before it's really closed and freed. So it's a tradeoff – between speed of opening a connection and resources wasted. But because in most applications the data access occurs in bursts and shortly around some events this approach works really well.

Excited? Here's how to make it work. Because the turned on connection pooling is often a benefit, it's turned on by default. But you can specify otherwise putting `Pooling=False` into your connection string. The connection lifetime is specified in seconds. And it's controlled by "ConnectionLifetime" property in connection string. In time of writing it's 10 seconds by default, which should be good starting point in most cases.

The pool itself is global. That means no matter where you open or close the connection in your application it's still handled by the same pool. You can even open connections to different databases (different connection strings) and it will work just fine. But take a note that the connection string as-is is used as a key to distinguish different connections – hence if you open first connection with connection string `Database=hockey;Server=localhost;User=domain;Password=bird;Pooling=True`, then close it and later open connection with connection string `Server=localhost;Database=hockey;User=domain;Password=bird;Pooling=True` you'll not get the second connection from pool, but you'll open new one, because – though the meaning of the connection string is same – the connection string differs. I believe this is not an issue because the connection string is in most cases read from app.config or web.config and thus always in the same shape.

Although the theory says is should be faster it doesn't mean it really is. I'm a developer, I need numbers. I created a simple test code, it tries to execute one command 20 times, something that an average action in application might fire and does that six times, just to get a nice average. Here's the code:

```csharp
class Program
{
	const string ConnectionString = "Server=192.168.195.128;Database=test;User=t;Password=t;Pooling=True";

	static void Main(string[] args)
	{
		Console.WriteLine(TimeSpan.FromMilliseconds(Test().Average(x => x.TotalMilliseconds)));
	}

	static IEnumerable<TimeSpan> Test()
	{
		for (int i = 0; i < 6; i++)
		{
			var stopwatch = Stopwatch.StartNew();
			for (int j = 0; j < 20; j++)
			{
				using (var connection = new NuoDbConnection(ConnectionString))
				{
					connection.Open();
					using (var tx = connection.BeginTransaction(IsolationLevel.ReadCommitted))
					{
						using (var cmd = connection.CreateCommand())
						{
							cmd.Transaction = tx;
							cmd.CommandText = "select count(*) from system.tables";
							var count = cmd.ExecuteScalar();
						}
						tx.Commit();
					}
				}
			}
			yield return stopwatch.Elapsed;
		}
	}
}
```

Of course your mileage may and will vary. But on my machines and in my network it took 8.54s with connection pooling and 17.21s without connection pooling on average. That's around half of the time with connection pooling turned on! Good, isn't it?

If you're eager to try it, you can now grab the latest release of driver.

> Written for [NuoDB's Techblog][1].

[1]: http://dev.nuodb.com/techblog/connection-pooling-net-and-nuodb