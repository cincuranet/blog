---
title: "C# 6 refactoring"
date: 2016-01-08T06:24:00Z
tags:
  - C#
  - Programming in general
redirect_from: /id/233542/
category: none
layout: post
---
[Speaking last year on MS Fest][1] in Prague about C# 6 I got feedback I showed all the features in funny way and mostly in edge cases which were far from real world usage. And kind of questioning the usefulness of the features.

And I probably did. I tried to show the feature and also abuse it a little. So to show the features are actually useful in real world, here's a refactoring I did yesterday evening on a few lines of code. The code was fine. But with C# 6 it's even more fine (I think).

<!-- excerpt -->

The original version looked like this.

```csharp
catch (HttpRequestException ex)
{
	var webEx = ex.InnerException as WebException;
	if (webEx != null)
	{
		var httpWR = webEx.Response as HttpWebResponse;
		return httpWR != null
			? Tuple.Create((HttpStatusCode?)httpWR.StatusCode, (string)null)
			: Tuple.Create((HttpStatusCode?)null, (string)null);
	}
	throw;
}
```

The `catch` block is part of helper method used in tests to do some HTTP requests and get values back. While working around (and that actually started the refactoring) I was able to change it to the following code while keeping the result same (OK, the re`throw`ing is not there as it's not needed).

```csharp
catch (HttpRequestException ex) when (ex.InnerException is WebException)
{
	var response = ((WebException)ex.InnerException).Response as HttpWebResponse;
	return Tuple.Create(response?.StatusCode, (string)null);
}
```

I think this is great example. It's shorter, more "ordered", sort of, and thus more readable. What do you think?

[1]: {{ site.address }}{% post_url 2015-11-24-233536-ms-fest-2015-praha %}
