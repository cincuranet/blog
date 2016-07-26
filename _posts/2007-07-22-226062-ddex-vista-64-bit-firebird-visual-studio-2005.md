---
title: "DDEX, Vista (64-bit), Firebird, Visual Studio 2005"
date: 2007-07-22T13:15:00Z
tags:
  - .NET
  - Firebird
  - Visual Studio
redirect_from: /id/226062/
category: none
layout: post
---
Some months ago I was writing about installing DDEX provider for Firebird to Visual Studio ([DDEX and Firebird .NET Data Provider][1]). There is described the "old style" method of using it. It's still working, but you need Visual Studio SDK, and so it's not so direct.

But DDEX for Firebird is able to work without this SDK too (not so long like with SDK, but it's not brand new stuff). Because I installed on my new laptop Vista 64-bit, I need to install the DDEX interface to Firebird too. Some new cool stuff was introduced with Vista, but some things stopped working, so I was little bit scary how the privovider will work. So let's look at it - it's not tricky, everything is in readme, but you know .... [Note: This procedure is applicable to both 32-bit and 64-bit systems as well to WinXP.]

I have VS 2005 Prof. with SP1 and Vista SP installed. The I build DDEX provider on my old laptop (but you can download binary package). Install/Copy dll files to you favourite place. Then prepare FirebirdDDEXProviderPackageLess64.reg file (or FirebirdDDEXProviderPackageLess32.reg if you have 32-bit system). You need to change %Path% "variable" to your installation path (remember backslashing backslash), so the path should look i.e. C:\something\somethingelse\FirebirdSql.VisualStudio.DataTools.dll. Then import this file into registry, double-click does this (you will need administrator's permissions). OK. Next step. Verify that you have FirebirdSql.Data.FirebirdClient in GAC (gacutil /l FirebirdSql.Data.FirebirdClient should return you at least one item). If not, use gacutil to add it to GAC (gacutil /i <Path To Your FirebirdSql.Data.FirebirdClient assembly>). The info that you get from gacutil Copy'n'Paste to some place (or just don't close console window). Now find machine.config files (there are two on 64-bit systems; one on 32-bit) [note: To only make Visual Studio to work with DDEX you can modify ony 32-bit version of machine.config. But i.e. factories in your 64-bit apps will not be able to use FB.]. Modify it, as described in readme. You have to substitute %Version%, %Culture%, %PublicKeyToken% "variables" to your real data - you can find it in the output from gacutil (yes, now you can close console ;)). Save these files. Open Visual Studio, Server Explorer and try to add connection to FB server.

First you have to see FB provider in list - if not, the registry file isn't imported right. Second when you type something in the next dialog and it closes, the most common reason is, that the FirebirdClient assembly cannot be loaded. Verify whether it's in GAC and whether assembly info in machine.config is same as in GAC.

Well, nothing painfull, isn't it? DDEX, Vista (64-bit), Firebird, Visual Studio 2005; everything works fine. To prove, I'm not cheating :) look (ok you can say, that it's mounting, but I'm not so patient to do this):

![image]({{ site.address }}/i/226062/226062.png)

[1]: {{ site.address }}{% post_url 2006-02-19-7471-ddex-and-firebird-net-data-provider %}