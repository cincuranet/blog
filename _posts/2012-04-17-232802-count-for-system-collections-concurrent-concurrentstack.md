---
title: "Count for System.Collections.Concurrent.ConcurrentStack&lt;T&gt;"
date: 2012-04-17T17:36:30Z
tags:
  - .NET
  - Best practice or not?
  - Multithreading/Parallelism/Asynchronous/Concurrency
redirect_from: /id/232802/
layout: post
---
Collections in [`System.Collections.Concurrent`][1] namespace are optimized for access from more (basically) threads. That means no stupid "one-lock-for-everything" approach. Actually these are [lock free][2].

It's good for performance, but also, if used foolhardily, the performance penalty can be too big. One example can be the [`ConcurrentStack<T>` class][3]. As with a lot of collections, this stack also has a [`Count` property][4]. But because it's a lock free implementation using [linked list][5] the `Count` isn't that easy. Actually it's `O(n)` and this can be especially bad for big stacks. So use with care. As the remarks for this property recommends, if you need to know just whether it's empty of not, the [`IsEmpty`][6] is better (though realize, that in time you check it it might be empty, but not on next line where you're about to perform some action and vice versa).

Use the tools, but also know your tools.

[1]: http://msdn.microsoft.com/en-us/library/dd287108.aspx
[2]: http://en.wikipedia.org/wiki/Non-blocking_algorithm#Lock-freedom
[3]: http://msdn.microsoft.com/en-us/library/dd267331.aspx
[4]: http://msdn.microsoft.com/en-us/library/dd287185.aspx
[5]: http://en.wikipedia.org/wiki/Linked_list
[6]: http://msdn.microsoft.com/en-us/library/dd267246.aspx