---
title: |-
  Connecting from Android to Firebird
date: 2010-11-02T16:10:24Z
tags:
  - .NET
  - Android
  - Firebird
  - Mono
  - MonoDroid
layout: post
---
Remember the [challenge I did][1] some time ago with [.NET provider for Firebird][2] and [MonoTouch][3]? Well because I've got access to previews of [MonoDroid][4], why not to try the same here?

Again it's a pretty challenge for the whole MonoDroid stack, as the provider uses a lot of various pieces from .NET Framework. And taking into account, the MonoDroid is still in previews phase I wasn't sure I'll be able to succeed. However I did. With some tweaking, and I kind of remembered the important places from [last attempt][5], so it was faster, I was able to make it work easily.

Application connected to Firebird server and showing server version and data from `MON$DABATASE`:

[![image]({% include post_i_link post=page name="android_firebird_thumb.jpg" %})][6]

Cool, isn't it? Taking into account, that the [Windows Phone 7][7] (because everything there is based on [Silverlight][8]) doesn't contain pieces from [ADO.NET][9], it's nice that [Mono][10] isn't crippling the objects available.

Still using i.e. OData is probably better idea, but who knows what somebody might wanna create.

[1]: {% include post_id_link id="231195" %}
[2]: http://firebirdsql.org/index.php?op=files&id=netprovider
[3]: http://monotouch.net/
[4]: http://monodroid.net/
[5]: {% include post_id_link id="231195" %}
[6]: /i/232132/android_firebird.png
[7]: http://en.wikipedia.org/wiki/Windows_Phone_7
[8]: http://silverlight.net/
[9]: http://msdn.microsoft.com/en-us/library/aa286484.aspx
[10]: http://www.mono-project.com/