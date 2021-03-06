---
title: |-
  Mapping and metadata information could not be found for EntityType (InvalidOperationException)
date: 2010-04-22T20:17:02Z
tags:
  - Entity Framework
---
I updated my pretty big model today. Added absolutely simple table, no foreign keys, basic datatypes, simple PK. When I was calling [CreateObjectSet][1]<T> what a surprise - InvalidOperationException saying "Mapping and metadata information could not be found for EntityType". That's not so much descriptive.

Quick search thru internet resulted in suggestion that I'm missing some property in my POCO classes. I was not. I double checked it and I know that Entity Framework throws [MetadataException][2] listing all the missing properties (yep, I was there too, but it's easy to fix). Another reason I found was that the metadata are not placed into resources or things are screwed up because of mixing two models in one project (to be clear, it is possible, but you have to carefully design your namespaces and names). Not the case either. I have only one model, metadata are there properly, other entity sets were working fine.

After loosing my mind slightly I found, rejected and then believed back again that it's true, that you have misspelled property. I first rejected the idea because it was mixing the misspelled property and missing property together. And I knew about the MetadataException case. But the misspelled property actually results in InvalidOperationException exception with useless message.

Hopefully you'll believe this (or any other solution found) faster than I did. :)

[1]: http://msdn.microsoft.com/en-us/library/dd382944.aspx
[2]: http://msdn.microsoft.com/en-us/library/system.data.metadataexception.aspx