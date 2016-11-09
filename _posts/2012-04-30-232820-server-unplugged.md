---
title: "Server unplugged"
date: 2012-04-30T18:14:28Z
tags:
  - Linux
layout: post
---
One of my first servers I used for real world applications is now unplugged. Weird feeling. It was Linux box running [Slackware][1] 10.2.0 (yeah, old). For a while it was my main mail ([Postfix][2], [Dovecot][3]) and antispam ([SpamAssassin][4]) server. I had [Firebird][5] there as well as [Apache/httpd][6], [PHP][7], [Subversion ][8] and [Mono][9]. And all the standard services (SSH, cron, FTP, gcc, ...). The Firebird handled quite some applications thorough years. Apache handled till very last time, among other things, download mirror for [PSPad][10] (and I learned a lot about performance tuning with limited resources available when new (non-beta) version of PSPad was released). Few scripts were written in [Perl][11], a lot of in [bash][12] directly. And that's just what I remember.

Upgrading, configuring, compiling all these services... What a great memories.

You served well all these years (8?).

```text
root@<removed>:~# shutdown now
Broadcast message from root (pts/0) (Mon Apr 30 08:29:38 2012):
The system is going down to maintenance mode NOW!
```

[1]: http://www.slackware.com/
[2]: http://www.postfix.org/
[3]: http://www.dovecot.org/
[4]: http://spamassassin.apache.org/
[5]: http://www.firebirdsql.org/
[6]: http://httpd.apache.org/
[7]: http://www.php.net/
[8]: http://subversion.apache.org/
[9]: http://www.mono-project.com/
[10]: http://www.pspad.com/
[11]: http://www.perl.org/
[12]: http://www.gnu.org/s/bash/