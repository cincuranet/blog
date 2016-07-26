---
title: "Zabalení souborů do jednoho (hackneme serializaci?) :)"
date: 2006-04-02T10:36:00Z
tags:
  - .NET
redirect_from: /id/7766/
category: none
layout: post
---
Tento týden na cvikách z C# (BTW první cvika co vypadala slušně - ale učí se to první rok, tak se teprve učí jak na to) bylo v rámci procvičení práce se streamy za úkol udělat program, který všechny soubory z daného adresáře (nebo spíše soubory, které tam vložíte) nacpe do jednoho a uloží.

Jako další bylo na procvičení něco málo kolem serializace. No a co moje hlava nevymyslela, spojil jsem toto dohromady. Udělal jsem tedy třídu, která všechny soubory vložila "do sebe" (spíše tedy do Dictionary) a pak jsem ji nechal seserializovat.

Přemýslím akorát teď jestli je to hnusné nebo hodně hnusné řesení. :) Ale co, aspon jsem zabil dvě mouchy jednou ránou a nenudil se.

Nepředpokládám, že je to celé dobře, nějak pořádně jsem to netestoval, hlavně že to jednou udělalo co jsem chtěl. Určitě by se to dalo vylepšit na nějaký `tar` a třeba ješte to celé prohnat kompresí.

Tady je teda tento hack pro inspiraci:

```csharp
class Archive
{
	private Dictionary<string, byte[]> _packItems;
	public Archive()
	{
		_packItems = new Dictionary<string, byte[]>();
	}
	public void AddFile(string fileName)
	{
		if (_packItems.ContainsKey(fileName))
		{
			throw new FileAlreadyInArchiveException();
		}
		_packItems.Add(fileName, new PackItem(fileName).Data);
	}
	public void RemoveFile(string fileName)
	{
		if (_packItems.ContainsKey(fileName))
		{
			throw new FileNotInArchiveException();
		}
		_packItems.Remove(fileName);
	}
	public void Pack(string fileName)
	{
		BinaryFormatter bf = new BinaryFormatter();
		FileStream fs = new FileStream(fileName, FileMode.OpenOrCreate);
		bf.Serialize(fs, _packItems);
		fs.Close();
	}
	public void UnPack(string directory, string fileName)
	{
		BinaryFormatter bf = new BinaryFormatter();
		FileStream fs = new FileStream(fileName, FileMode.Open);
		_packItems = (Dictionary<string, byte[]>)bf.Deserialize(fs);
		foreach (KeyValuePair<string, byte[]> o in _packItems)
		{
			new BinaryWriter(new FileStream(directory + Path.GetFileName(o.Key), FileMode.CreateNew))
			.Write(o.Value);
		}
		fs.Close();
	}
}
class PackItem
{
	private byte[] _data;
	public PackItem(string fileName)
	{
		BinaryReader br = new BinaryReader(new FileStream(fileName, FileMode.Open));
		try
		{
			_data = new byte[new FileInfo(fileName).Length];
			_data = br.ReadBytes(_data.Length);
		}
		finally
		{
			br.Close();
		}
	}
	public byte[] Data
	{
		get
		{
			return _data;
		}
	}
}
```

PS: Prosím neověřovat moc návrh (a ani nezkoušet kde se to zhroutí, vidím to tam), napsal jsem to jen jako hračku za asi 20 minut, jen abych zkusil, jestli to bude fungovat.