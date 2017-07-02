---
title: |-
  Force Entity Framework to optimize/simplify huge queries
date: 2009-06-13T09:27:00Z
tags:
  - Databases in general
  - Entity Framework
---
When you write huge (I mean really huge, not a ~300 lines baby) complex query you may experience, that the generated query looks (well) suboptimal. The reason is that after some line the Entity Framework will gave up on optimization and simply throws it as is. To turn this off and force to simplify it whatever query it is you can add this into your app.config, as Kati Iceva pointed in [MSDN forums][1]. 

```xml
<system.diagnostics>
  <switches>
    <add name="System.Data.EntityClient.IgnoreOptimizationLimit" value="1" />
  </switches>
</system.diagnostics>
```

But also take into account that this may end up with a significant time spent in EF's code and at the end the query will be still too big for the store to run it or the store would do better job optimize it. Thus the overall time may be same or even worse (= use carefully). 

It's also worth, if you're able to write the query a lot simpler, to discuss this in [MSDN forums][2], so the code in EF can be improved. 

[1]: http://social.msdn.microsoft.com/Forums/en-US/adodotnetentityframework/
[2]: http://social.msdn.microsoft.com/Forums/en-US/adodotnetentityframework/