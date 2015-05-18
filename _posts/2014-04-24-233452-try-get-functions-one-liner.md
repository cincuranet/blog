---
title: "Try-Get functions one-liner"
date: 2014-04-24T12:38:00Z
tags:
  - .NET
  - C#
redirect_from: /id/233452/
category: none
layout: post
---
You know these Try-Get methods that return `bool` when the action was succesful and then in `out` parameter you have the actual result, right? Like [`IDictionary<TKey, TValue>.TryGetValue`][1]. I hate these. You have to declare the `out` variable (I know C# 6 will simplify this), then have the `if`. Just too much noise. Today I had enough and I decided to solve it. In code. For me.

<!-- excerpt -->

I knew I wanted something on "one line", without all the noise around. Also in case the Try-Get returns `false` I need to have some reasonable default value, preferably configurable. After maybe an hour of some prototyping I came with a solution that's pleasing for _my_ eye and meets my quality ;) standards.

First I needed to somehow capture the Try-Get method, which has `out` parameter. That's not going to work directly with [`Func<T>`][2]. Time for custom delegate. Ahh. Haven't written these for months.

<pre class="brush:csharp">
public delegate bool TryGetFunc&lt;TKey, TResult&gt;(TKey key, out TResult result);
</pre>

Then I was playing with different shapes how to pass the Try-Get into my extension method. Obviously this is my personal preference and you might want to tweak it a little. The method itself is simple. It just does what you're doing manually - declare the `out`, `if`, return result or some default value depending on the `if`.

<pre class="brush:csharp">
public static TResult TryGet&lt;T, TKey, TResult&gt;(this T @object, Func&lt;T, TryGetFunc&lt;TKey, TResult&gt;&gt; tryGet, TKey key, Func&lt;TResult&gt; defaultValue = null)
{
	var result = default(TResult);
	return tryGet(@object)(key, out result)
		? result
		: defaultValue != null ? defaultValue() : default(TResult);
}
</pre>

You can then call it for example on a dictionary:

<pre class="brush:csharp">
dictionary.TryGet(x =&gt; x.TryGetValue, key, () =&gt; "FooBar");
</pre>

Which roughly corresponds to:

<pre class="brush:csharp">
var result = default(string);
return dictionary.TryGetValue(key, out result)
	? result
	: "FooBar";
</pre>

I know doesn't look like that much simplification. But if you're deep in some expression, one simple call makes you code flow much nicer (instead of "polluting" ;) it with variable etc.). Maybe I'll write similar helper for static methods like [`int.TryParse`][3].

[1]: http://msdn.microsoft.com/en-us/library/bb299639(v=vs.110).aspx
[2]: http://msdn.microsoft.com/en-us/library/bb534960(v=vs.110).aspx
[3]: http://msdn.microsoft.com/en-us/library/f02979c7(v=vs.110).aspx