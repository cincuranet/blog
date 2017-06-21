---
title: |-
  Gotcha cancelling read on the NetworkStream
date: 2017-01-15T09:3:00Z
tags:
  - Multithreading/Parallelism/Asynchronous/Concurrency
  - .NET
  - .NET Core
  - Network
---
You know the feeling when you write some awesome code and then you find the underlying code or library does not do what you expect it to do? Well, that's exactly what happened to me with the [`NetworkStream`][1].

<!-- excerpt -->

My idea, in a nutshell, was pretty simple. Open a [`Socket`][2], wrap it into `NetworkStream` and wait for data. Based on other state of the code around, occasionally cancel waiting for the data and move on, still using the same socket.

Because I was rewriting the code from around .NET 2.0 era to something up to date, I was excited I would be able to use `await` and more importantly [`ReadAsync`][3] with [`CancellationToken`][4]. That would make it so smooth and nice.

But it didn't. Something was not behaving correctly as I was testing it. Being in this business for a long time, I knew my code is obviously correct and there's a bug someplace else. Oh wait. No. The other way around.

I started digging into [`corefx` sources][5] and found [this commit][6]. As you can see it's using the "old" `BeginXxx`/`EndXxx` (aka _APM_) methods and wrapping it into tasks (aka _TAP_). That's fine. But the `CancellationToken` there is not used inside the call. Looks weird. But there's a simple explanantion, as I was reminded by [Stephen Toub][7]. The `NetworkStream` uses the underlying `Socket` and the cancellation is not supported there (yet).

Here's a small code that shows the behavior.

```csharp
class Program
{
	static readonly IPEndPoint Endpoint = new IPEndPoint(IPAddress.Loopback, 6666);

	static void Main(string[] args)
	{
		using (var cts = new CancellationTokenSource())
		{
			var server = ServerAsync();
			var client = ClientAsync(cts.Token);
			cts.CancelAfter(2000);
			client.Wait();
		}
	}

	static async Task ServerAsync()
	{
		TcpListener server = new TcpListener(Endpoint);
		server.Start();
		using (var client = await server.AcceptTcpClientAsync().ConfigureAwait(false))
		{
			using (var stream = client.GetStream())
			{
				await Task.Delay(-1).ConfigureAwait(false);
			}
		}
	}

	static async Task ClientAsync(CancellationToken cancellationToken)
	{
		using (var socket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp))
		{
			socket.Connect(Endpoint);
			using (var stream = new NetworkStream(socket, true))
			{
				Console.WriteLine("Reading");
				try
				{
					await stream.ReadAsync(new byte[4], 0, 4, cancellationToken).ConfigureAwait(false);
				}
				catch (TaskCanceledException)
				{
					Console.WriteLine("Canceled");
					return;
				}
				Console.WriteLine("Done");
			}
		}
	}
}
```

The `ClientAsync` method never reaches the _Cancelled_ (or _Done_).

All right. Time to find another solution. Because that's what developers do, right?

[1]: https://msdn.microsoft.com/en-us/library/system.net.sockets.networkstream%28v=vs.110%29.aspx
[2]: https://msdn.microsoft.com/en-us/library/system.net.sockets.socket(v=vs.110).aspx
[3]: https://msdn.microsoft.com/en-us/library/hh193669(v=vs.110).aspx
[4]: https://msdn.microsoft.com/en-us/library/system.threading.cancellationtoken(v=vs.110).aspx
[5]: https://github.com/dotnet/corefx/
[6]: https://github.com/dotnet/corefx/pull/3710/commits/1c5957c4e80a140a92a1b4d11bcc32e106cbc650#diff-def9cb2dea315c3597e12e58779f18bbR973
[7]: https://github.com/stephentoub