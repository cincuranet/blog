---
title: |-
  Synology's support is exceptional
date: 2011-11-14T18:55:22Z
tags:
  - Life
  - Network Attached Storage (NAS)
  - Storage &amp; Backup
  - Synology
layout: post
---
I'm not writing often about services I use etc. But from time to time I'm extremely pleased with some and that's worth mentioning. This time it's [Synology][1]. I'm using Synology NAS boxes for a many years and in my opinion these are the best. But that's not what I like to talk about.

Recently one box started behaving very slowly. Both internal processes, Windows share access and web interface. I did couple of usual checks, and checked health of disks. Nothing. At that time also new firmware came out so I decided it will not hurt to update it, maybe it will solve the problem. The download and installation was very slow, of course and I actually needed more attempts to install it. But no specific error, except second to last try when it was showing me problem with free space on system partition. That brought me to suspicion that the slow behavior is related to it. Couple of quick attempts with this and that, but no luck. Before I go to SSH and look and it from inside, I decided to contact support. Maybe they have so tried-and-true solution. The responses were reasonably fast and I end up sending debug dump of system as asked. Synology investigated the dump and it turned out one of the disks in [RAID 1][2] was dying. Sure when I was doing the initial checks, the [S.M.A.R.T.][3] was without errors (who knows why). When I ran it after getting the reply, errors were there. Bad timing.

Synology not only - for free - analyzed the dump, but also provided me with description of what disk is failing, serial number etc. They could tell me something like "Your disk is wrong." and I would not believe it, because I was focused on the system and system partition. Maybe later I would found the errors myself when again checking everything that could go wrong. But that might be too late (well probably not with RAID 1, but why running on thin ice).

With that being said. Great service Synology!

[1]: http://www.synology.com
[2]: http://en.wikipedia.org/wiki/Standard_RAID_levels#RAID_1
[3]: http://en.wikipedia.org/wiki/S.M.A.R.T.