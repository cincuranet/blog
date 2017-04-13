---
title: |-
  ComputeHashAsync for SHA1
date: 2014-01-27T06:19:00Z
tags:
  - .NET
  - Cryptography
  - Multithreading/Parallelism/Asynchronous/Concurrency
  - C#
layout: post
---
[Previously I blogged about creating asynchronous ComputeHash method but for SHA1Managed][1]. But what if you want to use best implementation your platform has and you're using [`SHA1.Create`][2]? Well then you need to use what's available in public space for you.

<!-- excerpt -->

It's not that difficult how it might look like. You just need to work with [`TransformBlock`][3] and at the end with [`TransformFinalBlock`][4].

```csharp
public static async Task<byte[]> ComputeHashAsync(this SHA1 sha1, Stream inputStream)
{
	const int BufferSize = 4096;

	sha1.Initialize();

	var buffer = new byte[BufferSize];
	var streamLength = inputStream.Length;
	while (true)
	{
		var read = await inputStream.ReadAsync(buffer, 0, BufferSize).ConfigureAwait(false);
		if (inputStream.Position == streamLength)
		{
			sha1.TransformFinalBlock(buffer, 0, read);
			break;
		}
		sha1.TransformBlock(buffer, 0, read, default(byte[]), default(int));
	}
	return sha1.Hash;
}
```

Because the `TransformBlock` and `TransformFinalBlock` methods are actually defined on [`HashAlgorithm`][5] this might work for any derived class like i.e. [`MD5`][6]. But I haven't tested it. Other classes might need also "special" calls before or after.

[1]: {% include post_id_link.txt id="233435" %}
[2]: http://msdn.microsoft.com/en-us/library/e7hyyd4e(v=vs.110).aspx
[3]: http://msdn.microsoft.com/en-us/library/system.security.cryptography.hashalgorithm.transformblock(v=vs.110).aspx
[4]: http://msdn.microsoft.com/en-us/library/system.security.cryptography.hashalgorithm.transformfinalblock(v=vs.110).aspx
[5]: http://msdn.microsoft.com/en-us/library/System.Security.Cryptography.HashAlgorithm(v=vs.110).aspx
[6]: http://msdn.microsoft.com/en-us/library/system.security.cryptography.md5(v=vs.110).aspx