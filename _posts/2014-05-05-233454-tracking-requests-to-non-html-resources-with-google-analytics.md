---
title: "Tracking requests to non-HTML resources with Google Analytics"
date: 2014-05-05T15:37:00Z
tags:
	- Google
  - Google Analytics
category: none
layout: post
---
I wanted to ditch the PAD file on [ID3 renamer's][1] website. It was maybe cool five years ago, but I don't think it's now. But I wanted at least some confidence that this file is really used sporadically. Not cutting out something in use. 

<!-- !excerpt -->

First I thought I will add some logging into the method that generates this file (yep, it's generated on request ;)) and later process the data. But that looked like unnecessary work especially because the site uses [Google Analytics][2] anyway. Only problem was how to push data to Google Analytics if the result is plain XML file and not an HTML page. 

Some API must be there, was my feeling. And indeed it is. Some googling and [Measurement Protocol Developer Guide][4] or [Measurement Protocol Parameter Reference][3] respectively was what I needed. Simple `HTTP POST` endpoint to where you push URL encoded parameters. Sweet!

I quickly made a stupidly straightforward code to do what I needed. I only used parameters looking interesting for me, to at least, if lucky, little recognize the caller. In the document above you might find a lot of other parameters (even `hit type`s).

<pre class="brush:csharp">
	static async Task&lt;bool&gt; SendPageviewRequestAsync(string trackingId, string documentLocation, string usersIpAddress, string userAgent, string documentReferrer, Guid? clientId = null)
	{
		using (var client = new HttpClient())
		{
			using (var content = CreateContent(trackingId, documentLocation, usersIpAddress, userAgent, documentReferrer, clientId))
			{
				try
				{
					using (var responseMessage = await client.PostAsync("http://www.google-analytics.com/collect", content).ConfigureAwait(false))
					{
						return responseMessage.IsSuccessStatusCode;
					}
				}
				catch
				{
					return false;
				}
			}
		}
	}

	static FormUrlEncodedContent CreateContent(string trackingId, string documentLocation, string usersIpAddress, string userAgent, string documentReferrer, Guid? clientId = null)
	{
		return new FormUrlEncodedContent(new Dictionary&lt;string, string&gt;() 
		{ 
			{ "v", "1" },
			{ "t", "pageview" },
			{ "tid", trackingId },
			{ "cid", (clientId ?? Guid.NewGuid()).ToString() },
			{ "dl", documentLocation },
			{ "uip", usersIpAddress },
			{ "au", userAgent },
			{ "dr", documentReferrer },
		});
	}
</pre>

Getting the information from HTTP request is left for you as an exercise. ;) 

Use it, change it - as you wish. 

[1]: http://www.id3renamer.com
[2]: http://www.google.com/analytics/
[3]: https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters
[4]: https://developers.google.com/analytics/devguides/collection/protocol/v1/devguide
