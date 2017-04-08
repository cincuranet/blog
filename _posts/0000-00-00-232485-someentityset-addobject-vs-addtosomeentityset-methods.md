---
title: |-
  SomeEntitySet.AddObject vs. AddToSomeEntitySet methods
date: 2011-08-12T12:33:45Z
tags:
  - Entity Framework
layout: post
---
Is it better to call `ObjectContext.SomeEntitySet.AddObject()` or `ObjectContext.AddToSomeEntitySet()`? Short answer is: It doesn't matter.

Long answer. The AddToSomeEntitySet method calls `base.AddObject("SomeEntitySet", someEntitySet);`, you can see it from generated code. The other method calls `base.Context.AddObject(this.FullyQualifiedEntitySetName, entity);`. Hence it's almost the same. Only difference is in `FullyQualifiedEntitySetName` property that is used. So it _might_ be little bit slower, but I think it's unmesurable difference. Also take into account other parts of your application, honestly, where you're probably wasting more time.  8-)

_What's your preferred call?_