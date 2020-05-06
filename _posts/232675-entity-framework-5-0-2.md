---
title: |-
  Entity Framework 5.0!
date: 2012-01-15T10:23:32Z
tags:
  - .NET
  - Entity Framework
  - Entity SQL
---
[Yesterday I wrote a post about a possible confusion that might be introduced with new version being version 5.0][1]. [Diego Vega][2] wrote a [follow up post][3] describing the rationale behind it (and it was also noted in comments in previous post). Simply the team is now sticking to [semantic versioning][4] no matter what. Hope that will last a while. Let me recap.

The first version was, hey, version 1. The second version was version 4, because the numbering being unified with .NET Framework. Then there was a bunch of CTP, vNext, Preview, Alpha/Beta versions something being just update with version 4 core, something with new core. Hard to track what was what. Decision to use semantic versioning was made and the numbering was cleared a little, simply to 4.x and whatever version comes next. Still on track? Because of the semantic versioning rules, the next version is going to be 5. I thought the previous versioning decision would take precedence (though I think the .NET Framework version could be 5.0 as well) and it will be 4.5 as well.

I was wrong. The semantic versioning is now the way Entity Framework is going no matter what. Good. Hope the third version will be still using this scheme and will be version 6.

So. Next version is going to be version 5(.0.0) and will be delivered with .NET Framework 4.5.

[1]: {{ include "post_link" 232666 }}
[2]: http://blogs.msdn.com/b/diego/
[3]: http://blogs.msdn.com/b/diego/archive/2012/01/15/why-entity-framework-vnext-will-be-ef5-and-nothing-else.aspx
[4]: http://semver.org/