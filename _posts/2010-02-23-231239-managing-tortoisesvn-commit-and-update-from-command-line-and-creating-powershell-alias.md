---
title: "Managing TortoiseSVN commit and update from command line and creating PowerShell alias"
date: 2010-02-23T09:07:28Z
tags:
  - PowerShell
  - Subversion
  - TortoiseSVN
layout: post
---
I started to using [PowerShell][1] in my development environment simply to learn it a little bit more (though I'm still using the old command from cmd or UNIX) and also to get out of the stone aged cmd. And because I'm using the console a lot - yep, I get used to it on UNIX/Linux machines with terminal access) I was not happy to open explorer just to issue commit or update to/from [SVN][2] (these are most common commands I'm using, together with diff in commit window).
And happily [TortoiseSVN][3] has a utility to manage most of the basic tasks. It's called TortoiseProc. To do commit or update in current directory, you'll simply execute:

```text
tortoiseproc /command:commit /path:.
```

or

```text
tortoiseproc /command:update /path:.
```

For a while I was happy with it. But typing it everytime or looking into history (I wish cmd/PS had Ctrl+R as bash has) was not perfect for me. So I started looking for a way to create alias in PowerShell. Some kind of alias. PowerShell, sure, has something like this, I thought. And it has - `Set-Alias`. Though, limited. If you try to create alias to command with hardcoded parameters,...

```powershell
set-alias commit "tortoiseproc /command:commit /path:."
```

...as I was trying, you'll not succeed. After some searching and trying I found and an idea from [Andrew Watt][4] using a function (yes, I'm a PowerShell newbie). It's easy and convenient to wrap the command into it.
So finally I create PowerShell aliases for TortoiseSVN to nicely support my work from command line:

```powershell
set-alias update fn_update
set-alias commit fn_commit
function fn_update {tortoiseproc /command:update /path:.}
function fn_commit {tortoiseproc /command:commit /path:.}
```

[1]: http://www.microsoft.com/powershell/
[2]: http://subversion.tigris.org/
[3]: http://tortoisesvn.tigris.org/
[4]: http://www.amazon.com/Andrew-Watt/e/B001HD0UKY/ref=sr_ntt_srch_lnk_4?_encoding=UTF8&qid=1266915476&sr=1-4