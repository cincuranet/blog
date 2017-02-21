---
title: |
  My pain when migrating to PHP 5.3 from PHP 5.2 (related to Firebird and MySQL)
date: 2011-03-31T05:02:51Z
tags:
  - Firebird
  - InterBase
  - MySQL
  - PHP
layout: post
---
I was recently migrating my server to [PHP][1] 5.3. To be honest I don't know why. I'm not using PHP often, only few applications and some simple web pages (really simple logic). And this blog. To make things worse, I'm using as my main database [Firebird][2], not [MySQL][3]. And [PHP driver for Firebird][4], say, it's very average. But to keep myself in touch with "current" world I decided to go to PHP 5.3 (hoping also some bugs (mainly Firebird related ;)) to be fixed there). I faced two issues.

First was problem with loading `php_interbase.dll`. After some research I found, the `gds32.dll` isn't part of PHP package as it was in 5.2. Using `fbclient.dll` from Firebird's installation and renaming it to `gds32.dll` didn't solve the issue. Surprisingly (thanks [Process Monitor][5]), the extension is looking for `fbclient.dll` (in PHP's directory, not in `ext`). [InterBase][6] & Firebird mix. :)

Other problem was MySQL. I don't like the database and also I'm not expert in PHP+MySQL stuff. I feel more strong around Firebird stuff. The incompatibility is [known][7] and it's about MySQL's new (longer) password hashes being mandatory to be able to connect from 5.3. And you get error saying it: `mysqlnd cannot connect to MySQL 4.1+ using the old insecure authentication.`. I'm not admin (logically or from privileges) of MySQL server I'm using, so some tips were not working. The final commands that solved my issue were:

```sql
set session old_passwords = 0;
set password = password('<password>');
```

I was kind of jumping around it, with similar commands or commands doing same thing only requiring higher privileges.

Although simple to solve, I spent some time doing wrong steps (and trying). Hope this will save yours.

[1]: http://www.php.net
[2]: http://www.firebirdsql.org
[3]: http://www.mysql.com
[4]: http://php.net/manual/en/book.ibase.php
[5]: http://technet.microsoft.com/en-us/sysinternals/bb896645
[6]: http://www.embarcadero.com/products/interbase
[7]: http://php.net/manual/en/migration53.incompatible.php