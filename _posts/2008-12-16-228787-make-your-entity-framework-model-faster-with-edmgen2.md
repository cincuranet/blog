---
title: "Make your Entity Framework model faster (with EdmGen2)"
date: 2008-12-16T05:00:00Z
tags:
  - Entity Framework
redirect_from: /id/228787/
category: none
layout: post
---
If we'll skip exact details, we can say, that internal behavior of whole modeling and mapping is based on views (attention, we're not talking about views in i.e. SQL databases!). Mapping is compiled into bidirectional views. These views express entities in form of tables (one direction – so called query views) and tables in form of entities (other direction – so called update views). Among others these views satisfy `entity = query_view(update_view(entity))`. As you might expect, generating this views isn't simple. More important, these views are generated in runtime. So if you have big model with a lot of associations and entities, the generating can take significant time. For my test, overgrown sort of :), model with 400+ entities and 300+ associations it takes 20 seconds.

Luckily there's a solution. These views can be generated using EdmGen or [EdmGen2][1] (or your own tool). For this case I'll use EdmGen2, because the work is slightly more comfortable, because you can work directly with EMDX file.

OK, so create model of your favorite database and create pre-build action in Visual Studio and add:

```text
cd "$(ProjectDir)"
"$(SolutionDir)EdmGen2.exe" /ViewGen cs "$(ProjectDir)BigModel.edmx"
```

First row presets working directory to current project's directory, because EdmGen2 doesn't allows you to specify the name of output file (but you can change this, because sources are available). Next we'll simply call EmdGen2 with `/ViewGen` parameter and specify language and path to EDMX file. After first compilation we've got file named `<model name>.GeneratedViews.<language>`. Finally just add this file into your project and compile again.

If you'll run the application, you might notice nice surprise – it's faster. With my model the time has been shortened to 2 seconds. And of course, this depends on your model, but not bad for a simple smart calling of tool without any additional work. If you're interested in overall cost of various processes in Entity Framework, read [this][2] or [this][3], maybe [this][4]. 

<small>Originally written for [vyvojar.cz][5].</small>

[1]: {{ site.address }}{% post_url 2008-07-08-227892-edmgen-on-steroids-edmgen2 %}
[2]: http://blogs.msdn.com/adonet/archive/2008/02/04/exploring-the-performance-of-the-ado-net-entity-framework-part-1.aspx
[3]: http://blogs.msdn.com/adonet/archive/2008/02/11/exploring-the-performance-of-the-ado-net-entity-framework-part-2.aspx
[4]: http://blogs.msdn.com/adonet/archive/2008/03/27/ado-net-entity-framework-performance-comparison.aspx
[5]: http://vyvojar.cz/
