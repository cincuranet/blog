---
title: |-
  FlameRobin Portable
date: 2007-11-08T08:46:00Z
tags:
  - Firebird
---
I like the software without installation, just one exe, one config saved on some well know place or near exe. For Firebird administration, I'm mainly using wfsql (better isql), IBExpert and FlameRobin (and sometimes isql). Well the isql is without config at all, the wfsql has one ini file, no problem. But sometimes you need something graphical, 'cause it's faster to click here and there, commit, going home. The FlameRobin has nice switch. The `/uh`. When you put into `/uh` path to the conf directory, it will use it, else it will be saved somewhere is `%AppData%`. So I've create simple batch file to run it.

```text
cd "%~dp0%"
start flamerobin_unicode.exe /uh "%cd%conf"
```

It's simply as it can be. First it sets the dir where it is as working and then runs the FR binary. That's all. You can use it on flash drive, on network drive, wherever you want.