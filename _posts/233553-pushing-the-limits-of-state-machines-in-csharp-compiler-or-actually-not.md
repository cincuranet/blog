---
title: |-
  Pushing the limits of state machines in C# compiler ... or actually not
date: 2016-03-05T16:35:00Z
tags:
  - C#
---
Tuesday this week I was explaining some internals of `await`. And as you might know it's backed by a state machine not different from what `yield` does. The state machine uses `int` field to track it's state. And I've got an idea to try, what would happen if I'd create a method with more states than the `int` can hold...

<!-- excerpt -->

I created a file with only a single method containing only `yield return 0;` statements. A lot of these. The resulting file was over 60GB in size. Just for fun I tried to open that file in Visual Studio. Bad idea. Thus to eliminate any limits along the way, I switched to pure `csc` (Roslyn, from VS 2015 Update 1).

Trying to compile that file immediately returned `error CS1504: Source file '...' could not be opened ('Arithmetic result exceeded 32 bits. ')`. Well, at least something. The problem is, I have no idea what limit it hit exactly. Was the file too big in general. Is there way too much lines? Or ...

So I searched a little and found [Peter Ritchie's blog post][1] where he was actually trying to do the same Though he used `await` statements. But the backing state machine shares the structure with what `yield` produces. Read the post if you're interested in details.

Because somebody already did the work of trying to push it to the limit, I decided I'll stop here. Frankly I should have searched first to save myself few minutes of time it took to generate the 60+GB file. But that's how I roll. :)

The good news is, the `int` used for the state machine is not an issue at all. You'll hit other limits way sooner. And honestly having more than, say, 100 `await`s or `yield`s seems to be like a pretty bad code anyway in real world.

[1]: http://blogs.msmvps.com/peterritchie/2012/01/19/c-async-limits-oh-my/