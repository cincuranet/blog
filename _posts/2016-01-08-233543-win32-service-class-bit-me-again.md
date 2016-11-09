---
title: "Win32_Service bit me again"
date: 2016-01-08T14:51:00Z
tags:
  - Best practice or not?
  - Windows
layout: post
---
[When I wrote few weeks ago about my gotcha with `Win32_Service`][1] little I knew it is a journey to begin. Here's next part.

<!-- excerpt -->

After previous trip to wonderland I was taking extra caution when doing anything with types. But this time I faced, ..., different values for the same parameters. Let's explore the `StartMode` parameter. When you use [`Create`][2] you can use `Automatic` as a value (among others) based on the documentation. One might expect the same value when reading this parameter from instance, right? Even the values in [documentation][3] look the same. Well, almost. Our particular value there is `Auto` not `Automatic`. Go figure.

I have a feeling this is not the last confusion I'll face.

[1]: {% post_url 2015-12-18-233538-win32-service-class-and-the-types %}
[2]: https://msdn.microsoft.com/en-us/library/windows/desktop/aa389390(v=vs.85).aspx
[3]: https://msdn.microsoft.com/en-us/library/windows/desktop/aa394418(v=vs.85).aspx