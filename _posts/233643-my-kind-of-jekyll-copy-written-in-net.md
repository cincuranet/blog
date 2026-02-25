---
title: |-
  My kind of Jekyll copy written in .NET
date: 2017-08-30T08:11:00Z
tags:
  - Ruby
  - Jekyll
  - C#
  - .NET
  - Hugo
  - Pelican
---
Last couple of years I published this blog using [Jekyll][1]. Static pages are hard to beat in performance and security. Initially on GitHub pages, then [GitLab Pages][3] and eventually moving to [Azure][4]. Mainly because thanks to `web.config` I have more control over the webserver (IIS) and I can do bit more (in fact quite a lot). But lately I started to be more and more tired of Jekyll. It was slow for me and given it's a Ruby application and me not being fan nor fluent of Ruby it started to add up. For maybe a year I looked multiple times at [Hugo][5], because it was an obvious choice, and didn't liked the templating structure. Also at [Pelican][6], because it's written in Python and I like Python. Not sure why, but I didn't convert to it. And I also played multiple times with the idea of writing something myself, just to dismiss that idea hundred times because I knew I would trap myself in constantly fiddling with it and burning my free time.

<!-- excerpt -->

As you can probably tell by the title of this post I eventually failed. I took what I liked on Jekyll, the way the files are organized (basically no predefined structure), Liquid (quite simple), YAML front matter and decided to rewrite (only) the behavior I'm using (i.e. I don't use pagination, so why bother) in a single push (mostly). My goal was to get the same output, get it faster and maybe get some properties I was originally computing in Liquid from code directly because I can (and hence gain some speed). All in .NET to not have to bother with Ruby.

The result is my [_RenderBlog_ program][7]. I named it in such a way that the first letters of words are `r` and `b`, as a connection back to Jekyll and Ruby. Silly me.

The code is horrible. I mean really horrible. I wrote it in one go (mostly) and didn't bother with structuring, refactoring or cleanup let alone documetation, sticking to my resolution to not burn crazy amount of time on it. It is glued together using [Markdig][8] (with custom behavior for _SmartyPants_) to render Markdown files, [DotLiquid][9] for templates and [SharpYaml][10] to process YAML in front matter. Rest is having properties I need and spitting output.

Feel free to use it, improve it, ... I don't have any plans personally to make it useful outside what I need. Thus, its future will be purely in contributions.

[1]: http://jekyllrb.com/
[2]: https://pages.github.com/
[3]: https://about.gitlab.com/features/pages/
[4]: https://azure.microsoft.com/
[5]: http://gohugo.io/
[6]: https://blog.getpelican.com/
[7]: https://github.com/cincuranet/RenderBlog
[8]: https://www.nuget.org/packages/Markdig/
[9]: https://www.nuget.org/packages/DotLiquid/
[10]: https://www.nuget.org/packages/SharpYaml/