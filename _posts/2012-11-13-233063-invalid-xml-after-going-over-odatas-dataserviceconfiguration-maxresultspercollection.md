---
title: |
  Invalid XML after going over OData's DataServiceConfiguration.MaxResultsPerCollection
date: 2012-11-13T09:46:10Z
tags:
  - OData/Data Services (Astoria)
layout: post
---
You can configure OData service so it itself limits (hard limit) to number of items it will ever return - [DataServiceConfiguration.MaxResultsPerCollection][1]. This limit is not the same as one that gives you URI with token added where you can ask for more. This is hard limit, which, if you go over it, produces error. Sadly the error in `<m:error>` is inside invalid XML. The XML is missing closing tag.

And that's expected. :/ That means if you're parsing the XML manually using some parser that parses the whole XML completely in one batch, you're out of luck. You'll not be even able to read what happened. Solution is, of course, to read the using some "just forward reader" that parses one item at time, ignoring what's next until you ask for it.

The reason I was given when asked was that they don't want you to accidentally succeed. Good way of enforcing that, not! I can think of different way of doing that while not breaking the validity of the XML.

Anyway, if you're parsing the result on your own, be prepared to handle also invalid XML.

[1]: http://msdn.microsoft.com/en-us/library/system.data.services.dataserviceconfiguration.maxresultspercollection.aspx