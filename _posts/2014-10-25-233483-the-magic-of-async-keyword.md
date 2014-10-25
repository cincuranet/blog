---
title: "The magic of \"async\" keyword"
date: 2014-10-25T08:26:00Z
tags:
  - C#
category: none
layout: post
---
In last couple of weeks I was again confronted number of times with something "asynchronous". In this post I don't really don't want to argue about CPU-bound and IO-bound operations with respect to "asynchronous" word. What I'll talk about is the `async` keyword. Because it looks like there's still confusion.

<!-- excerpt -->

Short story. The [`async` keyword][1] does nothing with your code (related to asynchronicity). That's it. I said it.

Long story. The `async` keyword is there only to help compatibility and compiler. When you're writing something like the compiler you're not only thinking about backward compatibility (that's a must), you're also thinking about forward compatibility (as much as possible). And that's exactly it. If you compile your old code with the new compiler you'd like to - very likely - to have the same behavior of code (maybe bit faster ;)).

But because C# 5 added the new [`await` keyword][2] it might collide with your previous code. Looks like theory? Let me show you some code.

<pre class="brush:csharp">
static Task&lt;int&gt; Test()
{
	return await (Task.FromResult(6));
}

static Task&lt;int&gt; await(Task t)
{
	Console.WriteLine("No async, huh? ;)");
	return Task.FromResult(-1);
}
</pre>

This is perfectly valid C# 4 code, isn't it? Yes, naming the method `await` does not match generally used formatting, but who cares? 

Now imagine C# 5 with just `await` keyword. Compiling this code would result in different behavior. Either the compiler could complain about collision on `await` method or silently compile it one ot the other way. Not good. You'd have to change your code to reach the behavior you wanted (or use some crazy switches). But if you actually try to compile this code using C# 5 it works fine.

Once you add the `async` keyword it changes.

<pre class="brush:csharp">
static async Task&lt;int&gt; Test()
{
	return await (Task.FromResult(6));
}
</pre>

See the change? The `async` keyword. Now _you_ actually changed the code and you are aware of behavior change (or you should be).

So what the `async` actually did? It just tells the compiler: "If you see `await` consider it keyword.". And because _you_ did the change, you're changing the code and so the forward compatibility is not broken.

No magic. Sorry.   

[1]: http://msdn.microsoft.com/en-us/library/hh156513.aspx
[2]: http://msdn.microsoft.com/en-us/library/hh156528.aspx