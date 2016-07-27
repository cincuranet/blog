---
title: "Nullable types - what's faster?"
date: 2008-10-20T16:00:00Z
tags:
  - .NET
redirect_from: /id/228522/
layout: post
---
Today I was working with nullable types - `short?` for my instance. I was wondering what's the fastest way of getting value and also testing whether the value is there.

#### `HasValue` vs. `!= null`

Well test on my notebook on .NET FW 3.5 in VPC, optimization turned on shows that HasValue is faster. Roughly twice on my configuration. Also the IL code looks different.

#### Using `Foo.Value` vs. `(short)Foo`

Here I didn't measured any difference. And the code is pretty much same. It's not exhaustive testing (and you know - I believe only in stats I adulterated ;)).

I did about 10 runs for each test and looked to IL (it's fastest way to prove your idea is wrong or not). 

What about you? Similar results?