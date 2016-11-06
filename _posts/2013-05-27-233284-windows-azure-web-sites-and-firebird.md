---
title: "Windows Azure Web Sites and Firebird"
date: 2013-05-27T13:26:03Z
tags:
  - AWS
  - Azure
  - Cloud
  - Firebird
  - Storage &amp; Backup
redirect_from: /id/233284/
layout: post
---
I recently migrated all my sites to [Windows Azure][1] (this blog is served from Azure too). I was bored maintaining my own little server. Patches, updates, configurations, backups. It was taking too much time. And because of that I was trying to run as less as possible. So I did a little math and figured, that if I'll ditch some old projects and use what I really use I can run it on Azure Web Sites just fine with about the same price. That allowed (to be honest forced) me to remove some old projects and also rethink some of my oldest pieces of code for efficiency. Because on cloud every penny matters. I'm not using Azure because I'm expecting some huge load or anything like that. Simply because it's, well, simple and, no doubt, cool.

<!-- excerpt -->

Site for [ID3 renamer][2] I'm running is using [Firebird][3] as database back-end. It's storing few values into it, but also a lot of text is there (yes, if could and probably should be move out and into views, but ... not enough time). Anyway the Firebird database is needed. No question asked. But Firebird is not available as Azure service (obviously). I can spin up a VM, but that takes me back to patching, backing up, maintaining etc. Hence I decided to try run [Firebird Embedded][4]. Should work if the Azure Web Sites environment is not limited too much.

First you need to figure out whether the websites are running in 32bit or 64bit process to include proper Firebird version (yes, I could include both and decided dynamically, but that looked like overkill). Mines are 32bit. So I added `fbembed.dll` and rest of files into my solution and deployed using [Git][5]. Works (both the deployment as well as Firebird) like a charm.

The database itself is stored in a file, as regular Firebird near the website's files (it's not part of Git repository, I copied it there using FTP; it's also not affected by deployment). Only problem left was backing it up. I first tried running `gbak` via Services API. Although it worked fine, I hit the limit of free space. That was no-go. So I turned my attention to `nbackup` or `alter database [begin|end] backup` respectively. It works again nice. Calling the "begin backup" via `FbCommand` and the delta file is created. Then I safely copy the file to [Amazon's S3][6] and run "end backup". Done.

Sure. You might say that this is not a good solution. Because the database file is on the disk where the website is and this might be corrupted as some updates occur and the website is moved. Yes, that's why I'm doing backups. You might also say that the websites machines are not heavy-duty database machines. Yes, but my database queries are simple and also some simple inserts. I also heavily added caching - penny pinching, remember? - thus the database is not hit even less often. You might also say that this will not work when I try to scale my website across more machines. Sure. ID3 renamer has been here for roughly 11 years. Downloads and visits are steady for about last 4 years. I don't think it's going to suddenly jump in popularity. And even if, I'll solve as it happens. :)

To sum up. Firebird Embedded works well in Windows Azure Websites. If you need fully featured SQL database for zero extra-money with option to go hassle-free to full server if the need comes, it's a way to go.

[1]: http://www.windowsazure.com
[2]: http://www.id3renamer.com
[3]: http://www.firebirdsql.org
[4]: http://www.firebirdsql.org/manual/fbmetasecur-embedded.html
[5]: http://en.wikipedia.org/wiki/Git_(software)
[6]: http://aws.amazon.com/s3/