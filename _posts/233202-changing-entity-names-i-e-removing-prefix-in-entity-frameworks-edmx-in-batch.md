---
title: |-
  Changing entity names (i.e. removing prefix) in Entity Framework's EDMX in batch
date: 2013-03-21T08:17:12Z
tags:
  - .NET
  - Entity Framework
  - Visual Studio
---
Few years back I wrote a similar post [Making names of entities (or any identifiers) in Entity Framework model "code and developer friendly" (= not uppercase)][1], but as the time goes, it's now little bit outdated. But yesterday [Julie Lerman][2], while trying to find solution for one particular question, dug it out. As I was also then introduced to problem the solution there was indeed a good way to go. But to use it, it needed to be updated for current version of Entity Framework (version 5 in time of writing).

<!-- excerpt -->

So here it is. Slightly refactored. Because the question was originally interested in stripping some prefix (`tbl` to be precise) the code is doing exactly that. But if you want different prefix be stripped, just change the `PREFIX` constant. Of if you want something more change the `transformation` function completely (ideally should be idempotent).

```csharp
static void TransformEDMXEntities(string inputFile, string outputFile)
{
	XDocument xdoc = XDocument.Load(inputFile);

	const string CSDLNamespace = "http://schemas.microsoft.com/ado/2009/11/edm";
	const string MSLNamespace = "http://schemas.microsoft.com/ado/2009/11/mapping/cs";
	const string DesignerNamespace = "http://schemas.microsoft.com/ado/2009/11/edmx";
	XElement csdl = xdoc.Descendants(XName.Get("Schema", CSDLNamespace)).First();
	XElement msl = xdoc.Descendants(XName.Get("Mapping", MSLNamespace)).First();
	XElement designerDiagram = xdoc.Descendants(XName.Get("Designer", DesignerNamespace)).First();

	Func<string, string> transformation = (string input) =>
	{
		const string PREFIX = "tbl";
		Regex re = new Regex(string.Format(@"{0}(\w+)", Regex.Escape(PREFIX)), RegexOptions.None);
		return re.Replace(input, new MatchEvaluator(
			(Match m) =>
			{
				return m.Groups[1].Value;
			}));
	};

	TransformCSDL(CSDLNamespace, csdl, transformation);
	TransformMSL(MSLNamespace, msl, transformation);
	TransformDesigner(DesignerNamespace, designerDiagram, transformation);

	using (XmlTextWriter writer = new XmlTextWriter(outputFile, Encoding.Default))
	{
		xdoc.WriteTo(writer);
	}
}

static void TransformDesigner(string DesignerNamespace, XElement designerDiagram, Func<string, string> transformation)
{
	foreach (var item in designerDiagram.Elements(XName.Get("EntityTypeShape", DesignerNamespace)))
	{
		item.Attribute("EntityType").Value = transformation(item.Attribute("EntityType").Value);
	}
}

static void TransformMSL(string MSLNamespace, XElement msl, Func<string, string> transformation)
{
	foreach (var entitySetMapping in msl.Element(XName.Get("EntityContainerMapping", MSLNamespace)).Elements(XName.Get("EntitySetMapping", MSLNamespace)))
	{
		entitySetMapping.Attribute("Name").Value = transformation(entitySetMapping.Attribute("Name").Value);
		foreach (var entityTypeMapping in entitySetMapping.Elements(XName.Get("EntityTypeMapping", MSLNamespace)))
		{
			entityTypeMapping.Attribute("TypeName").Value = transformation(entityTypeMapping.Attribute("TypeName").Value);
		}
	}
}

static void TransformCSDL(string CSDLNamespace, XElement csdl, Func<string, string> transformation)
{
	foreach (var entitySet in csdl.Element(XName.Get("EntityContainer", CSDLNamespace)).Elements(XName.Get("EntitySet", CSDLNamespace)))
	{
		entitySet.Attribute("Name").Value = transformation(entitySet.Attribute("Name").Value);
		entitySet.Attribute("EntityType").Value = transformation(entitySet.Attribute("EntityType").Value);
	}
	foreach (var associationSet in csdl.Element(XName.Get("EntityContainer", CSDLNamespace)).Elements(XName.Get("AssociationSet", CSDLNamespace)))
	{
		foreach (var end in associationSet.Elements(XName.Get("End", CSDLNamespace)))
		{
			end.Attribute("EntitySet").Value = transformation(end.Attribute("EntitySet").Value);
		}
	}

	foreach (var entityType in csdl.Elements(XName.Get("EntityType", CSDLNamespace)))
	{
		entityType.Attribute("Name").Value = transformation(entityType.Attribute("Name").Value);
	}
	foreach (var association in csdl.Elements(XName.Get("Association", CSDLNamespace)))
	{
		foreach (var end in association.Elements(XName.Get("End", CSDLNamespace)))
		{
			end.Attribute("Type").Value = transformation(end.Attribute("Type").Value);
		}
	}
}
```

When you (re)generate your EDMX file, you can unleash this code (I think simple console app will be best for it), do the transformation and reopen the file in Visual Studio. If the transformation is idempotent you're ready to go, else you'll need to do some manual merging with previous version.

Of course you can go further and change also names on i.e. navigational properties and so on. In fact in original post in comments you can find inspiration for it.

Enjoy.

[1]: {{ include "post_link" 228749 }}
[2]: http://www.thedatafarm.org