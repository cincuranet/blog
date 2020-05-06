---
title: |-
  How many keywords I can fit into a single C# expression? - results
date: 2019-02-14T10:54:00Z
tags:
  - C#
  - Perl
---
When I wrote the [yield return await and await foreach geekery][1] post I had no idea it would be so interesting for so many people. But it really spiked up. And I feel a need to point out some interesting ideas people posted on Reddit, in comments or on Twitter.

<!-- excerpt -->

Let me start with something C# unrelated, but no less interesting.

```perl
not exp log srand xor s qq qx xor s x x length uc ord and print chr ord for qw q join use sub tied qx xor eval xor print qq q q xor int eval lc q m cos and print chr ord for qw y abs ne open tied hex exp ref y m xor scalar srand print qq q q xor int eval lc qq y sqrt cos and print chr ord for qw x printf each return local x y or print qq s s and eval q s undef or oct xor time xor ref print chr int ord lc foreach qw y hex alarm chdir kill exec return y s gt sin sort split
```

This Perl piece, posted by user [CaptainAdjective][2], prints "just another perl hacker", when you execute it. And although I programmed in Perl for a very, very short time and I know it's a powerful language, this is nuts.

But back to the C#. The easiest one, which I missed and I'm pretty mad at myself, is adding casting to my original expression: `case null when await this as object is false`. This brings us to 9. 

Some people found that you can do the casting, for example, indefinitely and get infinite amount of "blue words", I don't consider (and you might disagree and I'm fine with that) repetition as a valid solution.

Another interesting one is: `case null when await this is false as object is null`. Which uses the `is` twice, but don't think it is a repetition per se. Although it brings us to 11, it's not the best one yet.

12 is the next step with: `from _ in await this where null as object is bool select new int()` (little bit more code for context). Which brings us to LINQ usage and I had a gut feeling there might be something to exploit, but I ran out of time.

But even this was bested by 15 with: `else yield return from _ in await this where true as object is null orderby false descending select new bool()` (little bit more code for context).

And although 15 is impressive, 19 is even better. And it looks like this: `from _ in await this join __ in await value on null equals this where default as object is false orderby true descending select new bool { }` (little bit more code for context). This, at the moment, is the longest continuous Span\<blue words\> (without repetition) posted by user [porges][3]. And I think 19 is bananas. Hats off. If we ever bump into each other, beer is on me.

Anybody with way too much free time going to crack 20? ;)

[1]: {{ include "post_link" 233768 }}
[2]: https://www.reddit.com/user/CaptainAdjective
[3]: https://porg.es/