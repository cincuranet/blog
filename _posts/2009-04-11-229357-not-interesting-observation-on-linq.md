---
title: "(Not) interesting observation on LINQ"
date: 2009-04-11T16:05:00Z
tags:
  - LINQ
layout: post
---
I've found interesting stuff in last couple of ... I don't know. Well it's not interesting because everybody knows it :), but using it this way, was for me like going the other direction. 

First is that code comprehension (which I don't like, btw) is translated into well known methods like Select, Where etc. You are using this in LINQ often. But it's not coupled to IQueryable or whatever, it's just dumb translation during compile. Hence you can easily provide i.e. only Select and Where methods in your class and use it with code comprehension. Not worrying about IQueryable or runtime exceptions if don't support some methods. Obvious, right? I told you. :)

Another observation is that your i.e. Where method may return completely different class or collection of classes. This is probably not usefull at all, although as a mind blowing code to torture your colleagues it can be fun. ;)