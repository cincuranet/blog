---
title: "NuoDB - starting with \"NewSQL\" database"
date: 2012-05-07T08:00:35Z
tags:
  - Databases in general
  - NewSQL
  - NoSQL
  - NuoDB
redirect_from: /id/232827/
category: none
layout: post
---
[NoSQL][1] is everywhere around us. And there's a new (well, it's here for a while, but still in beta stages of development) kind, it's called [NuoDB][2]. To be precise, NuoDB positions itself as NewSQL. It claims to be 100% SQL, 100% ACID and 100% elastically scalable. I was following it since early stages (original name was NimbusDB, if somebody remembers) and I'd like to show it to you quickly. In follow up posts I'll focus on using it from (mainly) .NET and some cloud scenarios ([Amazon AWS][3], [Windows Azure][4]).

NuoDB is based on concept of chorus (aka [cluster][5]). Chorus is set of archive and transaction nodes (more about these later). One computer can be part of many choruses. Transaction node in chorus is node processing SQL transactions. If you add more transaction nodes into chorus, you basically scale it up (you can process more transactions, in, hopefully, less time). The archive nodes are nodes used for writing data into storage (just a side note, NuoDB has support for [Amazon S3][6] without [EBS][7]). If you add more archive nodes into chorus you're more tolerant to storage failures. There's also "special" process (or more), called broker that manages the chorus and through it the first interaction with database occurs (then you're talking to transaction nodes). And all this is managed through "agent" process.

Pretty straightforward, isn't it (sure, devil is in details)? So let's get our hands dirty. All these examples are on Windows, but you can select from variety of platform while downloading NuoDB (and of course, you can mix platforms).

```text
start java.exe -jar bin\nuoagent.jar --broker --password FooBar
start bin\nuodb.exe --chorus TestChorus --password TestPwd --dba-user admin --dba-password admin
start bin\nuodb.exe --chorus TestChorus --password TestPwd --archive "C:\Users\Jiri\Desktop\NuoDBStorage" --initialize
```

The first command starts broker. Second starts transaction node in `TestChorus` with initial user/pwd `admin`/`admin`. And last command starts archive node, the data will be stored in `C:\Users\Jiri\Desktop\NuoDBStorage` directory. The `--initialize` switch is used only first time, to, well, initialize the storage itself. That's it, minimal set up to start playing with NuoDB. Now we can connect to it and start playing with SQL.

```text
bin\nuosql.exe TestChorus@localhost --user admin --password admin
```

```sql
SQL> create table Contacts (ID int primary key, FirstName string, LastName string, Phone string, Street string, HouseNumber int, City string);
SQL> commit;
SQL> insert into Contacts values (1, 'Jiri', 'Cincura', '+420123456789', 'RRR Street', 6, 'RRR City');
SQL> commit;
SQL> select * from Contacts;
 ID  FIRSTNAME  LASTNAME      PHONE       STREET   HOUSENUMBER    CITY
 --- ---------- --------- ------------- ---------- ------------ --------
  1     Jiri     Cincura  +420123456789 RRR Street      6       RRR City
SQL>
```

Easy, right? So [get grab it][8] and play with it. Next time we'll try some failure scenarios and we'll explore how to connect from .NET and some other environments. Feel free to ask if you're interested in something.

[1]: http://en.wikipedia.org/wiki/NoSQL
[2]: http://www.nuodb.com/
[3]: http://aws.amazon.com/
[4]: http://www.windowsazure.com/
[5]: http://en.wikipedia.org/wiki/Computer_cluster
[6]: http://aws.amazon.com/s3/
[7]: http://aws.amazon.com/ebs/
[8]: https://www.nuodb.com/download.php