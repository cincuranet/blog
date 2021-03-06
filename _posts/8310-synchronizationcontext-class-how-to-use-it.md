---
title: |-
  SynchronizationContext class - how to use it?
date: 2006-06-02T19:55:00Z
tags:
  - .NET
---
In .NET framework 2.0 is new class SynchronizationContext. This class can be very helpful when using threads and communication (and collaboration) between threads.

Before, if you want to i.e. do something with some control on form (or just do something in another thread) you have to use the Invoke method of the object (most common of form) and use the InvokeRequired property to determine how and what to do. This means, that the receiver must care about this stuff about threads. With the new SynchronizationContext class this logic is back in the sender.

Look at this code:

```csharp
public partial class Form1 : Form
{
	public Form1()
	{
		InitializeComponent();
	}
	private void button1_Click(object sender, EventArgs e)
	{
		new Thread(new ThreadStart(new UsefulClass(this).DoWork)).Start();
	}
	public void AnotherDoWork(string text)
	{
		button1.Text = text;
	}
}
class UsefulClass
	{
		private Form1 _form;
		private SynchronizationContext _context;
	public UsefulClass(Form1 form)
	{
		_form = form;
	}
	public void DoWork()
	{
		Thread.Sleep(2000);
		_form.AnotherDoWork("jirka");
		Thread.Sleep(2000);
	}
}
```

If you try to run it you will get InvalidOperationException exception saying that cross-thread operation is not valid. To solve this you have to modify the code using Invoke/BeginInvoke and InvokeRequired, as you know.

Now look at the example with SynchronizationContext class:

```csharp
class UsefulClass
{
	private Form1 _form;
	private SynchronizationContext _context;
	public UsefulClass(Form1 form)
	{
		_form = form;
		_context = SynchronizationContext.Current;
		if (_context == null)
		{
			_context = new SynchronizationContext();
		}
	}
	public void DoWork()
	{
		Thread.Sleep(2000);
		_context.Post(new SendOrPostCallback(delegate { _form.AnotherDoWork("jirka"); }), null);
		Thread.Sleep(2000);
	}
}
```

In the contructor of the class we get the SynchronizationContext from the Current property and if there's null we simply create a new one (this test is important, there's no need to exist the object in Current property). As you can see we're using the SynchronizationContext's method Post to "invoke" the method in right way. And that's all. There's also Send method for synchronous operation.

I hope this (really) easy example will help you with playing and understanding this class and threads.

Any comments welcome.