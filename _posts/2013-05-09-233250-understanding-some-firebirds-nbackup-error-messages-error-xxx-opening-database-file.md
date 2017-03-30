---
title: |-
  Understanding (some) Firebird's nbackup error messages ("Error (xxx) opening database file")
date: 2013-05-09T09:25:16Z
tags:
  - Firebird
  - Storage &amp; Backup
layout: post
---
Because on the server where the application is running I'm unable to do backup using regular `gbak` tool, I turned my attention to `nbackup`. In fact I'm doing just file copy and using `alter database begin backup`/`alter database end backup` ([more info][1]). But doing the backup is only part of the story. You have also know you know how to restore it and whether you can restore it (aka whether the backup is not corrupted).

<!-- excerpt -->

If you have done backup using process described above and you have the file, you can't just start using it. You need to "restore it", which means changing a flag inside the database file. This is where the `nbackup`'s `-F` switch comes to play. But no matter what I was doing, I was getting:

```text
Failure: Error (5) opening database file: <some>.fdb
```

This error message is, well, completely utterly useless. While waiting for reply from [firebird-support list][2] I played with [Process Monitor][3] (of course) to see what's wrong. But I haven't seen any disk activity with errors. Changing paths, trying invalid paths (this produced just error 3), running 32bit version of `nbackup`, using one from Firebird 2.1, ... And nothing. Then I decided to have a look into the ultimate documentation aka sources. It was not difficult to find piece of code:

```cpp
b_error::raise(uSvc, "Error (%d) opening database file: %s", GetLastError(), dbname.c_str());
```

Great [`GetLastError`][4]. Time to jump into [System Error Codes][5]. And in no time I know it's `ERROR_ACCESS_DENIED`. That's a progress. Quick check of permissions and yes; the user I was running under had no permission to write to the file. Quickly changing that and everything was working fine.

Hope it helps somebody.

[1]: http://www.firebirdsql.org/manual/nbackup-lock-unlock.html
[2]: http://www.firebirdsql.org/en/mailing-lists/
[3]: http://technet.microsoft.com/en-us/sysinternals/bb896645.aspx
[4]: http://msdn.microsoft.com/en-us/library/windows/desktop/ms679360(v=vs.85).aspx
[5]: http://msdn.microsoft.com/en-us/library/windows/desktop/ms681381(v=vs.85).aspx