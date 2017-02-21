---
title: |
  TcpListener and TcpClient (an easy-to-use example) - part 2
date: 2014-07-22T06:20:00Z
tags:
  - .NET
layout: post
---
Back in 2005 I wrote a blogpost [TcpListener and TcpClient (an easy-to-use example)][1]. It was really just a piece of code I wrote to quickly finish what I was doing and I put it on my blog. The code was throwaway code, but even after the years it's still visited a lot on my blog. 

Given the code was written 9 years ago, when my skills were 9 years younger and when the world around us was slightly different, different tools etc. I decided to give it a little facelift. Kind of 2014 edition.

<!-- excerpt -->

```csharp
class Program
{
	public static void Main(string[] args)
	{
		MainAsync().Wait();
	}

	static async Task MainAsync()
	{
		Console.WriteLine("Starting...");
		var server = new TcpListener(IPAddress.Parse("0.0.0.0"), 66);
		server.Start();
		Console.WriteLine("Started.");
		while (true)
		{
			var client = await server.AcceptTcpClientAsync().ConfigureAwait(false);
			var cw = new ClientWorking(client, true);
			cw.DoSomethingWithClientAsync().NoWarning();
		}
		// :)
		server.Stop();
	}
}

class ClientWorking
{
	TcpClient _client;
	bool _ownsClient;

	public ClientWorking(TcpClient client, bool ownsClient)
	{
		_client = client;
		_ownsClient = ownsClient;
	}

	public async Task DoSomethingWithClientAsync()
	{
		try
		{
			using (var stream = _client.GetStream())
			{
				using (var sr = new StreamReader(stream))
				using (var sw = new StreamWriter(stream))
				{
					await sw.WriteLineAsync("Hi. This is x2 TCP/IP easy-to-use server").ConfigureAwait(false);
					await sw.FlushAsync().ConfigureAwait(false);
					var data = default(string);
					while (!((data = await sr.ReadLineAsync().ConfigureAwait(false)).Equals("exit", StringComparison.OrdinalIgnoreCase)))
					{
						await sw.WriteLineAsync(data).ConfigureAwait(false);
						await sw.FlushAsync().ConfigureAwait(false);
					}
				}

			}
		}
		finally
		{
			if (_ownsClient && _client != null)
			{
				(_client as IDisposable).Dispose();
				_client = null;
			}
		}
	}
}

static class TaskExtensions
{
	[MethodImpl(MethodImplOptions.AggressiveInlining)]
	public static void NoWarning(this Task t) { }
}
```

It's really nothing special. I just replaced the thread with asynchronous calls. Not that it was not available in 2005. But I had no idea that creating thread is a stupid waste of resources. And programming with [APM][2] was (and still is) touch bit harder that "normal" sequential code (that's where the `async`/`await` comes handy). The rest is just some small cleanups and so on.

Maybe I'll put a task for 2023 to write an - at that time current - version.

[1]: {% post_url 2005-06-21-6188-tcplistener-and-tcpclient-an-easy-to-use-example %}
[2]: http://msdn.microsoft.com/en-us/library/ms228963(v=vs.110).aspx