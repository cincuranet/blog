---
title: |-
  Playing with asyncio and aiohttp in Python as a C# developer  
date: 2017-10-12T05:16:00Z
tags:
  - Python
  - Multithreading/Parallelism/Asynchronous/Concurrency
---
Few months back I decided to play a little with [_asyncio_ in Python][1]. Explore a little bit how "they did it" and align that in my mind with what I know about the implementation in .NET. Because at that time I needed some HTTP probing I decided to test the async IO together with regular HTTP (aka network) requests. And I used [_aiohttp_][2]. Not that I did some big research. I did quick search and looked at some demos to see whether I like how it's structured or not. And _aiohttp_ felt fine.

<!-- excerpt -->

My script at the end looked like this (given it's my first try, I would be happy if somebody corrects something suboptimal with my `asyncio` usage).

```python
import sys
import time
import asyncio
import aiohttp
from termcolor import colored

urls = ["https://www.tabsoverspaces.com", "https://www.id3renamer.com"]

async def fetch(url, loop):
        async with aiohttp.ClientSession(loop=loop) as session:
                try:
                        start_time = time.perf_counter()
                        async with session.get(url, allow_redirects=False, timeout=10) as response:
                                end_time = time.perf_counter()
                                if response.status == 200:
                                        duration = (end_time - start_time) * 1000
                                        return (url, duration)
                                else:
                                        return (url, -1)
                except:
                        return (url, -1)

async def main(loop):
        tasks = []
        for url in urls:
                tasks.append(asyncio.ensure_future(fetch(url, loop)))
        await asyncio.gather(*tasks)
        results = map(lambda x: x.result(), tasks)
        for fetch_result in results:
                (url, result) = fetch_result
                color = "green" if result != -1 else "red"
                print(colored("{0:<40}".format(url[0]), color) + "{0:.2f}ms".format(result))

loop = asyncio.get_event_loop()
loop.run_until_complete(main(loop))
```

First thing to test was whether it's really asynchronous aka not creating any extra threads. Of course, it is. Otherwise I'm sure I wouldn't be the first one to notice it.

The "magic" keywords are same as in C# - `async` and `await`. The `async` marks method where the `await` will be used and `await` is where the magic happens. 

One thing to notice is the `async with` statement. The context manager needs to be able to suspend and resume the execution inside the `with` block.

The plumbing is done with `asyncio`, i.e. in C# we have [`Task.WhenAll`][3] and here it is [`asyncio.gather`][4] (although there's also [`asyncio.wait`][5] with bunch of options).

What's most interesting is the need to use _event loop_. In C# if you're writing i.e. _WinForms_ the concept of event loop (or _message pumping_ in more low-level terms) is well known. But it's not explicit and for example console applications don't have such thing (even the abstraction - the [`SynchronizationContext`][6] - is `null` in console applications). Here, though my script is basically a console application, I had to specify it and specify it explicitly. 

From what I understood the _event loop_ is where the calls and most importantly callbacks (and hence resumes) happen. I think about it as a _scheduler_ and _IO completion ports_ (in Windows terms). My understanding is, I'm sure, clear on high level, but the rubber meets the road when you dive deep.

Although this was just a one or two afternoons playing with _asyncio_ I enjoyed learning new stuff and applying it to what I already know. I wish I had more time to do this.

[1]: https://docs.python.org/3/library/asyncio.html
[2]: http://aiohttp.readthedocs.io/en/stable/
[3]: https://msdn.microsoft.com/en-us/library/system.threading.tasks.task.whenall(v=vs.110).aspx
[4]: https://docs.python.org/3/library/asyncio-task.html#asyncio.gather
[5]: https://docs.python.org/3/library/asyncio-task.html#asyncio.wait
[6]: https://msdn.microsoft.com/en-us/library/system.threading.synchronizationcontext(v=vs.110).aspx