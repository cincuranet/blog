---
title: "After you recovered from disaster how are you going to \"unleash\" your users?"
date: 2014-06-03T06:09:00Z
tags:
  - Disaster recovery
redirect_from: /id/233461/
category: none
layout: post
---
Last week was some weird week. A lot of downtimes in services I'm using and I was also struggling to implement a feature, that looked fairly straightforward, in [FirebirdClient][1]. But the downtimes and more specifically the time just after the downtime made me think.

One of the services was down for nearly a day (really a day, like 24 hours). It happens. It's bad, very bad. But it happens. The company was doing fairly good job keeping people updated on the status, mainly on social media. It could be better, but also worse (complete silence). There's tons of articles how you should handle these bad situations. And I'm not going to provide any smart-thoughts here to this topic. I'm going to talk about steps you do after the disaster is mitigated. Something that's often overlooked.

<!-- excerpt -->

Let me guide you through my thinking. Once the above mentioned service recovered, it just started working (as expected) and they flooded social media with this good news. After a few minutes people started hitting the service from all possible sources and devices and it ... held, but was very very slow. As people started asking on social media they kept explaining what's going on.

And that's where I got my idea. Maybe part of this process should be also a plan how to "unleash" users. First any service needs some warm-up (indices, caches, ...) after start - if it's not done manually you need to put the load on it slowly. Users are waiting to get things done. And once you show the green light they will hammer it. And hammer it hard.

There's a tons of hardware or programming ways to let the users in in a controlled way. And if you have/developed one these, great. But I also realized there's maybe one pretty simple though still effective (haven't tested it, as I don't have a heavily used service with millions of users waiting to hammer it down, it's just theory ;)). What about simply spreading the word slowly. First put the green light on your status page. Some people are probably checking it regularly. Once they find it they will put some load gradually. Then starting responding to people who asked on social media. And then put the news on your social media. And so on. Also it will be mixed with people who simply try it.

If you were down more than hour or so chances are another minute or two as you start spreading the news about being up again doesn't matter. With that you're then not only up, but also working within the metrics (i.e. response time) you have defined from the get go.

[1]: http://www.firebirdsql.org/en/net-provider/