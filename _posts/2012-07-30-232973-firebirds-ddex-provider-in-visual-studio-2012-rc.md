---
title: "Firebird's DDEX provider in Visual Studio 2012 (RC)"
date: 2012-07-30T12:50:17Z
tags:
  - Firebird
  - Visual Studio
redirect_from: /id/232973/
category: none
layout: post
---
As with every new Visual Studio, I'm trying the [DDEX provider for Firebird][1] with it. The [version 2010][2] was piece of cake. The VS 2012 (RC in time of writing) was little bit of trial and error. But I'm not a quitter! Anyway, the good news is, it works. No magic changes needed. Only some tweaking of registry file. Rest is same as in [ReadMe.txt][3]. These will be available with next build (and of course in SVN) of provider, probably when VS 2012 RTM will be released.

Some images to turn you on. :)

![image]({{ site.url }}/i/232973/ddex_fb_vs2012_1.png)

![image]({{ site.url }}/i/232973/ddex_fb_vs2012_2.png)

[1]: http://www.firebirdsql.org/en/net-provider/
[2]: {{ site.url }}{% post_url 2008-11-22-228661-ddex-for-firebird-and-visual-studio-2010 %}
[3]: http://firebird.svn.sourceforge.net/viewvc/firebird/NETProvider/trunk/DataDesignerExtensibility/ReadMe.txt?view=markup