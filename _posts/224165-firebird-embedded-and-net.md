---
title: |-
  Firebird Embedded and .NET
date: 2007-01-27T23:07:00Z
tags:
  - .NET
  - Firebird
---
Firebird Embedded is a very popular, special, version of Firebird database engine. The main advantage is, that there's no need to install it. Not to bring some wrong information, it's not some crippled down version (there are some limitations, but it's the being embedded consequence) - it's the fully-featured database engine. For those, who don't know what Firebird is or just want to discover what this - more than twenty years audited - engine is able to do, can study [this document][1] - it will not take more than two minutes.

Let's get back to the FB Embedded and .NET. So, what we'll need? Of course, the Firebird. You can download it from [http://www.firebirdsql.org/][2] pages, current version 2.0 particular from [http://prdownloads.sourceforge.net/firebird/Firebird-2.0.0.12748-0_embed_win32.zip][3]. The second stuff we'll download is Firebird ADO.NET Data Provider. It's available for .NET Framework 1.1, 2.0, Compact Framework 2.0, Mono 1.1.18+. DDEX Provider for Visual Studio 2005 is available too. Download version that fits your needs from [http://www.firebirdsql.org/index.php?op=files&id=netprovider][4]. Cause‘ we want not to do any installations on machines (except the developer's machine) we will use only necessary files:

* FirebirdSql.Data.FirebirdClient.dll
  * .NET Data Provider assembly
* fbembed.dll, icudt30.dll, icuin30.dll, icuuc30.dll
  * files of Embedded FB

Except these necessary files is there a couple of files, that are not absolutely required, but it's good to add it into pack:

* aliases.conf, firebird.conf
  * files for Firebird configuration
* intl\fbintl.conf, intl\fbintl.dll
  * files that supports working with international character sets

Note: On some systems or configurations aren't available libraries msvcp71.dll and msvcr71.dll. These you'll find in downloaded package too and if required distribute it together with application.

Creating an application is then a minute. Just add into references FirebirdSql.Data.FirebirdClient assembly and add near to program fbembedd.dll (or generally into place, where system tries to load DLLs by default). Some example of "well-configured" Firebird you can find [here][5] (note: files are after build copied into bin directory on top level, so from this location you have to run it).

As I said on beginning, Embedded Firebird has some limitations, and it's good to know about these during choosing database platform. First is the necessity to connect to database only thought local protocol, so the TCP/IP connection using "localhost" or "127.0.0.1" will not work. The next is, that Firebird isn't doing any checking during connecting (and it would not make sense, because client and server are in same address space). Permissions to database object are applied of course. The last limit is fact, that embedded version isn't good (but can work) for ASP.NET environment, cause' the file is exclusively locked during first connection by this application.

On other side, very positive is difficulty of moving into "normal" Firebird server. You'll just modify connection string and everything else will work in same way - no other changes, no code changes. You can scale your application from one user up to thousands without any additional effort.

Today we showed how easy can be using Firebird in embedded environment, with keeping full SQL and ACID functionality.

<small>Czech version originally created for [vyvojar.cz][6].</small>

[1]: http://www.firebirdnews.org/docs/fb2min.html
[2]: http://www.firebirdsql.org/
[3]: http://prdownloads.sourceforge.net/firebird/Firebird-2.0.0.12748-0_embed_win32.zip
[4]: http://www.firebirdsql.org/index.php?op=files&id=netprovider
[5]: http://blog.vyvojar.cz/files/folders/217860/download.aspx
[6]: http://www.vyvojar.cz/