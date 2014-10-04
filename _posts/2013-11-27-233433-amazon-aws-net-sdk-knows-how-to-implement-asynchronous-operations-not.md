---
title: "Amazon AWS's .NET SDK knows how to implement asynchronous operations. Not!"
date: 2013-11-27T12:28:00Z
tags:
  - Best practice or not?
  - Multithreading/Parallelism/Asynchronous/Concurrency
  - Storage &amp; Backup
  - Amazon AWS
  - Cloud
category: none
layout: post
---
Recently I was working on an application of my own and as I was in it I decided to check what updates to NuGet packages are available. I like to keep up to date to avoid any huge updates and surprises. And I also noticed [AWS SDK][1] had a new version, new major version.

Little bit worried about some breaking changes, but anyway I decided to update. The application uses [AWS S3][2] heavily so new code shouldn't hurt. After solving some compilation errors as some changes were, of course, breaking, I realized I see in IntelliSense methods with `Async` suffix. Great I thought; I can get rid of some of my helpers and very likely the finally implemented asynchronous operations properly. Before, using the `BeginXxx` and `EndXxx` was wokring, but these were sometimes blocking or spinning new threads. Definitely something you don't want when trying to scale with limited resources.

<!-- excerpt -->

As I started changing the methods and removing explicit callbacks I started also small testing to see how it performs. What a (bad) surprise I saw, when the results and resource usage was not what I would expect from nice fully (given a lot of it is actual HTTP calls to AWS) asynchronous code. It was time to dive into code. :) After walking through code a little I started to see crazy stuff. Like crazy. Let's say you want to upload some file to S3, without too much hassle. There's a [`TransferUtility`][3] class and part of it is visible [here][4]. If you'll jump to [ExecuteAsync method][5], which is suspicious anyway, you find this <small>(you can click on link before to see the code directly or on image below)</small>:

[![AWS SDK ExecuteAsync]({{ site.url }}/i/thumbs/aws_sdk_executeasync.png)]({{ site.url }}/i/aws_sdk_executeasync.png)

Who the hell was implementing that? It's starting a new task (that's ultimately going to be executed somewhere, very likely [`ThreadPool`][6]) and then spinning a new [`Thread`][7] followed by immediate blocking (calling [`Join`][8]). The method being called is blocking as well, because the signature is `Func<T>`. That's like a nightmare. Creating threads, blocking, :o :/.

Given [Amazon AWS][9] is one of, let's say, top 3 players in cloud today I would expect the code to have at least "some" quality. To be honest, I was playing even for a while with the idea of implementing it properly, at least in S3 I use. But then I realized that with my limited _free_ time I would rather spend it on [ID3 renamer][10] or [FirebirdSql.Data.FirebirdClient][11] (or [NuoDb.Data.Client][12]).

And I also moved storage for this application to [Azure][13]. :) So far no nasty surprise.

[1]: http://www.nuget.org/packages/AWSSDK/
[2]: http://aws.amazon.com/s3/
[3]: http://docs.aws.amazon.com/sdkfornet1/latest/apidocs/html/T_Amazon_S3_Transfer_TransferUtility.htm
[4]: https://github.com/aws/aws-sdk-net/blob/10fef6f83449b416044573b0cf39ea3c6621edd7/AWSSDK_DotNet45/Amazon.S3/Transfer/TransferUtility.async.cs#L142
[5]: https://github.com/aws/aws-sdk-net/blob/10fef6f83449b416044573b0cf39ea3c6621edd7/AWSSDK_DotNet45/Amazon.S3/Transfer/TransferUtility.async.cs#L344
[6]: http://msdn.microsoft.com/en-us/library/system.threading.threadpool(v=vs.110).aspx
[7]: http://msdn.microsoft.com/en-us/library/system.threading.thread(v=vs.110).aspx
[8]: http://msdn.microsoft.com/en-us/library/system.threading.thread.join(v=vs.110).aspx
[9]: http://aws.amazon.com/
[10]: http://www.id3renamer.com
[11]: https://github.com/cincuranet/NETProvider
[12]: https://github.com/nuodb/nuodb-dotnet
[13]: http://www.windowsazure.com/