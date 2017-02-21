---
title: |
  Doing Firebird's nbackup database "fixup" from .NET
date: 2016-02-04T15:21:00Z
tags:
  - Firebird
  - .NET
layout: post
---
The `nbackup` tool and more importantly the `alter database [begin|end] backup` commands are a great way to do a quick backup of Firebird database. You just copy the file (or files if you're using database splitting) and you're done. The small problem is with restore.

<!-- excerpt -->

When you copy the backup to where it should be, Firebird will deny using it. Because the database is actually in "backup mode" (it was in that state as you copied it) and it's missing so-called "delta" file. The solution is to call [`nbackup -F`][1]. But what if you don't have `nbackup` available? Currently there's [no API to do that][2]. But nothing is lost.

The `nbackup` is just physically accessing the file and flipping the state. Can that be done in .NET purely? Of course it can. Comparing the two files before and after "fixup" there's a change at offset `0x00002B`. So the code just needs to do that.

```csharp
public bool Fixup(string databaseFile)
{
    try
    {
        using (var file = File.Open(databaseFile, FileMode.Open))
        {
            file.Position = 0x00002B;
            if (file.ReadByte() == 0x05)
            {
                file.Position--;
                file.WriteByte(0x01);
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

The code is first checking what's on above mentioned offset. If the file looks locked it flips the state to unlocked.

It's very raw approach. There's no other checking whether the file is really Firebird database or whether there isn't something else around. Just repeating what the `nbackup` does (from outside view). Use it at your own risk.

[1]: http://www.firebirdsql.org/manual/nbackup-functions-params.html
[2]: http://tracker.firebirdsql.org/browse/CORE-5085