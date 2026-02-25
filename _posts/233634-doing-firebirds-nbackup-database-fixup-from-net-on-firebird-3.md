---
title: |-
  Doing Firebird's nbackup database "fixup" from .NET on Firebird 3
date: 2017-07-11T08:30:00Z
tags:
  - Firebird
  - .NET
---
When I was writing the [original post][1] I knew the code was right on the edge. It worked on 2.5 and that mattered at that time. My hope was that it will eventually work forever, because why would you change such thing... Nope.

<!-- excerpt -->

For last couple of months we're rolling out Firebird 3 into production and the [original code][1] stopped working. The database was still looking for `*.delta` file when connecting to it. Clearly the "fixup" haven't done its job.

Quick check what `nbackup` is doing and I saw the values are different. While in 2.5 the `0x05` is replaced by `0x01` at `0x00002B`, in 3.0 it's `0x04` replaced by `0x00` (at the same location). At least I didn't corrupt the database. Lucky me.

Because I need both versions I wrote a simple `switch`-ed helper method.

```csharp
public bool Fixup(string database, FirebirdVersion version)
{
    switch (version)
    {
        case FirebirdVersion.Fb25:
            return FixupImpl(database, 0x00002B, 0x05, 0x01);
        case FirebirdVersion.Fb3:
            return FixupImpl(database, 0x00002B, 0x04, 0x00);
        default:
            throw new ArgumentOutOfRangeException(nameof(version));
    }
}
bool FixupImpl(string database, long position, byte lockedByte, byte unlockedByte)
{
    try
    {
        using (var file = File.Open(database, FileMode.Open))
        {
            file.Position = position;
            if (file.ReadByte() == lockedByte)
            {
                file.Position--;
                file.WriteByte(unlockedByte);
            }
        }
        return true;
    }
    catch (IOException)
    {
        return false;
    }
}
```

Let's hope the [API][2] will be available in Firebird 4 and I'll be able to delete the code. :)

[1]: {{ include "post_link" 233547 }}
[2]: http://tracker.firebirdsql.org/browse/CORE-5085