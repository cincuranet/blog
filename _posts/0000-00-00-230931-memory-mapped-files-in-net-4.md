---
title: |-
  Memory mapped files in .NET 4
date: 2009-10-18T13:42:52Z
tags:
  - .NET
  - C/C++
  - Delphi/Object Pascal/Pascal
  - Memory
layout: post
---
Similarly to my way to [CountdownEvent class][1], I found [MemoryMappedFiles namespace][2], which is new in .NET 4. It's in System.IO.

If you've done some work in stone ages in C/C++ or maybe ObjectPascal (Delphi) you may remember using these files. I used these for exchanging data between two applications, but the usage is pretty much endless. And now you can benefit from it in .NET directly, without using P/Invoke.

To see what's inside, I wrote two simple applications that are reading and writing some data (no synchronization ;)).

The first one is doing writing and reading:

```csharp
using (MemoryMappedFile mmf = MemoryMappedFile.CreateOrOpen("TestMemoryMappedFile", 1024 * 1024))
{
	using (MemoryMappedViewAccessor accessor = mmf.CreateViewAccessor())
	{
		HelperStuff.WriteData(accessor, 0);
		Console.ReadLine();
		HelperStuff.ReadData(accessor, 0);
	}
}
```

and the second one is just reading:

```csharp
using (MemoryMappedFile mmf = MemoryMappedFile.CreateOrOpen("TestMemoryMappedFile", 1024 * 1024))
{
	using (MemoryMappedViewAccessor accessor = mmf.CreateViewAccessor())
	{
		HelperStuff.WriteData(accessor, 0);
		Console.ReadLine();
		HelperStuff.ReadData(accessor, 0);
	}
}
```

Nothing magical. The reading and writing methods (placed in shared library) are simply creating some dummy data. In my case struct and string, saved as array of bytes.

```csharp
public static void ReadData(MemoryMappedViewAccessor accessor, int position)
{
	SomeData data1;
	accessor.Read<SomeData>(position, out data1);
	position += Marshal.SizeOf(typeof(SomeData));
	int length = accessor.ReadInt32(position);
	position += Marshal.SizeOf(typeof(int));
	byte[] data2 = new byte[length];
	accessor.ReadArray<byte>(position, data2, 0, data2.Length);
	Console.WriteLine(data1.CurrentDate);
	Console.WriteLine(Encoding.Unicode.GetString(data2));
}
public static void WriteData(MemoryMappedViewAccessor accessor, int position)
{
	SomeData data1 = new SomeData() { CurrentDate = DateTime.Today.Ticks };
	byte[] data2 = Encoding.Unicode.GetBytes(DateTime.Today.ToLongDateString());
	accessor.Write<SomeData>(position, ref data1);
	position += Marshal.SizeOf(typeof(SomeData));
	accessor.Write(position, data2.Length);
	position += Marshal.SizeOf(typeof(int));
	accessor.WriteArray<byte>(position, data2, 0, data2.Length);
}
```

The struct is really dummy:

```csharp
public struct SomeData
{
	public long CurrentDate { get; set; }
}
```

The reading and writing is little bit limited, as you're in fact dealing with just a bunch of memory, not some structured storage. But if you like working with it directly as stream (or you have some smart wrappers around streams), you can also use method [CreateViewStream][3] instead of [CreateViewAccessor][4] used in my example. These method have some overloads with option to specify also the access rights using [MemoryMappedFileAccess][5], so you can i.e. use CopyOnWrite and any write operations will not be seen by other processes.

[1]: {% include post_id_link.txt id='230550' %}
[2]: http://msdn.microsoft.com/en-us/library/system.io.memorymappedfiles(VS.100).aspx
[3]: http://msdn.microsoft.com/en-us/library/system.io.memorymappedfiles.memorymappedfile.createviewstream(VS.100).aspx
[4]: http://msdn.microsoft.com/en-us/library/system.io.memorymappedfiles.memorymappedfile.createviewaccessor(VS.100).aspx
[5]: http://msdn.microsoft.com/en-us/library/system.io.memorymappedfiles.memorymappedfileaccess(VS.100).aspx