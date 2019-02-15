---
title: |-
  How many keywords I can fit into a single C# expression?
date: 2019-02-06T14:31:00Z
tags:
  - C#
---
As I was playing few days ago with ["`yield return await`"][1] I got an idea to try fit as much "keywords" as possible into one "expression". I mean as much blue words (in Visual Studio's default colors) as possible together (not separated by semicolon, comma, colon, bracket, etc.).

<!-- excerpt -->

Obviously `yield return await` gives us 3 together. One can also do `yield return this`, `yield return base` or `yield return sizeof(...)`. But that's still just 3. Can I do more? While I was waiting for my car on a yearly checkup, hence I was not mindlessly wasting time, I came up with 7.

```csharp
class C
{
	async Task Test()
	{
		switch (this)
		{
			case null when await this is false:
				break;
		}
	}

	public System.Runtime.CompilerServices.TaskAwaiter<bool?> GetAwaiter() => default;
}
```

The `case null when await this is false` is the answer. At this point I ran out of time as I received a message from the garage that my car is ready. Maybe _you_ can come up with even longer solution and I'm eager to see it.

> [Related post.][2]

[1]: {% include post_link, id: "233767" %}
[2]: {% include post_link, id: "233771" %}