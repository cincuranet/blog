---
title: |-
  TortoiseSVN PowerShell aliases improved
date: 2010-04-26T08:47:46Z
tags:
  - PowerShell
  - Subversion
  - TortoiseSVN
---
Some time ago [I wrote about creating PowerShell aliases for commit and update for TortoiseSVN][1]. But I needed little bit more flexibility with path so I added a parameter with default to `.`.

```powershell
function fn_update($path = ".") {tortoiseproc /command:update /path:$path}
function fn_commit($path = ".") {tortoiseproc /command:commit /path:$path}
```

[1]: {% include post_link id="231239" %}