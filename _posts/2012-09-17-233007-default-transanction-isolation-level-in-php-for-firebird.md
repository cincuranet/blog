---
title: "Default transanction isolation level in PHP for Firebird"
date: 2012-09-17T06:21:04Z
tags:
  - Databases in general
  - Firebird
  - PHP
redirect_from: /id/233007/
category: none
layout: post
---
I was hunting some problem in PHP application and thanks to [Trace API in Firebird][1] I found terrible default value in PHP. What value? It's the default transaction isolation level value. In 99% of languages/environments in something close to read committed. But not in PHP.

Let's have a look at it. If you start a new transaction (or if one is started internally, where you cannot change the isolation level) where you don't explicitly specify isolation level the `IBASE_DEFAULT` is used. But this is `IBASE_WRITE|IBASE_CONCURRENCY|IBASE_WAIT`. This is read-write wait transaction in concurrency mode. This mode is most restrictive, nothing close to read committed. And to make it worse, there's no way to change this default value in runtime. You can only do it recompiling sources, nothing to be viable in most cases.

So how to solve it? Well, if you created yourself some abstraction layer over `ibase_xxx`/`fbird_xxx` function you'll change it there and you're done. If not, you're screwed. :) OK, just kidding. You can play with `[override_function][2]` to override `[fbird_query][3]`, `[fbird_prepare][4]` etc., but when you're in it, maybe it's time to create simple thin abstraction.  That's what I did. Find & Replace worked for changing the actual code. :) For the rest I created simple functions like `DbQuery`, `DbPrepare` etc. These functions take the transaction, which was created by another function `DbTransaction` and stored (i.e. in `$GLOBALS`, dirty right? 8-)), when first needed (and then used until commit/rollback or end of the page's life).

```php
function DbQuery()
{
	$args = func_get_args();
	array_unshift($args, $GLOBALS['tx']);
	return call_user_func_array('fbird_query', $args);
}
```

It's nothing special, only few small pieces to make to together work. First the function doesn't declare any input parameters, but in fact there are some. Yeah, dynamic languages. I get these via `[func_get_args][5]`, then push to the first position the transaction to use (here I'm using the dirty `$GLOBALS` ;)). Finally I use `[call_user_func_array][6]` to call `[fbird_query][7]`. Function `[fbird_query][8]` takes variable number of arguments so it's not easy to call it directly with parameters in array as I have. I have to thank people in firebird-php mailing list, because I completely forgot about it, though I'm using exactly the same at other places in same project. Return values are same as from `[fbird_query][9]`, so you can then start fetching rows and so on (and it's also good idea to create wrappers for these too, who knows what will strike in the future).

Remember Firebird and PHP is a good combination.

[1]: http://www.firebirdsql.org/rlsnotesh/rlsnotes25.html#rnfb25-trace
[2]: http://php.net/manual/en/function.override-function.php
[3]: http://php.net/manual/en/function.ibase-query.php
[4]: http://php.net/manual/en/function.ibase-prepare.php
[5]: http://php.net/manual/en/function.func-get-args.php
[6]: http://www.php.net/manual/en/function.call-user-func-array.php
[7]: http://php.net/manual/en/function.ibase-query.php
[8]: http://php.net/manual/en/function.ibase-query.php
[9]: http://php.net/manual/en/function.ibase-query.php