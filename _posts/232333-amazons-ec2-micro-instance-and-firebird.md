---
title: |-
  Amazon's EC2 Micro Instance and Firebird
date: 2011-05-02T18:36:57Z
tags:
  - AWS
  - Cloud
  - Firebird
---
Few months ago I was playing with different [VPS][1] providers and I was also considering deploying the application to some "small instance" cloud. I came to [Micro Instance][2] of Amazon EC2. Part of the solution I was doing research for is [Firebird database][3] and because the [pricing][4] looks good, I tried to install Firebird (2.5 SuperClassic) on this instance.

The good news is, that it's possible. As I did manual install, it was fast. The bad news is, that it's really slow. If you read the description of [Micro Instance][5] you can expect it will not be blazing fast. But even for really low-load database server it's almost unusable.

I'm not saying you can't use it. Maybe some slow/late backup/mirror or something like that should be doable. But for normal applications using database server you'll do better job with your own server or VPS.

[1]: http://en.wikipedia.org/wiki/Virtual_private_server
[2]: http://aws.amazon.com/about-aws/whats-new/2010/09/09/announcing-micro-instances-for-amazon-ec2/
[3]: http://www.firebirdsql.org
[4]: http://aws.amazon.com/ec2/pricing/
[5]: http://aws.amazon.com/ec2/instance-types/