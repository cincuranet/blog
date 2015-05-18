---
title: "HttpClient streaming upload"
date: 2015-01-15T10:34:00Z
tags:
  - .NET
  - Performance
  - Network
redirect_from: /id/233493
category: none
layout: post
---
The requirement seemed simple. Get a stream of data and _upload_ it using HTTP to server. The stream might be possibly large so complete buffering is is not an option. Nothing special. 

But I was banging my head for last day (actually two times half of the day) solving it. The problem was I had to (and wanted to) use [`HttpClient`][1] because that was what I was using in the rest of the code I have for talking to my API. And `HttpClient` was fighting a little.

<!-- excerpt -->

I knew the [`HttpWebRequest`][2] can do that. You just need to set [`AllowWriteStreamBuffering`][3] and start writing to the stream. Although `HttpClient` uses `HttpWebRequest` underneath you can't fiddle with it. After some failures to conquer `HttpClient` I pulled out big guns aka source code. Jumping here and there I discovered `PrepareAndStartContentUpload` method. To avoid buffering I needed to know `ContentLength` (which I didn't, because the stream was really streamed to me) or set [`TransferEncodingChunked`][4]. Did that. Compiled. Tested. Runs fine.

It makes sense, you just need to know. :) Hope it helps somebody to get to the finish quicker.           

[1]: http://msdn.microsoft.com/en-us/library/system.net.http.httpclient%28v=vs.118%29.aspx
[2]: http://msdn.microsoft.com/en-us/library/System.Net.HttpWebRequest(v=vs.110).aspx
[3]: http://msdn.microsoft.com/en-us/library/system.net.httpwebrequest.allowwritestreambuffering(v=vs.110).aspx
[4]: http://msdn.microsoft.com/en-us/library/system.net.http.headers.httprequestheaders%28v=vs.118%29.aspx