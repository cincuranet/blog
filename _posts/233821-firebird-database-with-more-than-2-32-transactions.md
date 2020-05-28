---
title: |-
  Firebird database with more than 2^32 transactions
date: 2020-05-01T06:39:00Z
tags:
  - Firebird
---
Firebird 3 added [support for _transaction ID_ to go over, originally, 2^31^ and later 2^32^, all the way up to the 2^48^][1]. Although a great improvement it might become a problem if the client library can't properly handle that in a few places where these numbers are surfaced.

<!-- excerpt -->

Because I needed to try this with [FirebirdClient][2] too, I needed such database. There isn't much room for shortcuts (to be really sure it's a valid database), rather the machine needs to do the work. It took a while to get over 2^32^, which I suppose would be limit most people are interested in. The [database I'm providing here][3] (and also archiving it for me in case I need to revisit some code :)) has _Next transaction_ at `7_595_278_038` aka `3_300_310_742` over the 2^32^. It's not a backup of database, but the database file itself, simply because doing backup & restore resets the transaction counter.

Hope it speeds up some of your testing.

[1]: https://firebirdsql.org/file/documentation/release_notes/html/en/3_0/rnfb30-apiods.html#rnfb30-apiods-transaclimit
[2]: https://github.com/cincuranet/FirebirdSql.Data.FirebirdClient
[3]: {{ include "post_ilink" page "tx.7z" }}