---
title: |-
  .NET DeveloperDays 2025
date: 2025-10-10T07:13:00Z
tags:
  - Presentations & Speaking
---
We're close to that time of year - time of [.NET DeveloperDays][1] in Warsaw. I'm really excited to be there, so let's talk about what you can listen to from me.

<!-- excerpt -->

I prepared a workshop and quite a few sessions.

Workshop is _Build your AI application(s) with .NET_.

> This workshop is aimed to get you started with all the things AI and .NET. We'll cover classification, summarization, data extraction/cleaning, anomaly detection, translation, sentiment detection, semantic search, Q&A chatbots, voice assistants, and more.

> You don't need prior knowledge of AI technology. We'll focus on the usage of AI services, including LLMs and embeddings, to implement app features such as those listed above. This includes understanding capabilities, limitations, problems, and risks. We'll focus a lot on optimizing for reliability.

Sessions are _Optimize your EF Core update actions_, _SynchronizationContext and ConfigureAwait - more than you need to know_, _The rabbit hole of building a GPS-synchronized time server_.

> Everybody optimizes queries. Boring. But there's a big chunk of applications where updates (inserts, deletes) are as common as queries and need to perform well. This session will show you what you can (and shouldn't) do to make it happen.

> ConfigureAwait(false) is a little dark magic in .NET. Together with SynchronizationContext it's often misunderstood and incorrectly used. In this session we'll build strong understanding what's really going on and we'll then apply it to every day async/await work.

> Accurate and reliable time underpins everything from secure communications to distributed systems, yet most of us take it for granted. What starts as a seemingly simple idea - "Why not just build my own Stratum 1 time server?" - quickly turns into a deep dive through layers of hardware quirks, signal integrity issues, and the unexpected joys of GNSS modules. In this talk, we'll explore the journey of building a GPS-synchronized NTP/NTS server: from choosing receivers and handling PPS signals, tuning operating systems, and ensuring long-term stability. Along the way, you'll hear about pitfalls, lessons learned, and the surprising complexity behind something as "simple" as keeping the right time.

[1]: https://developerdays.eu/warsaw/