---
title: |-
  Using national character sets with .NET Core (and FirebirdClient)
date: 2017-10-05T14:24:00Z
tags:
  - .NET Core
  - .NET Standard
  - Firebird
---
If you want to use any national characters set (i.e. `windows-1250`) on .NET Core, thus also with FirebirdClient, you need to do some extra steps.

<!-- excerpt -->

First you need to install [`System.Text.Encoding.CodePages` package][1], but that's not enough. You then need to call `Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);` before you plan to use new encodings. In case of _FirebirdClient_ before using i.e. `FbConnection` (or related classes).

Without this your selection is limited (_UTF-8_, _US-ASCII_, _UTF-16[BE]_ to name a few).

[1]: https://www.nuget.org/packages/System.Text.Encoding.CodePages/