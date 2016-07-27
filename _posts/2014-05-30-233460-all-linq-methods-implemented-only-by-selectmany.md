---
title: "All LINQ methods implemented only by SelectMany"
date: 2014-05-21T07:45:00Z
tags:
  - LINQ
  - .NET
  - C#
  - Monad
redirect_from: /id/233460/
layout: post
---
Somewhere this week I read or maybe heard that you can implement all LINQ methods only by `SelectMany`. Somebody just mentioned along the way. 

I read a lot of articles about [monads][1] and `bind` method and ... But here I'm not interested in some "mathematical proof". I just want to try it write myself. No helpers around. Pure C#. Just a brain training. Nothing else.

<!-- excerpt -->

Enter my fun project [SelectManyEnumerable][2]. :) It's not complete (yet) and I'll be slowly adding more methods (as long as I will enjoy it 8-)). 

I suppose some methods will be highly suboptimal for .NET or for any real world usage respectively. But it's not my aim to rewrite portion of LINQ. Just have fun and learn (hopefully) something along the way.

[1]: http://en.wikipedia.org/wiki/Monad_(functional_programming)
[2]: https://github.com/cincuranet/SelectManyEnumerable