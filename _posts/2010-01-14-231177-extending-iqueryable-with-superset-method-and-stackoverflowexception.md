---
title: "Extending IQueryable with superset method and StackOverflowException"
date: 2010-01-14T11:33:18Z
tags:
  - LINQ
  - Entity Framework
redirect_from: /id/231177/
category: none
layout: post
---
Yesterday I was creating extension method for `Skip` for `IQueryable`. I needed to accept the nullable integer and if null just skip any processing. Something like this:

<pre class="brush:csharp">
static IQueryable&lt;T&gt; Skip&lt;T&gt;(this IQueryable&lt;T&gt; resource, int? count)
{
	return (count.HasValue ? resource.Skip(count.Value) : resource);
}
</pre>

I thought it will pick the int version from framework, because I'm calling it with `int` and not `int?`. And I was wrong, as my colleague uncovered moments later. How to solve it? I was not happy with method rename and I felt there's a way.

Actually the solution is pretty easy. The original `Skip` is just extension method, right? So it's in static class as static method. So I can call it with class definition as non-extension method and this this there will be no ambiguity. Voilà.

<pre class="brush:csharp">
static IQueryable&lt;T&gt; Skip&lt;T&gt;(this IQueryable&lt;T&gt; resource, int? count)
{
	return (count.HasValue ? Queryable.Skip(resource, count.Value) : resource);
}
</pre>