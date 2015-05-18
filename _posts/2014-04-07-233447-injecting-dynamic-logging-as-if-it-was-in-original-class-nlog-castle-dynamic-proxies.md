---
title: "Injecting dynamic logging as if it was in original class (NLog, Castle Dynamic Proxies)"
date: 2014-04-07T08:58:00Z
tags:
  - .NET
  - Logging &amp; Tracing
  - Aspect Oriented Programming (AOP)
redirect_from: /id/233447
category: none
layout: post
---
In my current project I have bunch of classes that are just a simple wrapper to call some of my [ASP.NET WebAPI][1] endpoints. These classes are not generated, but I have a skeleton code that I then just call from various methods. But I also wanted to add to some of these wrappers simple logging/tracing to have first a feedback that something is going on, because some methods are called at the start of application and before any real work is done and also to see how long it took to execute (I think I'll reuse this part later on different places as well). And all this to look like it's in the class itself (aka the "logger name" should be the implementation itself).

<!-- excerpt -->

Because I use [Castle Windsor][2] I pulled out from my memory Castle Dynamic Proxies. I saw it being used for similar stuff before. Quick glance into documentation and I found `IInterceptor` where you have `void Intercept(IInvocation invocation)` method you implement and the `IInvocation` argument is the "encapsulation" of method being processed. That was the first part. The other was to somehow create logger (I'm using [NLog][3]) that has the "logger name" same as the implementation itself. Basically the same as what you get if you'd call `LogManager.GetCurrentClassLogger()` inside the implemetation.

NLog has `LogManager.GetLogger` with which you can create any named logger so I only need to dig the name from `IInvocation`. Easy - `invocation.TargetType.FullName`. With that in place it was playing for a while with it and extracting some structure from it so I don't have to repeat myself.

I created `LoggingAspectBase` class where I have `void LoggingIntercept(Logger log, IInvocation invocation)` method where I get not only the `IInvocation` but also the `Logger`.

<pre class="brush:csharp">
public abstract class LoggingAspectBase : IInterceptor
{
	public void Intercept(IInvocation invocation)
	{
		LoggingIntercept(LogManager.GetLogger(invocation.TargetType.FullName), invocation);
	}

	protected abstract void LoggingIntercept(Logger log, IInvocation invocation);
}
</pre>

Then I created two _aspects_ <small>([aspect-oriented programming][4])</small> - one for logging before the invocation happens and one after. Because of my skeleton code and naming the method name was enough for me. But you can also dump out arguments etc.

<pre class="brush:csharp">
public class BeforeInvocationLoggingAspect : LoggingAspectBase
{
	protected override void LoggingIntercept(Logger log, IInvocation invocation)
	{
		log.Info("Calling [{0}].", invocation.Method.Name);
		invocation.Proceed();
	}
}
</pre>

<pre class="brush:csharp">
public class AfterInvocationLoggingAspect : LoggingAspectBase
{
	protected override void LoggingIntercept(Logger log, IInvocation invocation)
	{
		invocation.Proceed();
		log.Info("Called [{0}].", invocation.Method.Name);
	}
}
</pre>

Once you register these in your `IWindsorInstaller` you can apply these to your classes calling [`Interceptors`][5] method in your registration.

Few lines of code and the work is done.

> [Improved implementation that handles `async` methods as well.][6]

[1]: http://www.asp.net/web-api
[2]: http://docs.castleproject.org/Windsor.MainPage.ashx
[3]: http://nlog-project.org/
[4]: http://en.wikipedia.org/wiki/Aspect-oriented_programming
[5]: http://docs.castleproject.org/Windsor.Registering-Interceptors-ProxyOptions.ashx
[6]: {{ site.url }}{% post_url 2014-11-18-233489-injecting-logging-into-asynchronous-methods %}