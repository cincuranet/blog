---
title: "Disabling database triggers in FirebirdClient"
date: 2012-05-22T17:00:07Z
tags:
  - .NET
  - Firebird
redirect_from: /id/232871/
category: none
layout: post
---
Database triggers are a nice new feature added to [Firebird][1] in version 2.1. And as you can do a lot of stuff with them, sometimes you also might wanna to connect without firing these, especially if you made a mistake there and it's forcibly closing your connection. :) To disable these, standard Firebird utilities have a new switches. But it boils down to the API itself, nothing magical. 

And if it's in API, it could be [FirebirdClient][2], right? In last few days among working on other bugs and my daily responsibilities I had a time to dig into this. And now also from .NET world we can use this feature.

It's on two places. First is standard `FbConnection` level. New connection string property `no db triggers` (and some aliases) was added (and similarly named property in `FbConnectionStringBuilder`). If you set it to `True`, database triggers will be disabled for this connection. If you think about pooling and this feature carefully you might come to conclusion it's unclear how it should behave. Same for me. After a quick discussion in mailing list, it's now invalid to use pooling and disabling database triggers in same connection string. You'll get error when trying to use it.

The other part is for backups via `FbBackup` class. Here it's based on long lived `FbBackupFlags`, `NoDatabaseTriggers` to be precise. Simply add it to your options and you're done. Connection string's option is ignored here.

I know nothing mind blowing, but I'm always happy to have new feature there and provide more power for developers.

[1]: http://www.firebirdsql.org
[2]: http://www.firebirdsql.org/en/net-provider/