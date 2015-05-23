---
title: "Toggle \"Presentation Mode\""
date: 2015-05-23T13:22:00Z
tags:
  - Windows
  - Presentations &amp; Speaking
redirect_from: /id/233508/
category: none
layout: post
---
When I'm teaching my courses I'm of course in Presentation Mode. I keep all my applications running, but I just don't want to have notifications popping up while I'm talking. During the day I also have tasks for people to complete so they get familiar with whatever area we're talking about - listening is something, but actually doing it yourself is one step higher. While they are completing these tasks I often freeze the image on the projector and I do some easy work myself and waiting for questions to pop up. At this time the Presentation Mode is not needed and I'm turning it off.

But turning it on and off means a lot of clicks. And that's slow. As a developer I keep my hands on keyboard. Little bit of searching and you'll find out two commands: `presentationsettings /start` and `presentationsettings /stop`. That's better. But you have to distinguish about the two actions. There's no toggle. And that is (or actually was) frustrating for me.

I decided to make myself a little tool to do the toggle. First I needed to check whether I'm in Presentation Mode or not (and hence whether I'll be turning it off or on). That's what the [`SHQueryUserNotificationState`][1] function does. P/Invoke to save me. Next is just calling the `PresentationSettings.exe` with proper switch. And done.

Here's the interesting part of the application. The `Interop` class contains just the definitions for P/Invoke.

<pre class="brush:csharp">
static void Main(string[] args)
{
	var state = SHQueryUserNotificationState();
	if (state != null)
	{
		var toggleResult = state == Interop.QUERY_USER_NOTIFICATION_STATE.QUNS_PRESENTATION_MODE
			? ExecutePresentationSettings("stop")
			: ExecutePresentationSettings("start");
		if (!toggleResult)
		{
			ShowProblem("Unable to toggle Presentation Mode.");
		}
	}
	else
	{
		ShowProblem("Unable to get Presentation Mode status.");
	}
}

static Interop.QUERY_USER_NOTIFICATION_STATE? SHQueryUserNotificationState()
{
	Interop.QUERY_USER_NOTIFICATION_STATE state;
	return Interop.SHQueryUserNotificationState(out state) == Interop.S_OK
		? state
		: (Interop.QUERY_USER_NOTIFICATION_STATE?)null;
}

static bool ExecutePresentationSettings(string action)
{
	var psi = new ProcessStartInfo();
	psi.FileName = "PresentationSettings.exe";
	psi.Arguments = string.Format("/{0}", action);
	try
	{
		using (var process = Process.Start(psi))
		{ }
	}
	catch
	{
		return false;
	}
	return true;
}

static void ShowProblem(string text)
{
	MessageBox.Show(text, string.Empty, MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
}
</pre>

If you'd like to have the complete code you can find it in [this repository][2] (feel free to contribute). It's a Windows application without any window. It just toggles and that's it.

Now I can just call this application and I don't have to worry about `/start` or `/stop`.

[1]: https://msdn.microsoft.com/en-us/library/windows/desktop/bb762242%28v=vs.85%29.aspx
[2]: https://github.com/cincuranet/PresentationModeToggle