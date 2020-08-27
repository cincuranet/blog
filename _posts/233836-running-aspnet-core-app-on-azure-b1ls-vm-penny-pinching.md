---
title: |-
  Running ASP.NET Core app on Azure B1ls VM (penny pinching)
date: 2020-08-27T05:46:00Z
tags:
  - Azure
  - .NET Core
  - Azure VMs
---
Although I usually try to avoid IaaS services as much as possible, for this side project I needed to expose Kestrel webserver directly and hence the obvious choice for hosting web app - the App Service - wasn't an option. So I went for a VM. And given it's a side project, I also wanted to run it cheaply. And why not to try to go all out with B1ls VM using Linux.

<!-- excerpt -->

#### About the VM

The B1ls using Linux is a cheapest option at the moment on Azure. Around €3-4. You get 1 vCPU, 0,5 GB of RAM and 160 IOPS/10MBps of uncached disk throughput. Not much, but at least on paper it should be capable of running ASP.NET Core app (not a huge one, obviously) without any hacking.

#### Installation

I went for a Debian distribution, only because from all the options it's what I liked the most. Instead of installing just the runtime I [installed][1] the whole SDK, since I also wanted to try compiling the app directly on the VM. The installation was smooth and in a short amount of time I was able to run `dotnet -info`

```text
.NET Core SDK (reflecting any global.json):
 Version:   3.1.401
 Commit:    39d17847db

Runtime Environment:
 OS Name:     debian
 OS Version:  10
 OS Platform: Linux
 RID:         debian.10-x64
 Base Path:   /usr/share/dotnet/sdk/3.1.401/

Host (useful for support):
  Version: 3.1.7
  Commit:  fcfdef8d6b

.NET Core SDKs installed:
  3.1.401 [/usr/share/dotnet/sdk]

.NET Core runtimes installed:
  Microsoft.AspNetCore.App 3.1.7 [/usr/share/dotnet/shared/Microsoft.AspNetCore.App]
  Microsoft.NETCore.App 3.1.7 [/usr/share/dotnet/shared/Microsoft.NETCore.App]
```

#### Compiling

Compiling a basically empty ASP.NET Core app on this machine takes a lot of time, like between 1 and 3 minutes. The reason is the nature of B-series burstable VMs and the size/IOPS of B1ls. But it's possible.

#### Running

Running the application is pretty easy too. On my machine I executed  `dotnet publish -c Release -r linux-64 --self-contained false` and copied the result onto the VM using `scp`. Set `+x` for the binary and off I go. My application is fairly small (just an ASP.NET Core (no MVC, no Razor Pages, etc.) and everything goes from memory (no disk, no database, etc.)), but I was still surprised how quickly it started (my expectation was something like Raspberry Pi 2/3/4 that I use for running .NET Core apps too). 

#### Resources usage

This is the summary snapshot from `top` command while my application is running.

```text
Tasks:  84 total,   1 running,  83 sleeping,   0 stopped,   0 zombie
%Cpu(s):  0.3 us,  0.0 sy,  0.0 ni, 99.3 id,  0.0 wa,  0.0 hi,  0.3 si,  0.0 st
MiB Mem :    397.5 total,     22.1 free,    250.9 used,    124.6 buff/cache
MiB Swap:      0.0 total,      0.0 free,      0.0 used.    131.2 avail Mem
```

#### Summary

It is absolutely possible to run an ASP.NET Core on a B1ls VM, but it needs to be a slim one. The B1s might be a better option for a "reasonable" ASP.NET Core app with still a very favorable pricing (about double the price of B1ls).

[1]: https://docs.microsoft.com/en-us/dotnet/core/install/linux-debian