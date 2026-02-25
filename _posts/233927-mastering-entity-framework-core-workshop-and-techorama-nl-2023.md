---
title: |-
  Mastering Entity Framework Core workshop and Techorama (NL) 2023
date: 2023-09-24T07:00:00Z
tags:
  - Presentations & Speaking
---
After the [Belgium version][1] Techorama is going to Netherlands, in October 9-11. 

I'll deliver [workshop][2] called _Mastering Entity Framework Core_ - basically in something like 8 hours I'll try to teach you Entity Framework Core all the way into "monk" level. It will be a lot of stuff, but also lot of fun.

Besides the workshop, I'll also have two sessions _Autoincrement (identity) is not the only option for primary keys_ and _What's new in Entity Framework Core 7_ (abstracts below).

<!-- excerpt -->

For the workshop you can read more about the workshop (and me) [here][2]. We'll cover topics like:

* Database and provider configuration
* Creating and configuring model
* Inheritance, table splitting, keyless entities, shadow properties, shared entitites, owned types, converters, comparers, ...
* Lazy loading, split queries, custom SQL queries
* Custom mapping and custom functions
* Change tracking, ID generation, transactions, concurrency, batching
* Services configuration and implementing your own

But this just a subset of topics. Depending on questions (and time), we can (and very likely will) steer one way or the other.

> A lot of applications is using "simple" autoincrement (identity) as a primary key. That's not bad. But there are other options for generated primary keys and some might be even better for your application. I'll show you some options, pros and cons and even apply that as a mapping for EF Core.

> A lap around new features and performance improvements in Entity Framework Core 7.

Hope to see you on my workshop or my sessions.

{{ include "attachment" page "EFCore_Ids.pdf" "Slides - Autoincrement (identity) is not the only option for primary keys" }}

{{ include "attachment" page "efcore7.pdf" "Slides - What's new in Entity Framework Core 7" }}

{{ include "attachment_link" "https://github.com/cincuranet/TechoramaNL2023-EFCore-Workshop" "Workshop" }}

[1]: {{ include "post_link" 233919 }}
[2]: https://techorama.nl/workshops/mastering-entity-framework-core/