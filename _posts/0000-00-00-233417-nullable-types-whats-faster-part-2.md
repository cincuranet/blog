---
title: |-
  Nullable types - what's faster? - part 2
date: 2013-09-23T12:07:00Z
tags:
  - .NET
---
Years ago I wrote post [Nullable types - what's faster?][1] at that time on .NET FW 3.5. Today I came across post [Hrátky s Nullable typy][2] which is related to my old post. That made me thinking about the test again and how it's the state today.

<!-- excerpt -->

So I redid the test. This time on .NET FW 4.5 and directly on Intel Core i7 on my laptop not in VPC. Again build with full optimizations turned on and debugger not attached. I also instead of using `short?` used `int?` because I think it's datatype that we, developers, use most often. I did couple of runs (about 100) removing some values that were obviously off and I also checked the generated IL, because that's pretty closely estimates what's actually going on.

1. `HasValue` vs. `!= null`  
No difference in time (all times in a margin of error) and also the IL code is same.

2. `Foo.Value` vs. `(int)Foo`  
No difference in time (all times in a margin of error) and also the IL code is same.

I don't know whether the C# 5.0 compiler now generates new (better) code or the old results were skewed because of some other influence (i.e. running on different machine (VPC actually)). But it probably doesn't matter. Important is the code is same and you don't have to think how to write it (although it's a micro-optimization, probably premature). Write what you like more. :)

If you have different results use comments and tell us (with some details about environment).

[1]: {% include post_link id="228522" %}
[2]: http://www.dotnetportal.cz/blogy/3/Tomas-Herceg/1965/Hratky-s-Nullable-typy