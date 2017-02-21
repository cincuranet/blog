---
title: |
  Renaming files based on Exif data in PowerShell
date: 2014-06-06T07:59:00Z
tags:
  - PowerShell
  - Exif
  - .NET
  - Photos
layout: post
---
I like my files organized. Heck. I like everything organized. In order. And as I take some pictures, today mostly with my phone, I upload these files into specific folder. But the files has whatever name the photo or uploading application decides. Not good for my obsession with order. Because these files are simply some snaps of world around me, I name these based on date and time. Pretty simple. 

<!-- excerpt -->

But renaming these manually was boring. So I decided to automate it. It's repetitive, so why not. First I thought I use [NConvert][1] as I knew there's some renaming feature and rename based on [Exif][8] seemed to be reasonable request. Sadly it's not there. After quick search for a simple command line tool I gave up and concluded I can write one myself quicker. It shouldn't be hard in PowerShell and .NET, right?

Luckily the [`System.Drawing`][2] has basic support for reading Exif data and it was just a matter of wiring it together. The [`Bitmap`][3] class has a method [`GetPropertyItem`][4] that returns you Exif data you request. You have to search internet for the number of property item you want and you need to get if from the byte array. The "date taken" property I needed is simple `string` so it was not hard to extract it. The string is [null terminated][5] so take that into account when you're parsing other data - I'm simply skipping the last byte 8-).

After that it was quick to put it together, return [`DateTime`][6] object instead of [`string`][7] and add some error handling. Here's the script.

```powershell
param([string]$file)

function GetTakenData($image) {
	try {
		return $image.GetPropertyItem(36867).Value
	}	
	catch {
		return $null
	}
}

[Reflection.Assembly]::LoadFile('C:\Windows\Microsoft.NET\Framework64\v4.0.30319\System.Drawing.dll') | Out-Null
$image = New-Object System.Drawing.Bitmap -ArgumentList $file
try {
	$takenData = GetTakenData($image)
	if ($takenData -eq $null) {
		return $null
	}
	$takenValue = [System.Text.Encoding]::Default.GetString($takenData, 0, $takenData.Length - 1)
	$taken = [DateTime]::ParseExact($takenValue, 'yyyy:MM:dd HH:mm:ss', $null)
	return $taken
}
finally {
	$image.Dispose()
}
```

I saved that into `exif-datetaken.ps1` and when I need rename files in folder I use this simple script. It adds simple output so I know what's going on.

```powershell
gci *.jpg | foreach {
	Write-Host "$_`t->`t" -ForegroundColor Cyan -NoNewLine 
	$date = (.\exif-datetaken.ps1 $_.FullName)
	if ($date -eq $null) {
		Write-Host '{ No ''Date Taken'' in Exif }' -ForegroundColor Cyan	
		return
	}
	$newName = $date.ToString('yyyy-MM-dd HH.mm.ss') + '.jpg'
	$newName = (Join-Path $_.DirectoryName $newName)
	Write-Host $newName -ForegroundColor Cyan
	mv $_ $newName
}
``` 

My prefered format for files is `yyyy-MM-dd hh.mm.ss` but you can change it easily, if you want.

Take it, change it, enjoy it.

[1]: http://www.xnview.com/en/nconvert/
[2]: http://msdn.microsoft.com/en-us/library/system.drawing.aspx
[3]: http://msdn.microsoft.com/en-us/library/system.drawing.bitmap.aspx
[4]: http://msdn.microsoft.com/en-us/library/system.drawing.image.getpropertyitem.aspx
[5]: http://en.wikipedia.org/wiki/Null-terminated_string
[6]: http://msdn.microsoft.com/en-us/library/system.datetime.aspx
[7]: http://msdn.microsoft.com/en-us/library/system.string.aspx
[8]: http://en.wikipedia.org/wiki/Exchangeable_image_file_format