---
title: "My pain when migrating to PHP 5.3 from PHP 5.2 (related to Firebird and MySQL)"
date: 2011-03-31T05:02:51Z
tags:
  - Firebird
  - InterBase
  - MySQL
  - PHP
redirect_from: /id/232299/
category: none
layout: post
---
<p>I was recently migrating my server to <a href="http://www.php.net">PHP</a> 5.3. To be honest I don't know why. I'm not using PHP often, only few applications and some simple web pages (really simple logic). And this blog. To make things worse, I'm using as my main database <a href="http://www.firebirdsql.org">Firebird</a>, not <a href="http://www.mysql.com">MySQL</a>. And <a href="http://php.net/manual/en/book.ibase.php">PHP driver for Firebird</a>, say, it's very average. But to keep myself in touch with "current" world I decided to go to PHP 5.3 (hoping also some bugs (mainly Firebird related ;)) to be fixed there). I faced two issues.</p>

<p>First was problem with loading <code>php_interbase.dll</code>. After some research I found, the <code>gds32.dll</code> isn't part of PHP package as it was in 5.2. Using <code>fbclient.dll</code> from Firebird's installation and renaming it to <code>gds32.dll</code> didn't solve the issue. Surprisingly (thanks <a href="http://technet.microsoft.com/en-us/sysinternals/bb896645">Process Monitor</a>), the extension is looking for <code>fbclient.dll</code> (in PHP's directory, not in <code>ext</code>). <a href="http://www.embarcadero.com/products/interbase">InterBase</a> & Firebird mix. :)</p>

<p>Other problem was MySQL. I don't like the database and also I'm not expert in PHP+MySQL stuff. I feel more strong around Firebird stuff. The incompatibility is <a href="http://php.net/manual/en/migration53.incompatible.php">known</a> and it's about MySQL's new (longer) password hashes being mandatory to be able to connect from 5.3. And you get error saying it: <code>mysqlnd cannot connect to MySQL 4.1+ using the old insecure authentication.</code>. I'm not admin (logically or from privileges) of MySQL server I'm using, so some tips were not working. The final commands that solved my issue were:</p>

<pre class="brush:sql">
set session old_passwords = 0;
set password = password('&lt;password&gt;');
</pre>

<p>I was kind of jumping around it, with similar commands or commands doing same thing only requiring higher privileges.</p>

<p>Although simple to solve, I spent some time doing wrong steps (and trying). Hope this will save yours.</p>