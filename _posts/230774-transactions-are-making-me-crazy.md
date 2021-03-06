---
title: |-
  Transactions are making me crazy
date: 2009-07-20T20:42:34Z
tags:
  - Databases in general
---
I hate transactions, ACID and all the stuff. Really, I do. No, I don't, it's a great to have challenges with this kind of thinking. But in last two projects (in a row) I had similar problem and transactions were making it even more challenging.

The simple version is that I needed to have data constraint in database (did I mention that I'm constraint freak?) based on not the row itself, but the data in the table and related tables. If you've play with transactions you know this is a problem. Either you may run in read uncommitted mode, see everything and if somebody will do something violating the constraint, even if it will be rolled back, you will start screaming and throwing exceptions or you will use serializable and, to be sure, explicit locking in every piece of trigger or stored procedure code, which is good for you but not for performance. Choose whatever fits your needs better, but right now, for this particular scenario I wish the transactions gone and pretending there's no isolation from others at all (and with decent performance too).

I know it's impossible, because interactions in database are making creating some general purpose "command/constraint" tough. And what's good for one case is definitely not suitable for other.

Anyway maybe with more work done on distributed systems and clouds, where even the simple constraints are interesting to enforce, we'll find some good way how to solve this. ;)