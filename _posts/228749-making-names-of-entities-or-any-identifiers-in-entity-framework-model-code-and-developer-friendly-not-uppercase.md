---
title: |-
  Making names of entities (or any identifiers) in Entity Framework model "code and developer friendly" (= not uppercase)
date: 2008-12-07T17:55:00Z
tags:
  - .NET
  - Entity Framework
  - Firebird
  - Visual Studio
---
> [There's an updated version of this post.][1]

[Some databases behave according to standard][2] so without quoting (which is a good way to hell), you got all in uppercase in your new shinny model generated from database (and yes, you should start modeling in empty model and define mapping later - just not to be screwed with relational world). Anyway a lot of people, including me, is generating model from database and then changing it.

But spending first hour or so of your work with renaming entities (or properties ...) isn't much fun. With same experience came guys from [SMS-Timing][3], because they're testing Entity Framework support for Firebird right now (and Firebird is behaving according to standard in this). Hence I've got the idea to make these identifiers little bit more code and developer friendly.

Because the *.EDMX file is just a couple of XML files together (CSDL, MSL, SSDL and designer stuff) you can tweak it by hand or by simple program. To get rid of all in uppercase I've created simple code (or program if you compile it yourself). It's a simple program transforming names of entities to titlecase and also removing underscores with capitalizing next character.

```csharp
static void Main(string[] args)
{
    if (args.Length != 2)
        return;
    if (!File.Exists(args[0]))
        return;
    if (File.Exists(args[1]))
        return;
    XDocument xdoc = XDocument.Load(args[0]);
    const string CSDLNamespace = "http://schemas.microsoft.com/ado/2006/04/edm";
    const string MSLNamespace = "urn:schemas-microsoft-com:windows:storage:mapping:CS";
    const string DiagramNamespace = "http://schemas.microsoft.com/ado/2007/06/edmx";
    XElement csdl = xdoc.Descendants(XName.Get("Schema", CSDLNamespace)).First();
    XElement msl = xdoc.Descendants(XName.Get("Mapping", MSLNamespace)).First();
    XElement designerDiagram = xdoc.Descendants(XName.Get("Diagram", DiagramNamespace)).First();
    Func<string, string> transformation = (string input) =>
        {
            Regex re = new Regex(@"(w+)(W*?)$", RegexOptions.None);
            return re.Replace(input, new MatchEvaluator(
                (Match m) =>
                {
                    string replace = m.Groups[1].Value;
                    StringBuilder result = new StringBuilder(m.Length);
                    for (int i = 0; i < replace.Length; i++)
                    {
                        if ((i == 0) ||
                            (i > 0 && replace[i - 1] == '_'))
                        {
                            result.Append(char.ToUpper(replace[i]));
                        }
                        else if (replace[i] == '_')
                        {
                            continue;
                        }
                        else
                        {
                            result.Append(char.ToLower(replace[i]));
                        }
                    }
                    result.Append(m.Groups[2].Value);
                    return result.ToString();
                }));
        };
    #region CSDL
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
    #endregion
    #region MSL
    foreach (var entitySetMapping in msl.Element(XName.Get("EntityContainerMapping", MSLNamespace)).Elements(XName.Get("EntitySetMapping", MSLNamespace)))
    {
        entitySetMapping.Attribute("Name").Value = transformation(entitySetMapping.Attribute("Name").Value);
        foreach (var entityTypeMapping in entitySetMapping.Elements(XName.Get("EntityTypeMapping", MSLNamespace)))
        {
            entityTypeMapping.Attribute("TypeName").Value = transformation(entityTypeMapping.Attribute("TypeName").Value);
        }
    }
    #endregion
    #region Designer
    foreach (var item in designerDiagram.Elements(XName.Get("EntityTypeShape", DiagramNamespace)))
    {
        item.Attribute("EntityType").Value = transformation(item.Attribute("EntityType").Value);
    }
    #endregion
    using (XmlTextWriter writer = new XmlTextWriter(args[1], Encoding.Default))
    {
        xdoc.WriteTo(writer);
    }
}
```

The code is pretty simple. It just goes to thru the file and changes what needs to be changed. Mainly CSDL and MSL parts. Changes in designer part are not necessary, but you'll lose positions etc. when you don't do it. _This is kind of this-afternoon-code - maybe I forgot something, maybe the RE is matching too much... Feel free to report problems in comments._

If you want to change also names of properties you can either tweak the code yourself or ask in comments, if I found some time, I'll extend it. And of course, if you have some special naming convention in your company (i.e. every table has `T_` prefix), just change the `transformation` function.

[1]: {{ include "post_link" 233202 }}
[2]: http://www.alberton.info/dbms_identifiers_and_case_sensitivity.html
[3]: http://www.sms-timing.com/