---
title: "Windows 8/8.1 background API mismatch"
date: 2013-09-16T16:35:00Z
tags:
  - Windows
  - .NET
  - WinRT
category: none
layout: post
---
While digging into some background stuff in WinRT I found some mismatch in API. It's not something that's completely different. Both APIs deal with some background operations, both having same prefix "Background" (although in different namespace). Have a look yourself.

<!-- excerpt -->

The first background operations is dealing with uploads and downloads. When you want to list all (in this case) background operations, you can call [`BackgroundDownloader.GetCurrentDownloadsAsync()`][1]. This method returns `IAsyncOperation&lt;IReadOnlyList&gt;`. Aka it's asynchronous and it's a method.

The other one is dealing with background tasks. And when you want to all background tasks, you can call [`BackgroundTaskRegistration.AllTasks`][2]. This method returns simple `IReadOnlyDictionary&lt;Guid, IBackgroundTaskRegistration&gt;`. Aka it's synchronous and it's a property.

Maybe I'm too pesky. But these are not that different from developer's point of view, isn't it? Why is then one method and other property? And why there's a mismatch between synchronous call and asynchronous call (though I _can_ imagine one is reading just some application's related piece of memory while the other one is doing some call though system to some "background transfer service", but still ...)?

[1]: http://msdn.microsoft.com/en-US/library/windows/apps/br207128
[2]: http://msdn.microsoft.com/en-us/library/windows/apps/windows.applicationmodel.background.backgroundtaskregistration.alltasks.aspx