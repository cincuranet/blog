---
title: |
  Batch converting Excel files to PDF
date: 2016-10-13T18:24:00Z
tags:
  - MS Office
  - JavaScript
  - Windows
  - Windows Scripting Host
  - PowerShell
layout: post
---
I have - or rather I've had - bunch of Excel files and I needed these in PDF. If I would be just five or so of these I would do it manually in Excel. But there was bit over 200 files. Doable but not fun. 
  
<!-- excerpt --> 

So I started scripting. Some quick search on the internet brought some examples using Word in `WSH`. With that in my hands it was just a matter of firing `Excel.Application` ActiveX and going though the [documentation][1] gluing it together. I've spent few minutes looking for proper file type for `SaveAs` method, finding eventually the PDF (`xlTypePDF`) is `57`.

Here's the result.

```javascript
var fso = new ActiveXObject('Scripting.FileSystemObject');
var filePath = fso.GetAbsolutePathName(WScript.Arguments(0));
var pdfPath = filePath.replace(/\.xlsx$/i, '.pdf');

var objExcel = null;
try {
	WScript.Echo(pdfPath);
	
	objExcel = new ActiveXObject('Excel.Application');
	objExcel.Visible = false;
	
	var objWorkbook = objExcel.Workbooks.Open(filePath);
	
	WScript.Echo('  saving');
	
	var xlTypePDF = 57;
	objWorkbook.SaveAs(pdfPath, xlTypePDF);
	objWorkbook.Close(false);
	
	WScript.Echo('  done');
}
finally {
	if (objExcel != null) {
		objExcel.Quit();
	}
}
```

Nothing special. Just call it `cscript.exe xlsx2pdf.js <filename>` (where `xlsx2pdf.js` is the script from above) and that's it. Doing the batch with PowerShell was piece of cake.

```powershell
gci -Recurse -Filter *.xlsx | %{ cscript.exe xlsx2pdf.js $_.FullName }
```

Minute or two later it finished. Enjoy (as much as I did).

[1]: https://msdn.microsoft.com/en-us/library/office/ff194565.aspx