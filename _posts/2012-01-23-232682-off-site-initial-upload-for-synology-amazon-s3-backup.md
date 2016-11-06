---
title: "Off-site initial upload for Synology Amazon S3 backup"
date: 2012-01-23T08:33:01Z
tags:
  - AWS
  - Cloud
  - Network Attached Storage (NAS)
  - Storage &amp; Backup
  - Synology
redirect_from: /id/232682/
layout: post
---
I recently started thinking about backing up also "less" important data (No matter what you think, every data is important. You'll find out, when you will loose the least important data (you thought it's least important). But everybody needs to learn that the hard way, before really believing.) to [Amazon S3][1] from my [Synology NAS][2], which is my primary backup location. The problem was, that the amount was about 150GB. Far more than I can upload through my home connection in reasonable time. It would take weeks. When I first started using [S3 backup on my NAS][3], I checked, what's exactly being copied to the bucket, in case disaster happens and I'll be force to restore without any Synology box around (or at least restore critical data sooner than I'll have it available).

Luckily it's almost the same structure as on disk. There's a `@tmp` folder added and whole backup is in particularly named folder, but the name is same for all backups from the NAS. If you checked also `Enable metadata backup`, there's one file per folder, with metadata in it (guessing, I haven't tried to reverse it), but I'm not using this option.

I wanted to upload the initial data from my office, where the connection is better and, because the data isn't changed too often, just backup the differences directly from box. With the above knowledge I was pretty confident, the off-site upload is going to work. :) And it did. After I uploaded the data, I triggered the backup on box and after a while it was done. Like a glove.

And remember, backup is one part. Restore is the key other!

[1]: http://aws.amazon.com/s3/
[2]: http://www.synology.com/
[3]: http://www.synology.com/us/products/features/backup_server.php