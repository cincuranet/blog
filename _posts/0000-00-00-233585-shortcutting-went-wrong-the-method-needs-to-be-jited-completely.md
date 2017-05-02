---
title: |-
  Shortcutting went wrong: The method needs to be JITed completely
date: 2016-11-13T18:09:00Z
tags:
  - .NET
  - IL
  - Lessons learned
layout: post
---
I remember clearly the time I started writing the piece of code I'm going to talk about and thinking it might be a smart move. Of course writing a smart code is never a good idea (lesson learned, again and again and again). Writing simple code is a good idea.

<!-- excerpt -->

While I was working on the [SingleExecutable][1] project one of the last steps was to generate or change the static constructor of entry point's class (details in the linked post) to wire up all the logic. Of course I injected my code as a first one, which meant I didn't had to extract the old code and handle it (putting it somewhere, calling it, ...). If it's the first thing there it's going to be executed first and thus the dependencies, if needed, will be loaded via the infrastructure, right?

What I forgot about is the fact - funny, because it's not new to me - that the **whole** method needs to be JITed before it's executed. It's not JITed line by line or anything like that. That means if the static constructor I injected myself into was working with some types from dependencies the JITing would fail.

The solution is really not difficult. I can inject my code higher in the chain to be sure it's executed before. In IL I can use _module initializers_ (not available from C#). I decided not to go this way, because what would happen if some other tool would already have code there and the code was calling something from dependency? Although very improbable, still the same problem.

So I rather decided to do it properly. Generate fresh new static constructor for the entry point's class. There calling my code and then calling newly generated method created from the original code.

I'm pretty sure this not the last bug there. It's just embarrassing because I knew about the behavior and also I thought that this shortcut was a smart move. Double fault.

The changes are in already released [version 1.1.0][2].

[1]: {% include post_link id="233581" %}
[2]: https://www.nuget.org/packages/SingleExecutable/1.1.0