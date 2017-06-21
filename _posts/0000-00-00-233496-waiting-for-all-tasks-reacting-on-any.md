---
title: |-
  Waiting for all tasks, reacting on any
date: 2015-01-26T07:06:00Z
tags:
  - Multithreading/Parallelism/Asynchronous/Concurrency
---
About a week ago I needed to wait on all tasks to complete and also do some side processing as any completes. Sure I could wrap it using [`ContinueWith`][2] or something like that, but I made it from other way around. 

I called my method `WhenAllOnAny` for lack of better ideas. The method ended up pretty straightforward. I'm doing [`WhenAny`][1] as long as there's at least one task still running. When one completes I fire the event.
 
<!-- excerpt -->
 
```csharp
public static async Task WhenAllOnAny(Task[] tasks, Action<Task> onAny)
{
	while (tasks.Length > 0)
	{
		var task = await Task.WhenAny(tasks).ConfigureAwait(false);
		tasks = tasks.Where(t => t != task).ToArray();
		onAny(task);
	}
}
```

It looked like a good mental training initially, but at the end it's pretty boring. Disappointed.

[1]: https://msdn.microsoft.com/en-us/library/system.threading.tasks.task.whenany%28v=vs.110%29.aspx
[2]: https://msdn.microsoft.com/en-us/library/system.threading.tasks.task.continuewith(v=vs.110).aspx