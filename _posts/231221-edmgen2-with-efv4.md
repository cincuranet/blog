---
title: |-
  EdmGen2 with EFv4
date: 2010-02-14T21:08:54Z
tags:
  - .NET
  - Entity Framework
---
[EdmGen2][1] is a nice tool. Especially if you know [EdmGen][2] you may find it useful. I.e. you may [speed up the start of you application by pregenerating views directly from EDMX file][3].

Unfortunately if you try to use it with EFv4 it will crash. But we have sources, why not to fix the problem? And that's what I did.

First problem was with new namespaces the EFv4 EDMX file has. The new ones are:

```csharp
static string csdlNamespace = "http://schemas.microsoft.com/ado/2008/09/edm";
static string ssdlNamespace = "http://schemas.microsoft.com/ado/2009/02/edm/ssdl";
static string mslNamespace = "http://schemas.microsoft.com/ado/2008/09/mapping/cs";
```

The next step is to switch the project to target .NET Framework 4, you can do it in project options. And finally check whether the references, especially System.Data.Entity.Design, where the [interesting objects][4] are, are pointing to "4.0.0.0 versions" and correct if needed.

Done. Build and use. And if you want to have it without work, grab [this file with all changes already done][5] ;).

[1]: http://code.msdn.microsoft.com/EdmGen2
[2]: http://msdn.microsoft.com/en-us/library/bb387165.aspx
[3]: {{ include "post_link" 228787 }}
[4]: http://msdn.microsoft.com/en-us/library/system.data.entity.design.aspx
[5]: http://cid-bdb67deba4c656e5.skydrive.live.com/self.aspx/Ve%c5%99ejn%c3%a9/EdmGen2^_EF4/EdmGen2^_EF4.7z