---
title: |-
  Mysterious problem when fetching data
date: 2009-11-30T21:51:24Z
tags:
  - Entity Framework
layout: post
---
Sometimes you're talking about something on trainings and conferences and ... and you simply forgot about it when you use it - it's like being able to think in A > B way but not B > A.

This time it's about views in Entity Framework. If you add a view into your model, it's likely it will have a wrong key set up. Or maybe it'll be [missing][1]. And because if two records have same EntityKey, they are considered same, also skipping the very expensive materialization. I added one view into my model and didn't check the key. It was working fine, until last week, when the application started behave "differently". I checked the database and view was providing proper data. Fetching was just reading from this view, no other processing. After some serious debugging and getting wrong data, in my case all records had same values as the first one. When I switched the projection it was good. I started to think about blaming EF. And I was wrong, sorry guys in EF team. The reason was, as you might guess, wrong key setted up. My view has a key composed from three columns, but only one was used. This caused the EF during the materialization to skip other rows, because the first column was same, thus getting wrong results. Fixing the key solved the problem immediately. It's more embarrassing because if you look into the XML file, there's comment telling you to check the key, because the inferred one can be wrong.

Anyway, now I know also the B > A way, which is even better as it was my personal experience.

[1]: {% include post_link id="230207" %}