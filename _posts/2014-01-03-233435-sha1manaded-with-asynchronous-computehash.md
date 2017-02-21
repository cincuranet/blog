---
title: |
  SHA1Managed with asynchronous ComputeHash
date: 2014-01-03T06:21:00Z
tags:
  - .NET
  - Cryptography
  - Multithreading/Parallelism/Asynchronous/Concurrency
  - C#
layout: post
---
Mixing IO-bound and CPU-bound operations in a single chunk of code isn't always a base idea. Like computing hashes/checksums. You read the data from storage and you compute the hash. When all bytes are read, you're done. Of course you can do it as a producer-consumer with a ring buffer, but mixing IO-bound and CPU-bound here is damn straightforward.

If you look at [`SHA1Managed` class][1] you'll find [`ComputeHash`][2] method. Sadly it's synchronous. Thus if you'll point it to a huge file (i.e. `FileStream`) on a slow media you'll be wasting resources while waiting for the result. But given the reading from stream is basically the only IO operation here it shouldn't be hard to make it asynchronous. I thought.

<!-- excerpt -->

I dug into the `ComputeHash` method and it's pretty simple. The IO operation that happens in loop can be easily transformed to asynchronous one and hence having whole method `ComputeHash` asynchronous. Welcome `ComputeHashAsync` for `SHA1Managed`.

```csharp
public async Task<byte[]> ComputeHashAsync(Stream inputStream)
{
    byte[] array = new byte[4096];
    int num;
    do
    {
        num = await inputStream.ReadAsync(array, 0, 4096).ConfigureAwait(false);
        if (num > 0)
        {
            this.HashCore(array, 0, num);
        }
    }
    while (num > 0);
    this.HashValue = this.HashFinal();
    byte[] result = (byte[])this.HashValue.Clone();
    this.Initialize();
    return result;
}
```

It's what the `ComputeHash` is doing only using `ReadAsync` on a stream.

I hope the BCL team will provide asynchronous implementation out-of-the box in a foreseable future.

[1]: http://msdn.microsoft.com/en-us/library/system.security.cryptography.sha1managed(v=vs.110).aspx
[2]: http://msdn.microsoft.com/en-us/library/xa627k19(v=vs.110).aspx