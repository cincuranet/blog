---
title: |-
  UnixEpoch field in DateTime and DateTimeOffset in .NET Standard 2.1 (and .NET Core 2.1)
date: 2018-11-14T08:52:00Z
tags:
  - .NET Core
  - .NET Standard
---
When I need to put some default value somewhere, I often use Unix epoch. It's more reasonable, in my eyes, than [`DateTime.MinValue`][1]. But there's no field for that value thus I always had to create it "manually". Well, not anymore. 

<!-- excerpt -->

Let's first do a small recap what a Unix epoch is. The Unix epoch is date and time from which Unix (and other related systems) count time and date (usually by number of seconds elapsed). It's `1970-01-01T00:00:00Z`.

I like the value because it's reasonable date, yet for a lot of line-of-business systems it's clear that this is not a real value. Hence, I often used it, but because there was no field for it, I had to create it always myself. I.e. by using `new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)`. But starting with .NET Core 2.1 and more importantly for me as a library writer with .NET Standard 2.1 it's available as a predefined field for both [`DateTime`][2] as well as [`DateTimeOffset`][3].

Now to just wait for .NET Standard 2.1 to become "the norm". 

[1]: https://docs.microsoft.com/en-us/dotnet/api/system.datetime.minvalue?view=netcore-2.1
[2]: https://apisof.net/catalog/System.DateTime.UnixEpoch
[3]: https://apisof.net/catalog/System.DateTimeOffset.UnixEpoch