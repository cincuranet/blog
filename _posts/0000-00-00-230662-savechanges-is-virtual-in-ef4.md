---
title: |-
  SaveChanges is virtual in EF4
date: 2009-06-30T20:50:08Z
tags:
  - Entity Framework
layout: post
---
I don't know whether I just noticed this too late, but the [SaveChanges][1] method in upcoming EF4 is virtual. This is a great small change.

You can generate (if you're using T4 templates for generating) your own SaveChanges method and do some work there. Well, before actions can be done using [SavingChanges][2] event, i.e. [validation like in this example][3]. But for after actions, there's no SavedChanges event (neither in EF4). Hence adding some code into this method is very handy. For example logging actions performed is super easy.

This small change opens up new ways of thinking about SaveChanges usage.

The method also have new [SaveOptions][4] parameter. As it's enum we can expect adding more options in future versions.

[1]: http://msdn.microsoft.com/en-us/library/dd395500(VS.100).aspx
[2]: http://msdn.microsoft.com/en-us/library/system.data.objects.objectcontext.savingchanges.aspx
[3]: {% post_url 0000-00-00-229056-onvalidate-like-validation-in-entity-framework %}/
[4]: http://msdn.microsoft.com/en-us/library/system.data.objects.saveoptions(VS.100).aspx