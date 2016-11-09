---
title: "Easy indentation control for Debug/Trace/..."
date: 2011-05-16T11:16:01Z
tags:
  - .NET
  - C#
layout: post
---
I was setting up simple command logging, but keeping in my mind where I increased the indentation to later decrease it back was causing me headache. Also formatting the string I'd like to put out wasn't smooth.

So I created simple wrapper class implementing [IDisposable][1], where the disposing will actually decrease the indentation automatically. Only thing you (I) have to use is simple [using block][2]. The precooked `WriteLine` helper method is there just to save me some typing.

```csharp
class IndentHolder : IDisposable
{
	public void Dispose()
	{
		Trace.Unindent();
	}
}
public static void WriteLine(string format, string category, params object[] args)
{
#if (TRACE)
	Trace.WriteLine(string.Format(format, args), category);
#endif
}
public static IDisposable Indent()
{
#if (TRACE)
	Trace.Indent();
	return new IndentHolder();
#endif
}
```

[1]: http://msdn.microsoft.com/en-us/library/system.idisposable.aspx
[2]: http://msdn.microsoft.com/en-us/library/yh598w02.aspx