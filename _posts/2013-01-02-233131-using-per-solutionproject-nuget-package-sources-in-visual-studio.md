---
title: "Using per solution/project NuGet package sources (in Visual Studio)"
date: 2013-01-02T10:00:47Z
tags:
  - NuGet
  - Visual Studio
redirect_from: /id/233131
category: none
layout: post
---
I was today trying to add new package source to be used. It's a private feed from our TeamCity server that serves some shared libraries. I started with adding it in the Visual Studio settings. But that didn't satisfy me. You know, I'd like to have it only for this particular project, not whole Visual Studio. And it turned out, it's pretty simple. I'm already using `nuget.config` file to put packages into custom named folder (`lib` :)).

<!-- excerpt -->

In this file you can add few elements and have another package source added.

<pre class="brush:xml">
	&lt;packageSources&gt;
		&lt;add key="FooBar package source" value="http://nuget.foobar.com/feed/" /&gt;
	&lt;/packageSources&gt;
	&lt;activePackageSource&gt;
		&lt;add key="FooBar package source" value="http://nuget.foobar.com/feed/" /&gt;
	&lt;/activePackageSource&gt;
</pre>

And it works with everything in Visual Studio. Not only in _Package Manager Console_. The VS settings contains the new feed, the _Manage NuGet Packages_ works with it too.

Sweet. Well designed, NuGet.