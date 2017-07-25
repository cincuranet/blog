---
title: |-
  Replacing assembly while the application is running (aka AppDomains are slow)
date: 2017-07-25T06:43:00Z
tags:
  - C#
  - .NET
---
As I said in [previous post][1] I had to drop [_AppDomains_][2] from my solution to allow replacing assembly while the _FbNetExternalEngine_ is running. Calls across _AppDomains_ are simply too slow (read: I can't make it fast enough. ;-)) for this kind of project. Why I even needed _AppDomains_? The specs are simple: Allow assembly replacing (rewrite) while it's loaded in [Firebird][3] via my _FbNetExternalEngine_. Can it be solved without _AppDomains_?

<!-- excerpt -->

Well, hardly. The only way to unload assembly is to unload the application domain. And the only way to unload application domain is to create new one in the first place (the first - default - application domain cannot be unloaded). If you're wondering why you can't just unload assembly, given you can load it, I recommend [this classic article][4].

So I need application domain, right? But these are slow. Isn't this the deal breaker? Not in my case. Some outside the box thinking is required, though. What I really need is fast execution and option to load new assembly. See that? I _really_ don't need unload the assembly. I just need to work with latest version. And of course I need to load the assembly in such a way to not lock the file on the disk. Let's tackle one by one.

#### Not locking the file on the disk

This is fairly easy, because `Assembly.Load` has an overload to [load from byte array][5]. This way I'll load the myself into byte array and then use `Assembly.Load`. Of course it's not all rainbows and unicorns. For example, the [`Assembly.Location`][6] will be `null`. Care must be taken for loading dependencies. And I'll probably hit some more. But I'm confident I'll be able to push through.

#### Loading the new assembly and using it

What might come as a surprise is the fact, that you can load the "same" assembly multiple times. I put the word same into quotes, because it's not the same assembly, it's the new version (but some types will exist multiple times). I can't unload the assembly (see above for reasons), but that's what it is. That means if you will be replacing the assembly madly without ever restarting Firebird server, you'll run out (probably) of memory at some point. On the other had if the replacing is never or very sporadically going to happen it's not an issue. Win? I hope so.

Once the assembly is loaded only one final step is remaining. Because I use reflection extensively to execute the appropriate method, I need to start on correct `Assembly` instance. Everything starts with a class (or type to be precise), thus I need to work on correct (latest) assembly using [`Assembly.GetType`][7]. I'm having a hash table of these in use anyway, so it's not a difficult task. After this it is a regular reflection work.

#### Summary

When I first saw the numbers for cross _AppDomains_ calls I was scared. I had no idea how I would speed that up... Luckily my brain had a good day and I came with different solution which is fast enough (for today) and does feel reasonably solid (although I'm sure some corner cases will pop up, what you can do, #developerslife ;-)). 

Although it's not the same as pure unloading and loading again, I think it's a perfectly viable solution for a lot of cases where the "assembly refresh" is required. Hope it helps somebody fishing in similar waters.   

[1]: {% include post_link, id: "233636" %}
[2]: https://docs.microsoft.com/en-us/dotnet/framework/app-domains/application-domains
[3]: https://www.firebirdsql.org/
[4]: https://blogs.msdn.microsoft.com/jasonz/2004/05/31/why-isnt-there-an-assembly-unload-method/
[5]: https://msdn.microsoft.com/en-us/library/h538bck7(v=vs.110).aspx
[6]: https://msdn.microsoft.com/en-us/library/system.reflection.assembly.location(v=vs.110).aspx
[7]: https://msdn.microsoft.com/en-us/library/0xst247w(v=vs.110).aspx