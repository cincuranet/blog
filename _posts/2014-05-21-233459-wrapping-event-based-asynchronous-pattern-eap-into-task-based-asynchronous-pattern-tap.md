---
title: |
  Wrapping event-based asynchronous pattern (EAP) into task-based asynchronous pattern (TAP)
date: 2014-05-21T07:45:00Z
tags:
  - Multithreading/Parallelism/Asynchronous/Concurrency
  - .NET
  - C#
layout: post
---
After [my presentation this week on WUG][1] I got an interesting question. How to wrap [event-based asynchronous pattern (EAP)][2] into [task-based asynchronous pattern (TAP)][3]. Obviously my mind immediately picked up the [`TaskCompletetionSource<T>`][4] class as a viable solution.

<!-- excerpt -->

And indeed it's not difficult. The original question used [`ReverseGeocodeQuery`][5] class, but because I don't have Windows Phone SDK etc. installed I went to good old [`SmtpClient`][6] (just to make sure, `SmtpClient` _does_ support TAP from .NET 4.5). :) I first tried to write some generic wrapper that would work no matter what class you're using, but it turned out to be kind of not nice method to call - at least for me. Too much clutter.

Anyway here's now to wrap `SmtpClient`'s EAP into TAP.

```csharp
using (var client = new SmtpClient())
{
	var tcs = new TaskCompletionSource<object>();
	var handler = default(SendCompletedEventHandler);
	handler = new SendCompletedEventHandler((sender, eventArgs) =>
	{
		var tcsLocal = (TaskCompletionSource<object>)eventArgs.UserState;
		try
		{
			if (eventArgs.Error != null)
			{
				tcsLocal.SetException(eventArgs.Error);
				return;
			}
			if (eventArgs.Cancelled)
			{
				tcsLocal.SetCanceled();
				return;
			}
			// set result, if any
			tcsLocal.SetResult(null);
			return;
		}
		finally
		{
			client.SendCompleted -= handler;
		}
	});
	client.SendCompleted += handler;
	client.SendAsync(new MailMessage("foo@example.com", "bar@example.com", "Subject", "Body"), tcs);
	await tcs.Task;
	// ...
}
```

I'll walk through the code. First I create the `TaskCompletionSource<object>` (`object` because `SmtpClient` does not return any value and `object` minimal "object" to put something into the generic parameter) and then I create handler to "finish" the operation. If there's and error, I'll call [`SetException`][7] with appropriate exception from the property and I'm done. If not, I'll check whether the operation was cancelled and if so I'll call [`SetCanceled`][8]. If there was no error nor cancellation I'm ready to [`SetResult`][9] (in this case I simply set `null`, because I don't have anything better). And that's it. You're done.

As I said above I initially thought about creating some wrapper. I wrote one, but I don't like how it turned out. I feel kind of there's too much noise - generic parameters, factories to create some type (because there's not a common base type); and also calling isn't looking nice. Below is the code anyway. 8-) Maybe some reader will find a nicer way to wrap it into C# language.

```csharp
static Task WrapEapToTap<TObject, TEventHandler, TEventArgs, TResult>(TObject obj,
	Func<TEventArgs, TResult> resultSelector,
	Action<TObject, object> eapAction,
	Action<TObject, TEventHandler> addEventHandler,
	Action<TObject, TEventHandler> removeEventHandler,
	Func<Action<object, TEventArgs>, TEventHandler> eventHandlerFactory)
	where TEventArgs : AsyncCompletedEventArgs
{
	var tcs = new TaskCompletionSource<object>();
	var handler = default(TEventHandler);
	handler = eventHandlerFactory((sender, eventArgs) =>
	{
		var tcsLocal = (TaskCompletionSource<object>)eventArgs.UserState;
		try
		{
			if (eventArgs.Error != null)
			{
				tcsLocal.SetException(eventArgs.Error);
				return;
			}
			if (eventArgs.Cancelled)
			{
				tcsLocal.SetCanceled();
				return;
			}
			tcsLocal.SetResult(resultSelector(eventArgs));
			return;
		}
		finally
		{
			removeEventHandler(obj, handler);
		}
	});
	addEventHandler(obj, handler);
	eapAction(obj, tcs);
	return tcs.Task;
}
``` 

If you'd like to use this method to wrap the `SmtpClient` example it looks like this.

```csharp
using (var client = new SmtpClient())
{
	await WrapEapToTap<SmtpClient, SendCompletedEventHandler, AsyncCompletedEventArgs, object>(
		client,
		eventArgs => null,
		(c, o) => client.SendAsync(new MailMessage("foo@example.com", "bar@example.com", "Subject", "Body"), o),
		(c, handler) => client.SendCompleted += handler,
		(c, handler) => client.SendCompleted -= handler,
		handler => new SendCompletedEventHandler(handler));
	// ...
}
```

Anyway I believe you should first try wrapping [asynchronous programming model (APM)][10] (that's the one with `BeginXxx` and `EndXxx` methods) using `FromAsync` method. This model is kind of less hacky and closer to the metal. And any good component should have first and foremost APM and maybe EAP. 

If you're stuck with EAP, I hope the code above helps.

[1]: {% post_url 2014-05-13-233457-wug-asynchronni-a-paralelni-programovani-v-netu %}
[2]: http://msdn.microsoft.com/en-us/library/ms228969(v=vs.110).aspx
[3]: http://msdn.microsoft.com/en-us/library/hh873175(v=vs.110).aspx
[4]: http://msdn.microsoft.com/en-us/library/dd449174(v=vs.110).aspx
[5]: http://msdn.microsoft.com/en-US/library/windowsphone/develop/microsoft.phone.maps.services.reversegeocodequery%28v=vs.105%29.aspx
[6]: http://msdn.microsoft.com/en-us/library/system.net.mail.smtpclient(v=vs.110).aspx
[7]: http://msdn.microsoft.com/en-us/library/dd449189(v=vs.110).aspx
[8]: http://msdn.microsoft.com/en-us/library/dd449188(v=vs.110).aspx
[9]: http://msdn.microsoft.com/en-us/library/dd449202(v=vs.110).aspx
[10]: http://msdn.microsoft.com/en-us/library/ms228963(v=vs.110).aspx
[11]: http://msdn.microsoft.com/en-us/library/system.threading.tasks.taskfactory.fromasync(v=vs.110).aspx