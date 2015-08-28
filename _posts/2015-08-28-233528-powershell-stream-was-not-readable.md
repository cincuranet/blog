---
title: "PowerShell: \"Stream was not readable\""
date: 2015-08-28T15:14:00Z
tags:
  - PowerShell
redirect_from: /id/233528/
category: none
layout: post
---
Yesterday I was processing some files using a simple PowerShell script. Basically open the file, read it, process lines, save it. Nothing else. And I was randomly getting `Stream was not readable` error while saving. Few runs and always a different file. Pretty confusing.

<!-- excerpt -->

The script was like this. Nothing fancy.

```powershell
gci -Recurse *.cs | %{
	$lines = gc $_ -Encoding utf8
	for ($i = 0; $i -lt $lines.Length; $i++)
	{
		$lines[$i] = $lines[$i].TrimEnd()
	}
	sc $_ $lines -Encoding utf8
}
```

I was not debugging it deeply, I just guessed the file might be still kept open from the `gc` if the trimming went very fast and so the `sc` was failing. So I quickly created a small delay - band aid if you want - and voilà it works.

```powershell
gci -Recurse *.cs | %{
	$lines = gc $_ -Encoding utf8
	for ($i = 0; $i -lt $lines.Length; $i++)
	{
		$lines[$i] = $lines[$i].TrimEnd()
	}
	# Fix for "Stream was not readable."
	sleep -Milliseconds 200
	sc $_ $lines -Encoding utf8
}
```

I was not testing different value than `200` milliseconds as that was my first try and it solved the problem. And the whole script still finished in reasonable time. It might also depend on machine. 

Anyway if you know how to explicitly "release" the file being read, let me know. I'd like to learn new stuff.