---
title: "Windows Defender updates automatically from Windows Update"
date: 2013-11-09T10:28:00Z
tags:
  - C#
  - .NET
  - Windows Update
redirect_from: /id/233428/
category: none
layout: post
---
Some time during last week I came across [this tweet][1] from [Peter Ritchie][2].

> Better granularity with @WindowsUpdate would be great, e.g. to be able to say auto install Defender Definition updates while choose others  
— Peter Ritchie (@peterritchie) [November 2, 2013](https://twitter.com/peterritchie/statuses/396693697577775106)

I had and have exactly same feeling.

<!-- excerpt -->

Sometimes I need to install the "Defender update" few times a week as it pops-up in updates. But frankly I don't care about this update. Just go ahead and install it. But I do care about other updates. I'm a control freak. And also because I'm a developer. My machine contains a lot of weird software that may go nosedown after some update. So I want to know what's going to happen with my machine with other updates. But you cannot say install this "type" of updates and ask for others.

I know. Majority of users are simply going to do either "keep my PC updated" or "do not touch anything" (seen a lot on kiosks and similar machines). Thus this is probably not going be implemented in Windows. But I'm a developer. That should be scriptable. Or some API should be there. Right?

After some quick search I found the API. And created a simple C# application that you can run once a day of after log in or ... It checks for all updates, filters only "Defender updates" (though using lame string compare, so it might brake if the name changes), downloads and installs these. With some simple logging and exit statuses.

<pre class="brush:csharp">
static int Main(string[] args)
{
	var session = new UpdateSession();
	var searcher = session.CreateUpdateSearcher();
	Log("Searching...");
	var searchResult = searcher.Search("IsInstalled=0 And IsHidden=0");
	var defenderUpdates = searchResult.Updates.Cast&lt;IUpdate&gt;()
		.Where(u =&gt; u.Title.IndexOf("Definition Update for Windows Defender", StringComparison.Ordinal) &gt;= 0)
		.ToArray();
	if (defenderUpdates.Any())
	{
		Log("Going to install:");
		var updates = new UpdateCollection();
		foreach (var item in defenderUpdates)
		{
			updates.Add(item);
			Log("\t" + item.Title);
		}

		var downloader = session.CreateUpdateDownloader();
		downloader.Updates = updates;
		Log("Downloading...");
		var downloadResult = downloader.Download();
		Log("Result: {0} [0x{1}]", downloadResult.ResultCode, downloadResult.HResult.ToString("X"));
		if (downloadResult.ResultCode != OperationResultCode.orcSucceeded)
			return -1 * (int)downloadResult.ResultCode;

		var updater = session.CreateUpdateInstaller();
		updater.Updates = updates;
		Log("Installing...");
		var updateResult = updater.Install();
		Log("Result: {0} [0x{1}]", updateResult.ResultCode, updateResult.HResult.ToString("X"));
		if (updateResult.ResultCode != OperationResultCode.orcSucceeded)
			return -1 * (int)updateResult.ResultCode;

		return 0;
	}
	else
	{
		Log("Nothing to install.");
		return 0;
	}
}

static void Log(string message)
{
	Console.WriteLine(message);
	var fileMessage = string.Format("{0}|{1}", DateTimeOffset.Now.ToString(), message);
	File.AppendAllLines(Path.Combine(Path.GetDirectoryName(Assembly.GetEntryAssembly().Location), "log.log"), new[] { fileMessage });
}
static void Log(string format, params object[] args)
{
	Log(string.Format(format, args));
}
</pre>

Of course, it needs to run with `Administrator` privileges so the [`app.manifest`][3] is added to the project. You can find [complete code on my GitHub][4]. Feel free to contribute.

[1]: https://twitter.com/peterritchie/status/396693697577775106
[2]: https://twitter.com/peterritchie
[3]: https://github.com/cincuranet/WindowsDefenderWUAutomatic/blob/master/src/WindowsDefenderWUAutomatic/app.manifest
[4]: https://github.com/cincuranet/WindowsDefenderWUAutomatic