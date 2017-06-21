---
title: |-
  Mapping stored procedures that are returning non-entity result in EDM
date: 2009-01-25T18:07:00Z
tags:
  - .NET
  - Databases in general
  - Entity Framework
  - Visual Studio
---
If you want to map stored procedure you have three options what the stored procedure can return. Nothing, some scalar value and entity. The problem is that sometimes you have SP that's returning some data, but not some entity. The way to solve this is to create entity with same shape as the SP is returning. But the problem is, that this entity type needs to be mapped to something, probably table. Else the model is not valid. The good message is, that you can create fake table in SSDL and use it. :) But it's a pain to create it, because you have to deal with XML directly and create not only the fake table with proper structure, but also entity set. When reading pre-prelease :) version of [Julie Lerman][1]'s wonderful book [Programming Entity Framework][2] there was a sigh about some tool to automate the process. Well today I have some time, to create rough tool to create some kind of this tool.

```csharp
static void Main(string[] args)
{
    #region Initial checking
    if (args.Length != 3)
        return;
    string tablenameToFake = args[0];
    string emdxFile = args[1];
    string fileForSaving = args[2];
    if (!File.Exists(emdxFile))
        return;
    if (File.Exists(fileForSaving))
        return;
    #endregion
    XDocument xdoc = XDocument.Load(emdxFile);
    const string CSDLNamespace = "http://schemas.microsoft.com/ado/2006/04/edm";
    const string SSDLNamespace = "http://schemas.microsoft.com/ado/2006/04/edm/ssdl";
    XElement csdl = xdoc.Descendants(XName.Get("Schema", CSDLNamespace)).First();
    XElement ssdl = xdoc.Descendants(XName.Get("Schema", SSDLNamespace)).First();
    XElement csdlItem = csdl.Elements(XName.Get("EntityType", CSDLNamespace))
        .Where(x => x.Attribute("Name").Value.ToUpperInvariant() == tablenameToFake.ToUpperInvariant()).FirstOrDefault();
    if (csdlItem == null)
        return;
    Func<string, string> getStoreType = (string csdlTypeName) =>
        {
            // Use some information from store provider or use some dummy or extend this switch using common SQL names?
            switch (csdlTypeName)
            {
                case "Int16":
                case "Int32":
                case "Int64":
                    return "int";
                case "String":
                    return "varchar";
                default:
                    return "blob";
            }
        };
    #region New EntityType creation
    XNamespace n = SSDLNamespace;
    XElement tableToFake = new XElement(n + "EntityType", new XAttribute("Name", tablenameToFake));
    var keys = from x in csdlItem.Element(XName.Get("Key", CSDLNamespace)).Elements(XName.Get("PropertyRef", CSDLNamespace))
               select new XElement(n + "PropertyRef",
                   new XAttribute("Name", x.Attribute("Name").Value));
    tableToFake.Add(new XElement(n + "Key", keys.ToArray()));
    var columns = from x in csdlItem.Elements(XName.Get("Property", CSDLNamespace))
                  select new XElement(n + "Property",
                      new[] {
                          new XAttribute("Name", x.Attribute("Name").Value),
                          new XAttribute("Type", getStoreType(x.Attribute("Type").Value)),
                          new XAttribute("Nullable", (x.Attribute("Nullable") != null ? x.Attribute("Nullable").Value : "true"))
                      });
    tableToFake.Add(columns.ToArray());
    #endregion
    #region EntitySet for new entity
    XElement someEntitySet = ssdl.Element(XName.Get("EntityContainer", SSDLNamespace)).Element(XName.Get("EntitySet", SSDLNamespace));
    XElement newEntitySet = new XElement(someEntitySet);
    newEntitySet.Attribute("Name").Value = tablenameToFake;
    newEntitySet.Attribute("EntityType").Value = ssdl.Attribute("Namespace").Value + "." + tablenameToFake;
    #endregion
    ssdl.Add(tableToFake);
    ssdl.Element(XName.Get("EntityContainer", SSDLNamespace)).Add(newEntitySet);
    using (XmlTextWriter writer = new XmlTextWriter(fileForSaving, Encoding.Default))
    {
        xdoc.WriteTo(writer);
    }
}
```

This code simply looks for entity you specified and makes the appropriate items in SSDL. It's very rough, especially datatypes for table are scamped ;), but you can extend it youself with your favourites. Or maybe better use some information from store provider. Anyway the basic idea is here, if you extend dataypes, it will work well for this stuff. Mapping should be done by you in designer, although because column names are same as entity's, you only need to choose right table name, rest will be done by the designer. And of course, when updating model from database, these changes are lost. 

Comments are welcome.

[1]: http://thedatafarm.com/blog/
[2]: http://oreilly.com/catalog/9780596520281/