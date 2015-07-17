---
title: "TPH mapping discriminator condition from MetadataWorkspace"
date: 2010-08-25T14:07:19Z
tags:
  - Entity Framework
redirect_from: /id/231942/
category: none
layout: post
---
The [MetadataWorkspace][1] contains a lot of [useful information][2]. Recently I was facing a challenge to get information about TPH ([table per hierarchy][3]) inheritance conditions for particular type. Sure, it's in EDMX file and/or in MSL file. So you can parse the XML and get the info. I was on the other hand more interested getting the info from MetadataWorkspace, partially as a good "brain training" 8) side project.

Sadly the information about the mapping is very limited. Most interesting parts are not public, thus you're forced to use [reflection][4]. So it's a lot back and forth with, in my case, [QuickWatch][5] window. It helps a little to be familiar with MSL file structure.

```csharp
static object GetNonPublicPropertyValue(this object o, string propertyName)
{
	return o.GetType()
		.GetProperty(propertyName, BindingFlags.NonPublic | BindingFlags.Instance)
		.GetValue(o, null);
}
public static IEnumerable<KeyValuePair<string, object>> GetMappingConditions<T>(this ObjectContext context)
	where T : class
{
	string typeToSearch = typeof(T).Name;
	var mapping = context.MetadataWorkspace.GetItemCollection(DataSpace.CSSpace).First();
	return ((IEnumerable<object>)mapping.GetNonPublicPropertyValue("EntitySetMaps"))
		.SelectMany(entitySetMap => (IEnumerable<object>)entitySetMap.GetNonPublicPropertyValue("TypeMappings"))
		.Where(typeMapping =>
			((IEnumerable<dynamic>)typeMapping.GetNonPublicPropertyValue("IsOfTypes")).Any(type => type.Name == typeToSearch)
			||
			((IEnumerable<dynamic>)typeMapping.GetNonPublicPropertyValue("Types")).Any(type => type.Name == typeToSearch))
		.SelectMany(typeMapping => (IEnumerable<object>)typeMapping.GetNonPublicPropertyValue("MappingFragments"))
		.SelectMany(mappingFragment => (IEnumerable<object>)mappingFragment.GetNonPublicPropertyValue("AllProperties"))
		.Where(mappingFragment => mappingFragment.GetType().Name == "StorageConditionPropertyMapping")
		.Select(condition =>
			{
				bool? isNull = (bool?)condition.GetNonPublicPropertyValue("IsNull");
				string value = (string)condition.GetNonPublicPropertyValue("Value");
				return new KeyValuePair<string, object>((string)((dynamic)condition.GetNonPublicPropertyValue("ColumnProperty")).Name, (isNull.HasValue ? (object)isNull.Value : (object)value));
			});
}
```

Because the code is heavily using reflection and non public members, it's possible it'll not work other/future versions of Entity Framework. I tested it with current version, version 4.

It's written in a compact way. If you want to further dig into partial results, I recommend to split it into `foreach` loops and do small steps. That's in fact how I started and was incrementally discovering the information available at given level.

As all the data are not public, I'll not describe how and why it is as it is. I did it using trial and error process. :) Maybe there's other/simpler path. Feel free to use comments if you find one.

[1]: http://msdn.microsoft.com/en-us/library/system.data.metadata.edm.metadataworkspace.aspx
[2]: {{ site.url }}{% post_url 2009-06-14-230583-metadataworkspace-in-entity-framework %}
[3]: http://msdn.microsoft.com/en-us/library/bb738443.aspx
[4]: http://en.wikipedia.org/wiki/Reflection_(computer_science)
[5]: http://msdn.microsoft.com/en-us/library/cyzbs7s2.aspx