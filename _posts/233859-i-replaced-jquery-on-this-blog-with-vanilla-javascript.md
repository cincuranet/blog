---
title: |-
  I replaced jQuery on this blog with vanilla JavaScript
date: 2021-04-26T06:43:00Z
tags:
  - JavaScript
  - Blog
  - jQuery
---
Over maybe last two years or so, I've been reading with interest primarily [@alesroubicek's][1] tweets, where he disregarded (with good arguments) all the all-encompassing JavaScript frameworks and libraries. And then out of nowhere last week, I decided to try to remove jQuery from this blog. Simply to have a personal experience with doing stuff in vanilla JavaScript.

<!-- excerpt -->

I'm not (and don't want to be) a JavaScript or front-end developer (if it's not obvious). JavaScript usage here on this blog, is purely some convenience functionality, nothing fancy.

Also, I'm not saying I was having trouble with jQuery. In fact, I'm not skilled enough to make a good decision about that. But it always felt, that especially for my usage - roughly 100 lines of convenience functionality - jQuery was too heavy. But I was also worried that doing the same stuff in vanilla JavaScript is going to be too much hassle.

I was wrong (and [@alesroubicek][1] was right). First the JavaScript language today, from purely language constructs point of view, is fairly fine. For example, `for-of` loop, lambdas/arrow functions and `await`/promises make the code feel like something ... expected.

Using `querySelectorAll` or `querySelector` was as easy as with jQuery (with some minor adjustments), manipulating the CSS, styles and attributes felt maybe even nicer in vanilla JavaScript. And sometimes I even simplified the code by discovering new methods available exactly for what I needed - like `scrollIntoView`.

Refreshing from something I still had mental picture of from Internet Explorer 6 and MooTools days. Yes, I know, I'm late to the party and I should have checked the JavaScript world around me at least once in five years.

What took perhaps most of the time was finding a new lightbox for images, etc., because the one I was using was using jQuery. After scouting about 10 and trying roughly 5, I ended up using [_simpleLightbox_][2]. Works for what I need and is not bloated with stuff I don't use.

The complete change with previous and new code side-by-side is [here][3]. One thing I didn't do, but wanted to, was wrapping the code into `class`. I can't comprehend why I need to use `this` when calling instance method from another instance method. 

It pleasantly surprised me how painless the process was. And I'm happy to have a bit lighter pages on this blog.

[1]: https://twitter.com/alesroubicek
[2]: https://github.com/dbrekalo/simpleLightbox
[3]: https://github.com/cincuranet/blog/commit/e1ba1706f8df09c5c11b5c474a28954f5cf9d453#diff-e6b8baafdc5a799e8e3580f956573a27875254e194960255791c2e0ceec0ba12