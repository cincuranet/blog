---
title: |-
  Dirty HTML to Markdown converter code
date: 2015-08-05T14:21:00Z
tags:
  - C#
  - .NET
  - Markdown
---
Few weeks ago I decided to convert some old posts on this blog to [Markdown][1] as the rest. These posts were eight, ten years old, sometimes with code formatting with good old `<font>` tags. :) Not a pretty markup. After starting manually and realizing it would take me probably half a year I decided to help myself by code.

<!-- excerpt -->

The code below is not perfect nor converts every possible HTML to Markdown. It's a piece I wrote to help me with most cases I knew I had and the rest was done manually. Whatever it doesn't convert stays in HTML and it's up to you to finish it. Actually even the resulting Markdown might need some minor formatting tweaks.

I was just felt sorry to throw it away :) so I'm archiving it here.

```csharp
var lines = textBox1.Lines.AsEnumerable();
lines = lines.Select(l => l.TrimEnd().Replace("\n", string.Empty).Replace("\r", string.Empty)).Where(l => l != string.Empty);
lines = lines.Select(l => l.Replace("<p>", string.Empty).Replace("</p>", Environment.NewLine));
lines = lines.Select(l => l.Replace("<code>", "`").Replace("</code>", "`"));
lines = lines.Select(l => l.Replace("<em>", "_").Replace("</em>", "_"));
lines = lines.Select(l => l.Replace("<i>", "_").Replace("</i>", "_"));
lines = lines.Select(l => l.Replace("<strong>", "**").Replace("</strong>", "**"));
lines = lines.Select(l => l.Replace("<b>", "**").Replace("</b>", "**"));
lines = lines.Select(l => Regex.Replace(l, "<pre class=\"brush:(.+?)\">", "```$1").Replace("</pre>", "```" + Environment.NewLine));
lines = lines.Select(l => Regex.Replace(l, "<img src=\"(.+?)\".*?/?>", "![image]($1)"));
var danglingLinks = new List<string>();
lines = lines.Select(l =>
{
	return Regex.Replace(l, "<a href=\"(.+?)\"\\s*>(.+?)</a>", m =>
	{
		danglingLinks.Add(m.Groups[1].Value);
		return string.Format("[{0}][{1}]", m.Groups[2].Value, danglingLinks.Count());
	});
});
lines = lines.Concat(danglingLinks.Select((e, i) => string.Format("[{0}]: {1}", i + 1, e)));
textBox2.Lines = lines.Select(WebUtility.HtmlDecode).ToArray();
```

What helped me most was the links conversion (I'm using and producing reference-style links). That saved quite some typing and copy-pasting. And of course HTML unescaping (mostly in the code parts).

Use and tweak it as much as you want.

[1]: https://en.wikipedia.org/wiki/Markdown