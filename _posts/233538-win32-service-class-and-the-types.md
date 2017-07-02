---
title: |-
  Win32_Service class and the types
date: 2015-12-18T12:38:00Z
tags:
  - Best practice or not?
  - Windows
---
This is a story about a class named `Win32_Service` and the types. Types we all like (or hate, doesn't matter in this case :)). And the WMI.

<!-- excerpt -->

I needed to create a Windows Service from my code and I eventually ended using WMI. The [`Win32_Service`][1] has a method [`Create`][2] with appropriate parameters. Nothing to see here. Or is it?

Look at, for example, `ServiceType` or `ErrorControl`. These are of type `uint8`. Sounds good. Just get the values from the list in documentation and you're done. Then you try to load `Win32_Service` in other part of your code and you want to check these values. Boom. The casting fails. Checking the `Win32_Service` again you'll find that these parameters there are plain `string`. What?

Yup. Pretty confusing. I was not expecting that. I'd really like to know the reason for that...

> [Related story.][3]

[1]: https://msdn.microsoft.com/en-us/library/windows/desktop/aa394418(v=vs.85).aspx
[2]: https://msdn.microsoft.com/en-us/library/windows/desktop/aa389390(v=vs.85).aspx
[3]: {% include post_link, id: "233543" %}