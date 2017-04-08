---
title: |-
  How to download bunch of URLs efficiently (asynchronously)? 
date: 2017-03-13T06:19:00Z
tags:
  - C#
  - .NET
  - Multithreading/Parallelism/Asynchronous/Concurrency
layout: post
---
I'm getting such question fairly often when [teaching my "parallel/async/threading" course][3]. It's always about a collection of URLs and downloading these efficiently. Everybody needs that. 

Of course _efficiently_ means different thing in different scenarios. In the following text I'm considering efficient as "in parallel" and "with intelligent use of resources used for the IO" (except memory used for storing the results as I'm going to return the result as a whole). Also I'm focusing on straightforward, readable code (not every byte or millisecond saved). Your needs may vary.

<!-- excerpt -->

#### Introduction

Let's talk about resources. Obviously the whole action is going to be asynchronous. I mean real asynchronous IO. Why? Well, because it's an IO operation. And asynchronous IO operations are using machine resources more intelligently. There's no blocking of threads or creating (or injecting in case of [`ThreadPool`][1]) new ones. As threads are expensive. Similar to that I also don't want to start downloading all at once. There's no point in starting hundreds of requests and then waiting for the choking network to process it (unless you sit on a huge pipe, of course). Simple as that.

#### Code

```csharp
public static async Task<ICollection<(string url, byte[] data)>> DownloadUrlsAsync(IEnumerable<string> urls, int limit)
{
	using (var client = new HttpClient())
	{
		using (var semaphore = new SemaphoreSlim(limit, limit))
		{
			var tasks = urls.Select(url => DownloadUrlHelperAsync(url, semaphore, client)).ToArray();
			await Task.WhenAll(tasks).ConfigureAwait(false);
			return tasks.Select(x => x.Result).ToArray();
		}
	}
}

static async Task<(string url, byte[] data)> DownloadUrlHelperAsync(string url, SemaphoreSlim semaphore, HttpClient client)
{
	await semaphore.WaitAsync().ConfigureAwait(false);
	try
	{
		using (var response = await client.GetAsync(url).ConfigureAwait(false))
		{
			if (!response.IsSuccessStatusCode)
				return (url, null);
			var data = await response.Content.ReadAsByteArrayAsync().ConfigureAwait(false);
			return (url, data);
		}
	}
	finally
	{
		semaphore.Release();
	}
}
```

The `DownloadUrlsAsync` does the initial plumbing and then it starts all the downloading using `DownloadUrlHelperAsync` method. The [`SemaphoreSlim`][2] helps me keep the number of requests in check thanks to the [`WaitAsync` method][5] (not [`Wait`][6]). I'm using the `HttpClient`, but the `WebRequest` would do the job as well (as well as classic `BeginXxx` and `EndXxx` methods - it's the same structure underneath). Nowhere I'm blocking or wrapping the blocking operation in `Task.Run` or similarly crazy stuff. All this gives me the result within the requirements I set above.


#### Tweaking

* You might want to raise the [`ServicePointManager`'s `DefaultConnectionLimit`][4].
* The `DownloadUrlsAsync` method returns the result as a whole. For big data or streamed processing it might be better to process data on the fly as it's coming.
* For extra big collections of URLs you might not start all at once, because the TPL needs to manage these tasks and most of these would be waiting anyway because of the limiting.  

#### Summary 

The code above is not the only way to archive the same result. It's just one, fairly straightforward, option - a demonstration how to do it and where to start. Although you can use it as is, it's good to understand the whys (feel free to ask in comments) and start building with this as an inspiration.   

[1]: https://msdn.microsoft.com/en-us/library/system.threading.threadpool%28v=vs.110%29.aspx
[2]: https://msdn.microsoft.com/en-us/library/system.threading.semaphoreslim%28v=vs.110%29.aspx 
[3]: /about/
[4]: https://msdn.microsoft.com/en-us/library/system.net.servicepointmanager.defaultconnectionlimit%28v=vs.110%29.aspx
[5]: https://msdn.microsoft.com/en-us/library/system.threading.semaphoreslim.waitasync(v=vs.110).aspx
[6]: https://msdn.microsoft.com/en-us/library/system.threading.semaphoreslim.wait(v=vs.110).aspx