---
title: |
  Create icon from text
date: 2005-07-10T14:18:00Z
tags:
  - .NET
layout: post
---
Here's easy function for creating icon from string. I'm using it for traybar icon and for showing some usefull information on my notebook, i.e. the battery life in minutes.

```csharp
private static System.Drawing.Icon DrawIcon(string IconMessage)
{
	Icon result = null;
	try
	{
		Bitmap b = new Bitmap(16,16);
		Graphics g = Graphics.FromImage((Image)b);
		g.DrawString(IconMessage,
			new Font("Arial", 10, FontStyle.Regular, GraphicsUnit.Pixel),
			new SolidBrush(System.Drawing.Color.Black),
			0,1);
 		result = Icon.FromHandle(b.GetHicon());
 		g.Dispose();
 		b.Dispose();
	}
	catch (Exception e)
	{
		//Console.WriteLine(e.Message);
	}
	return result;
}
```