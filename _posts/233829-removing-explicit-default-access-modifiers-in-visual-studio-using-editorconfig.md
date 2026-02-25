---
title: |-
  Removing explicit default access modifiers in Visual Studio using EditorConfig
date: 2020-06-02T04:12:00Z
tags:
  - C#
  - .NET
  - Visual Studio
---
Almost five years ago I wrote post [_Removing explicit default access modifiers (Roslyn analyzer and codefix)_][1] and it was a great exercise and I still prefer to have code without all the `private`, etc. noise. But also nowadays [Visual Studio supports all sorts of code style rules via EditorConfig file][2]. Can I teach Visual Studio to actually suggest removing explicit default access modifiers?

<!-- excerpt -->

I was expecting it to require bit of persuasion, but instead it was smooth sailing. The key for EditorConfig is called `dotnet_style_require_accessibility_modifiers` and simply setting it to `omit_if_default` (probably `omit_if_default:suggestion`) does all the magic. 

Although it works fine, it's clear that using this setting is not exactly expected in terms of what Visual Studio tells you you should do. :)

First, in hint, it tells you "Accessibility modifiers required". 

![Accessibility modifiers required]({{ include "post_ilink" page "suggestion1.png" }})

And then, when you invoke the code fix, it calls the action "Add accessibility modifiers". Which is actually exactly the opposite of what is going to happen.

![Add accessibility modifiers]({{ include "post_ilink" page "suggestion2.png" }})

But I take it. Similar to the preference between spaces and tabs, not using the explicit default access modifiers is niche choice in .NET world, as far as I can tell. And this is easier than introducing [the analyzer][1] into the project(s) (and potentially maintaining it).

Probably [Miguel de Icaza][3] and I should start a gang.

[1]: {{ include "post_link" 233535 }}
[2]: https://docs.microsoft.com/en-us/visualstudio/ide/create-portable-custom-editor-options?view=vs-2019
[3]: https://twitter.com/migueldeicaza/status/8403500450