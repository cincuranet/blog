---
title: |-
  Error "Could not load type 'System.Runtime.CompilerServices.ExtensionAttribute' from assembly 'mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089'." on .NET 4.0/.NET 4.5
date: 2012-11-23T13:35:35Z
tags:
  - .NET
  - Firebird
layout: post
---
This error isn't related only to [FirebirdClient][1] only, but any .NET application that is targeting multiple .NET Framework versions, but I spotted it first during FirebirdClient development.

The error message `Could not load type 'System.Runtime.CompilerServices.ExtensionAttribute' from assembly 'mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089'.` is little bit cryptic. Let me explain how all this mess happened. The .NET 4.5 is in-place update of .NET 4.0. So a lot of stuff looks like it's .NET 4.0, but it's not. It's .NET 4.5. One change Microsoft did in .NET 4.5 was moving the `ExtensionAttribute` into `mscorlib` (so they can use extension methods in `mscorlib`). So if you build application targeting .NET 4.5 and it uses just plain .NET 4.0 (or even older) it runs fine. You're fine, user is fine. Until it hits some extension method. Then it tries to locate the above mentioned attribute, but from `mscorlib`. On .NET 4.0 it's not there. Even if the version says `4.0.0.0`. Yeah, in-place update.

Problem is, that users (even some developers) are not aware of these minor changes. And because the application runs - at least a while - it's confusing. :/ The bottom line is - always download/use exact .NET Framework version version of the application/library.

[1]: http://firebirdsql.org/en/net-provider/