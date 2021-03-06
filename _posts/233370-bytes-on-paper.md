---
title: |-
  Bytes on paper
date: 2016-08-31T08:33:00Z
tags:
  - Programming in general
  - Firebird
---
Last week I had bit of free time during afternoons and I was working on compression support in [FirebirdClient][1]. My initial code I've put together couple of weeks before was straightforward but eventually everything started to fall through cracks of edge cases and I had dig deeper and provide a lot more implementation than I'd like to.

<!-- excerpt -->

And one of the (un)pleasant things while working on wire protocol level with Firebird is that there's really not much clues for debugging and error messages. Kind of you have it either right completely or you're doomed. The wire protocol is binary, of course. And basically every byte and sometimes even bit matters. So loosing some means a quick trouble. Not because I lost some bytes, but because you don't know where. Especially if data is involved which makes it so much harder to step through in debugger.

Although I consider myself quite fluent with debugger, sometimes it's too much to handle and big guns need to be deployed. In my case that means pen and paper.

![Bytes on paper]({{ include "post_ilink" page "bytes.jpg" }})

I started comparing runs without compression and with compression, inflating the compressed data in helper code and trying to spot the difference. Luckily for me it was not far from beginning and I was able to find it quickly. Then it was just head-down-march-to-the-finish and moving onto the next problem.

[1]: http://www.firebirdsql.org/en/net-provider/