---
title: "PowerShell script to tabify text (i.e. in code files)"
date: 2011-12-29T18:50:23Z
tags:
  - C#
  - PowerShell
layout: post
---
Few weeks ago I needed to tabify (change spaces to tabs) in a C# files in a solution. I tested some plug-ins to Visual Studio, but none of them did what I wanted. I left the idea, as it was not that important to have consistent tabs/spaces. But a day or two ago I had some time and yen for to create simple [PowerShell][1] script to fix that for me. It simply replaces _x_ `spaces` taken from input parameter with tab(s). Text goes to `stdin` and result to `stdout`.

```powershell
param([int]$spaces)
$pattern = '';
for ($i = 0; $i -lt $spaces; $i++) {
	$pattern = $pattern + ' ';
}
$pattern = '^((' + $pattern + ')*)' + $pattern;
$replace = '$1' + "`t";
$input | foreach {
	$text = $_;
	do {
		$prev = $text;
		$text = $text -replace $pattern, $replace;
	} while ($prev -ne $text)
	Write-Output $text;
}
```

The script, as you can see, is not interpreting the code in any way, hence some spaces i.e. in comments at the beginning might become tabs even if that's actually wrong. But hey, you can take [Roslyn][2] and plug it in, as an exercise. :)

To, for instance, tabify all `.cs` files in some path, you can call this script (saved as `tabify.ps1`) using something like:

```powershell
Get-ChildItem -Recurse ".\src" | Where-Object {$_.Extension -eq ".cs"} | foreach { Get-Content $_.FullName | .\tabify.ps1 -Spaces 2 | Set-Content -Encoding UTF8 ($_.FullName + ".tabs") }
```

[1]: http://technet.microsoft.com/en-us/library/bb978526.aspx
[2]: http://msdn.com/roslyn