---
title: |-
  FirebirdDbComparer with Firebird 3 packages support
date: 2018-11-26T10:12:00Z
tags:
  - Firebird
  - .NET
  - .NET Core
  - Databases in general
---
It already happened on Friday, but you might have missed this release. The new version of [FirebirdDbComparer][1] was published and this version contains among small bug fixes and performance optimizations also one big new feature and that's support for packages in Firebird 3.

<!-- excerpt -->

[Packages][2] are a new feature in Firebird 3 allowing you to "group" procedures and functions into _packages_. More importantly, for me as somebody comparing databases, it decouples the definition (aka _header_ or public contract) and implementation (aka _body_ or private contract), which greatly simplifies creating, altering and dropping of these.

It was not a quick and easy feature to implement. It touched a lot of places in comparer. But eventually, thanks to the header and body separation, it clicked into the place nicely.

FirebirdDbComparer is available on NuGet, so [give it a spin][3]. The [documentation page][1] (where you can also support the project) has been also updated, listing the few really small features from Firebird 3 not fully supported yet.

[1]: /tools/firebird-db-comparer
[2]: https://www.firebirdsql.org/file/documentation/release_notes/html/en/3_0/rnfb30-psql-packages.html
[3]: https://www.nuget.org/packages/FirebirdDbComparer/