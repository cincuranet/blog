---
title: "Creating your own settings provider - example"
date: 2006-06-17T18:35:00Z
tags:
  - .NET
  - Applications in general
layout: post
---
Sometimes you'll need to create settings provider, which allows you to save configuration into specific format and/or specific place. In FW are some basic providers, but creating your own isn't difficult.

This example shows (easy) way how to build simple provider, which save data into the specified file in xml.

Note: Our provider will save only user scope settings (the default behavior of standard providers) but it’s not necessary.

So, create new class and implement abstract class `SettingsProvider`. The first method we'll care about is `public override void Initialize(string name, NameValueCollection config)`. For this method we’ll provide only calling the parent.

```csharp
public override void Initialize(string name, NameValueCollection config)
{
	base.Initialize(this.ApplicationName, config);
}
```

Next method/property is `public override string ApplicationName`. With it you can handle (as you probably feel) application name. We'll provide very simple implementation.

```csharp
public override string ApplicationName
{
	get { return Application.ProductName; }
	set { }
}
```

Next method is `public override SettingsPropertyValueCollection GetPropertyValues(SettingsContext context, SettingsPropertyCollection collection)`. This method is called when "reading the configuration”. So here we have to implement reading file (or any other storage) and filling the `SettingsPropertyValueCollection` collection. The first step is preparing the structure:

```csharp
SettingsPropertyValueCollection values = new SettingsPropertyValueCollection();
foreach (SettingsProperty property in collection)
{
	SettingsPropertyValue value = new SettingsPropertyValue(property);
	value.IsDirty = false;
	values.Add(value);
}
```

Then we'll check whether or not the (method for getting path will be discussed later) file exists:

```csharp
if (!File.Exists(this.GetSavingPath))
	return values;
```

And next we try to read our XML file with configuration and after returning result:

```csharp
using (XmlTextReader tr = new XmlTextReader(this.GetSavingPath))
{
	try
	{
		tr.ReadStartElement("ID3renamer");
		foreach (SettingsPropertyValue value in values)
		{
			if (IsUserScoped(value.Property))
			{
				try
				{
					tr.ReadStartElement(value.Name);
					value.SerializedValue = tr.ReadContentAsObject();
					tr.ReadEndElement();
				}
				catch (XmlException)
				{ /* ugly */ }
			}
		}
		tr.ReadEndElement();
	}
	catch (XmlException)
	{ /* ugly */ }
}
return values;
```

OK, the method for "reading" is done. Continuing with "saving". The method is `public override void SetPropertyValues(SettingsContext context, SettingsPropertyValueCollection collection)` and it's very similar to reading (in fact does the same in "reverse” order).

```csharp
using (XmlTextWriter tw = new XmlTextWriter(this.GetSavingPath, Encoding.Unicode))
{
	tw.WriteStartDocument();
	tw.WriteStartElement("ID3renamer");
	foreach (SettingsPropertyValue propertyValue in collection)
	{
		if (IsUserScoped(propertyValue.Property))
		{
			tw.WriteStartElement(propertyValue.Name);
			tw.WriteValue(propertyValue.SerializedValue);
			tw.WriteEndElement();
		}
	}
	tw.WriteEndElement();
	tw.WriteEndDocument();
}
```

And that's it. This is very simple sample provider. You can build your own for your specific needs without problem.

I'm using some helper methods. I hope there's no need to comment it, so I'll provide it "as-is".

```csharp
private bool IsUserScoped(SettingsProperty property)
{
	return property.Attributes.ContainsKey(typeof(UserScopedSettingAttribute));
}
```

```csharp
private string GetSavingPath
{
	get
	{
		return Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData) + Path.DirectorySeparatorChar + "ID3 renamer" + Path.DirectorySeparatorChar + "user.config";
	}
}
```

_Note: This is part of my own provider (to understand some 'ID3 renamer' strings) used in my ID3 renamer application (which is now in "to .NET rewriting" phase). :-)_