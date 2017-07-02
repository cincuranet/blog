---
title: |-
  Closing Visual Studio solution and deleting the code (extension)
date: 2017-03-20T10:22:00Z
tags:
  - Visual Studio
---
During my day and over a week I fire Visual Studio countless times. Well over half of these is because I need to test something, prototype some idea, try some API or library and so on. This is really throw away code that survives only one opening (OK, maybe few times I go back to this code later in the day/week). It's basically this flow: Open Visual Studio, create new application, write some code, close Visual Studio, delete the folder. Especially the last two steps seemed very tedious last, well, years. Thus I decided to do something with it.

<!-- excerpt -->

I decided to write an extension for Visual Studio to help me automate these last two steps. Since Visual Studio 2005 I wrote less than five "VSIXes" (Roslyn analyzers excluded), so it was a good experience as well. The extension is called _CloseAndDelete_ and you can [download][1] it from Visual Studio gallery.

It's stupidly simple. It adds new _Close and Delete Solution_ item into _File_ menu of Visual Studio. After clicking it, and confirming prompt, the current solution will be closed and the whole solution folder will be deleted. Nothing more, nothing less. The default shortcut is `Alt+4, Alt+4`, similar to `Alt+F4` to quickly close Visual Studio if wanted.

You can see it in action here (yes, it's an animated gif :)):

![CloseAndDelete]({% include post_ilink, post: page, name: "close_and_delete.gif" %})

I tested it on Visual Studio 2017, because that's what I have and use. Feel free to test it on previous versions and submit PR (fixing bugs is welcome as well ;)), the [complete code is on my GitHub][2].

By the way the nice icon comes from [ButterflyTronics][3].

[1]: https://marketplace.visualstudio.com/vsgallery/ba7029c3-3719-4533-862a-b6de3c85eee0 
[2]: https://github.com/cincuranet/CloseAndDelete
[3]: http://butterflytronics.eu/icons.php