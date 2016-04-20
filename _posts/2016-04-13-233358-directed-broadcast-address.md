---
title: "Directed broadcast address"
date: 2016-04-13T08:10:00Z
tags:
  - C#
  - .NET
  - Network
  - IoT
  - ESP-8266
  - Arduino
redirect_from: /id/233558/
category: none
layout: post
---
Although I can make it out of the TCP/IP woods almost always, sometimes I find edge cases that are interesting. More often than not these are result of security hacks in last 20 or so years and my knowledge is based on "regular/happy" case. 

<!-- excerpt -->

I needed to send some UDP messages from few devices (ESP-8266 included) to the network. As everybody knows the universal broadcast address is `255.255.255.255`. But I didn't wanted to broadcast "everywhere" (and it might not always work well - depending on router or [this][1]). I needed only "current" network (I know that's vague) broadcast.

Although I can use `x.x.x.255` that assumes only `/24` networks. Better to really compute it from the mask. On ESP-8266 that was easy.

```cpp
~WiFi.subnetMask() | WiFi.gatewayIP()
```

Then I went to do the same in C#. How hard can it be, right? 8-) I have to say there's bit more options to select from in .NET and regular operating system. Eventually I ended up with this code.

```csharp
var data = NetworkInterface.GetAllNetworkInterfaces()
	.Where(x => x.OperationalStatus == OperationalStatus.Up)
	.Where(x => x.NetworkInterfaceType != NetworkInterfaceType.Loopback)
	.Where(x => x.NetworkInterfaceType != NetworkInterfaceType.Tunnel)
	.Select(x => new
	{
		Gateway = x.GetIPProperties().GatewayAddresses.Where(y => y.Address.AddressFamily == AddressFamily.InterNetwork).FirstOrDefault()?.Address,
		Mask = x.GetIPProperties().UnicastAddresses.Where(y => y.Address.AddressFamily == AddressFamily.InterNetwork).FirstOrDefault()?.IPv4Mask,
	})
	.Where(x => x.Gateway != null && x.Mask != null)
	.FirstOrDefault();
if (data == null)
	return null;
var maskBytes = data.Mask.GetAddressBytes();
var gatewayBytes = data.Gateway.GetAddressBytes();
var broadcastBytes = new byte[4];
for (int i = 0; i < 4; i++)
{
	broadcastBytes[i] = (byte)(~maskBytes[i] | gatewayBytes[i]);
}
return new IPAddress(broadcastBytes);
```

The magic is mostly to get the gateway's IP and mask. Uff, not a nice code. At one point I event thought about going WMI path. :) Not sure the code would be nicer.

Use it as you wish, but be sure you know why the code is doing what it is doing and that it fits your environment.

[1]: https://github.com/dechamps/WinIPBroadcast
