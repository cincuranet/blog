---
title: |
  Injecting logging into asynchronous methods
date: 2014-11-18T07:47:00Z
tags:
  - .NET
  - Logging &amp; Tracing
  - Aspect Oriented Programming (AOP)
layout: post
---
In [Injecting dynamic logging as if it was in original class (NLog, Castle Dynamic Proxies)][1] I created simple helpers for logging to be injected into proxy classes used as actual implementation. This "aspects" work great until you start using `async` methods.

<!-- excerpt -->

The `async` methods is stopped and resumed as the asynchronous action run when using `await` and hence the "after" logging does not executes really after, but when the first `await` is hit.

To make it work I changed the implementation a bit.

```csharp
public class AfterInvocationLoggingAspect : LoggingAspectBase
{
	protected override void LoggingIntercept(Logger log, IInvocation invocation)
	{
		invocation.Proceed();
		var returnType = invocation.Method.ReturnType;
		if (IsAsyncMethod(invocation.Method) && typeof(Task).IsAssignableFrom(returnType))
		{
			invocation.ReturnValue = InterceptAsync((dynamic)invocation.ReturnValue, log, invocation);
		}
		else
		{
			LogCalled(log, invocation);
		}
	}

	static async Task InterceptAsync(Task task, Logger log, IInvocation invocation)
	{
		await task.ConfigureAwait(false);
		LogCalled(log, invocation);
	}
	static async Task<T> InterceptAsync<T>(Task<T> task, Logger log, IInvocation invocation)
	{
		var result = await task.ConfigureAwait(false);
		LogCalled(log, invocation);
		return result;
	}

	static void LogCalled(Logger log, IInvocation invocation)
	{
		log.Info("Called [{0}].", invocation.Method.Name);
	}

	static bool IsAsyncMethod(MethodInfo methodInfo)
	{
		return methodInfo.GetCustomAttribute<AsyncStateMachineAttribute>() != null;
	}
}
```

I first need to decide whether the method being intercepted is `async`. There's no definitive way I'm aware of. But I take lucky guess on two facts. The method returns [`Task`][2] (or derived) type and has [`AsyncStateMachineAttribute` attribute][3]. Unless somebody fiddles with the resulting IL in a wierd way this will work on 99% cases.

Then I have two implementations of `InterceptAsync`. One for `Task` and one for `Task<T>`. I use these to construct new tasks to assign new `ReturnValue` where the logging is included. I used `await` keyword to let the compiler do the dirty work, but using [`ContinueWith`][4] would work as well (i.e. in case you cannot use C# 5/.NET 4.5).

It's really simple at the end. It just took a few tries (and errors) to figure out how to properly replace `ReturnValue` to not break `await`'s infrastructure.

[1]: {% post_url 2014-04-07-233447-injecting-dynamic-logging-as-if-it-was-in-original-class-nlog-castle-dynamic-proxies %}
[2]: http://msdn.microsoft.com/en-us/library/system.threading.tasks.task(v=vs.110).aspx
[3]: http://msdn.microsoft.com/en-us/library/system.runtime.compilerservices.asyncstatemachineattribute(v=vs.110).aspx
[4]: http://msdn.microsoft.com/en-us/library/system.threading.tasks.task.continuewith(v=vs.110).aspx