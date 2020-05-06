---
title: |-
  Interpolated verbatim string in C# 8
date: 2019-01-18T16:01:00Z
tags:
  - C#
---
As I was talking [yesterday about new big features in C# 8][1], I learned about a small feature coming to this version as well that simplifies usage of interpolated verbatim strings.

<!-- excerpt -->

Today, if you want to use interpolated verbatim string, you have to place the `$` and `@` in proper order. So, this `$@"test {DateTime.UnixEpoch}"` works, while `@$"test {DateTime.UnixEpoch}"` doesn't (Wondering about `DateTime.UnixEpoch`? Look [here][3].). I was always kind of OK with it. In my mind I explained to myself that the `@` defines how the content inside double quotes behaves, it's a modifier of the double quotes and hence needs to in front of the opening one. While the `$` is like `new FormattableString` (I know it's an _abstract_ class, but there's a `FormattableStringFactory` if you'd really like to create it manually), which obviously needs to be first.

But having to type it in correct order was apparently pain in the ass and so in C# 8 the order will not matter. You can try that in i.e. preview of VS 2019 or [here][2].

![interpolated verbatim string in VS 2019 Preview]({{ include "post_ilink" page "string.gif" }})

##### Update

Visual Studio 2019 starting with Preview 2 contains auto-fixer to replace `@$"` with `$@"`.

[1]: {{ include "post_link" 233761 }}
[2]: https://sharplab.io/#v2:EYLgtghgzgLgpgJwDQxAN0QSwGYE8A+AAgAwAEhAjANwCwAUPQHYRhxQAOEAxnKQMowEmRgHMAcizace9AN71Si8gCZyFAOwKl8ukr1qAbOQAspALIRhACkrEA2gF1SEBCKgBKLftI7v3tC6kUBSkALzkhAAkAETwsHIAIhDwACqYrAB0ZsIAahAANgCucAC+0bS6fnoBCEGq4ZGEhLFsMInJcGmZ2Yx5RaXlXvolQyN0Y0A
[3]: {{ include "post_link" 233755 }}