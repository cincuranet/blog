---
title: |-
  Is Entity Framework Code First really third distinct option?
date: 2011-05-18T17:05:46Z
tags:
  - Entity Framework
---
In a lot of articles the [Entity Framework's 4.1 Code First][1] is described as third option to the already available so called Database First and Model First paths. But I'm not sure, it's really a third distinct path. At least it's not so clear.

Let's describe what Database First means. You simply create a model by reverse engineering your current database. Then you can tweak the conceptual part and do the development. You're not limited to work with generated classes, [POCO][2]s work too. Your model is described as XML file(s) (often in one file with [EDMX extension][3]).

The Model First goes the other way. You start with blank designer surface and at some time generate the SQL script to create database based on what's on the surface. Of course you can use POCOs here as well. The model is stored in XML file, same as in Database First scenario.

But what the Code First does? Focusing only on important differences, it only allows you to save model as code (in any language being able to produce [MSIL][4]). Really. The only difference is the model representation, to be precise the mapping and kind of [SSDL][5].

There's no explicit conceptual part. You already have it. It is the objects you created - either generated or manually written both POCOs or derived from [EntityObject][6] class. The mapping and also the store model is described with your code. [EntityTypeConfiguration][7], [ComplexTypeConfiguration][8] etc. classes directly or indirectly written. Also part of mapping could be inferred if you're using [conventions][9]. And ultimately you can point this to an existing database or let the Entity Framework [create it for you (or the SQL script)][10]. That's when the database initializers (and providers) come to play.

[Julia Lerman created a nice decision chart][11] if you're not sure what way to go. But in my eyes the only decision to make is whether you want to have everything in .NET code or in XML (and in fact, in runtime both approaches will create same in-memory representation).

* Existing database & code ? Code First
* Existing database & XML ? Database First
* New database & code ? Code First
* New database & XML ? Model First

See. So I think it's more 2x2 options (and Code First being able to do two tasks) and we might call it: Code Database First, Code Model First, EDMX Database First and EDMX Model First or Database First with Code, Model First with Code, Database First with EDMX and Model First with EDMX. :)

[1]: http://blogs.msdn.com/b/adonet/archive/2011/03/15/ef-4-1-code-first-walkthrough.aspx
[2]: http://en.wikipedia.org/wiki/Plain_Old_CLR_Objec
[3]: http://msdn.microsoft.com/en-us/library/cc982042.aspx
[4]: http://en.wikipedia.org/wiki/Common_Intermediate_Language
[5]: http://msdn.microsoft.com/en-us/library/bb399559.aspx
[6]: http://msdn.microsoft.com/en-us/library/system.data.objects.dataclasses.entityobject.aspx
[7]: http://msdn.microsoft.com/en-us/library/gg696117(v=vs.103).aspx
[8]: http://msdn.microsoft.com/en-us/library/gg696149(v=vs.103).aspx
[9]: http://msdn.microsoft.com/en-us/library/system.data.entity.modelconfiguration.conventions.iconvention(v=vs.103).aspx
[10]: {% include post_link, id: "232358" %}
[11]: http://thedatafarm.com/blog/data-access/model-first-database-first-or-code-first-ndash-update-to-data-points-column/