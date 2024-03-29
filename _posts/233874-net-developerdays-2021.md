---
title: |-
  .NET DeveloperDays 2021
date: 2021-09-15T06:50:00Z
tags:
  - Presentations & Speaking
---
It's again that time of the year when my favorite conference is about to happen. Yep, it's [.NET DeveloperDays][2] time (and planned as in-person, yay!). You still have about a month to register and you should. I'll have both the workshop and two sessions in main conference.

<!-- excerpt -->

Let's first talk about the workshop. I called it [_Learn Entity Framework Core in 1 day_][1] and really during one heck of a day, I'll show you 90% of Entity Framework Core's features. Crazy amount of model customization, understanding and more. Go check the [detailed description][1] and register. I promise, you'll not regret it. At the end of the day, we all will be happy to sit with a beer and cool our heads.

For the main conference I prepared three sessions. First is _Performance with Span<T> for dummies (should I care?)_, other is _How I put .NET into Firebird database engine_ and last is _What's new in Entity Framework Core 6_.

> Span<T>, although not exactly brand new, is still new kind on the block. In this session I'll show you what the Span<T> (and Memory<T>) is, how it works and the concepts behind. All explained using plain simple C# constructs.

> Firebird is a database engine similar to MS SQL, Postgres, DB2 and others. Since version 3 it also allows writing plugins. I took this capability and put .NET into it. It allows you to write stored procedures, functions, ... in .NET and have all this code executed in the context (address space, transaction, ...) of database engine. In this session I'll describe what hurdles I had to overcome, how I did it and how I'm hunting best possible performance.

> Entity Framework Core 6 is part of .NET 6, first LTS version after the convergence of "Core" and "Framework". It should be better than previous versions, including Entity Framework 6. Is that the case? What's new there? Are these features worth it?

Fingers crossed the situation will not change and you and I will enjoy the conference as planned.

{{ include "attachment" page "EFCore6.pdf" "Slides - What's new in Entity Framework Core 6" }}

{{ include "attachment" page "EFCore6_demos.7z" "Demos - What's new in Entity Framework Core 6" }}

{{ include "attachment" page "Span.pdf" "Slides - Performance with Span<T> for dummies (should I care?)" }}

{{ include "attachment" page "Span_demos.7z" "Demos - Performance with Span<T> for dummies (should I care?)" }}

{{ include "attachment" page "fbnee.pdf" "Slides - How I put .NET into Firebird database engine" }}

{{ include "attachment" page "fbnee_demos.7z" "Demos - How I put .NET into Firebird database engine" }}

{{ include "attachment" page "Workshop.7z" "End of the day code - Learn Entity Framework Core in 1 day" }}

[1]: https://net.developerdays.pl/learn-entity-framework-core-in-1-day/
[2]: https://net.developerdays.pl/