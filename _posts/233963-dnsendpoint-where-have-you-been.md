---
title: |-
  DnsEndPoint - where have you been?
date: 2026-03-11T12:36:00Z
tags:
  - C#
  - .NET
  - Networking
---
I was today years old when I discovered `DnsEndPoint`. How is it possible that I never came across it in over two decades of working with .NET?

<!-- excerpt -->

Well, to be precise, it didn't actually happen today. It was about four weeks ago when my colleague [Miha Zupan][1] pointed it out for me.

For as long as I can remember, any time I worked with `Socket` and I saw [`EndPoint`][4], I would immediately reach for [`IPEndPoint`][5]. I'm not even sure why - maybe because of [`UdpClient`][2], [`TcpListener`][3], or similar I'd used for years. Whenever I designed an API that needed to work with hostnames (as well as IPs), I always performed DNS resolution manually, created an `IPEndPoint`, and passed that along.

What a pleasant surprise `DnsEndPoint` turned out to be. Not only could it have saved me from the writing ad-hoc DNS resolution code multiple times, but it also avoids the weird assortment of overloads for hostnames, IPs, and ports. Now I can simply depend on `EndPoint` and be done with it - plus maybe provide a few convenience methods for creating `DnsEndPoint` or `IPEndPoint` with default ports, etc. The rest is handled by `System.Net`.

It still amazes me that it took more than 20 years for me to stumble upon `DnsEndPoint`. But hey - better late than never.

[1]: https://github.com/MihaZupan
[2]: https://learn.microsoft.com/en-us/dotnet/api/system.net.sockets.udpclient
[3]: https://learn.microsoft.com/en-us/dotnet/api/system.net.sockets.tcplistener
[4]: https://learn.microsoft.com/en-us/dotnet/api/system.net.endpoint
[5]: https://learn.microsoft.com/en-us/dotnet/api/system.net.ipendpoint
[6]: https://learn.microsoft.com/en-us/dotnet/api/system.net.dnsendpoint