---
title: "Taking Firebird beyond the limit"
date: 2007-02-12T23:12:00Z
tags:
  - Firebird
redirect_from: /id/224393/
category: none
layout: post
---
Well, a little bit weird heading. But a few days ago there was a really interesting discuss on the Firebird(CZ) list (about the ROW_COUNT variable). During the discussion I've decided (with Ivan Prenosil's kick) to test what will happen if you'll have more than 2G and also 4G records.

The 2G limit you overrun in a while. Nothing interesting happened. Of course functions working with Integer as result stopped working correctly.

More fun we expected (especially Ivan :)) after overruning the 4G limit. And ... nothing. Server worked like a charm, no errors, everything OK.

With some free space on disc we let the working and we stopped with 158GB database. Total count of records was really huge - 5 604 000 000. The last test was creating another table and insert some records and then pump for a while the „big" table (to test whether the server not overwriting some data in other table (I know it's not perfect test). Negative. Everything worked correctly.

Now I/we can say that Firebird is able to handle 5 604 000 000 records.
