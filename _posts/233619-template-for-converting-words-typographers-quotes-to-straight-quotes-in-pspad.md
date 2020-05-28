---
title: |-
  Template for converting Word's typographer's quotes to straight quotes in PSPad
date: 2017-05-04T11:02:00Z
tags:
  - Word
  - PSPad
  - Text
  - Markdown
---
I write my posts in [Word][2], mostly. Because Word, with its superb proofing tools, it single handedly the best tool for that. But I also use [Markdown][3] to store the posts and I publish from it, because Markdown is just a plain text. The finishing touches like code pasting and YAML editing I do in [PSPad][3]. Again, because it's the editor I like and used since forever. However, I use typographer's quotes in Word. Why wouldn't it? And although I can leave these in the final text, I prefer to use straight quotes and let these be processed in Markdown to HTML transformation.

<!-- excerpt -->

Fixing these is not difficult, but any (semi)manual work can and should be automated. Recently I decided to use conversion templates in PSPad. It's there, declarative and I don't need to manage anything else.

```text
[Settings]
ForwardName=Word to Text
BackwardName=N/A

ForwardIgnoreCase=0
BackWardIgnoreCase=0

ConversionStyle=chars

[Chars]
8217=39
8220=34
8221=34
8211=45
```

The conversion table is just three (quotes only) lines in the `[Chars]` section. Rest is just a boilerplate. Besides the quotes I'm also fixing the dash character (last line).

[1]: http://www.pspad.com/
[2]: https://products.office.com/en/word
[3]: https://en.wikipedia.org/wiki/Markdown