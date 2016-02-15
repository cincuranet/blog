---
title: "Firebird 2.5 vs. Firebird 2.1 speed comparison under .NET provider's unit tests"
date: 2010-10-19T10:00:56Z
tags:
  - Firebird
  - Test Driven Development (TDD)
redirect_from: /id/232108/
category: none
layout: post
---
Recently I was running [NUnit][1] tests we're using for [.NET provider][2] and I got an idea to compare different [Firebird][3] versions. Not because it's any standard test (frankly it's way not), but because I have to run the tests against different Firebird versions anyway and I see the time. It's not about the time itself, rather about the performance improvement (or not) between two versions.

I used NUnit's GUI to run tests. Tests are run in one thread and I was trying to make the environment same as much as possible. The server was processing nothing else, only the commands from tests. The commands in tests are nothing special, it's more about testing the provider's correctness than stressing server. But some processing is there. More processing is done in [set up][4] (and [tear down][5]) methods where database, objects are created and tables are filled with some data. A lot of commands, but simple ones. With this configuration you can easily see, that cache isn't useful here as well as improved SMP support in 2.5.

Both versions we're current latest from 2.1 (2.1.3 SuperServer) and 2.5 (2.5.0 SuperClassic) trunks, official builds, 32-bit, default configurations.

I can clearly state, that 2.5 is faster. About 13%. Is it a lot of not? Who cares. This test was very far away from real world scenario, hence for you application it might be even better (or not 8-)). Good news is, that 2.5 really is faster, no empty promises.

[1]: http://www.nunit.org
[2]: http://www.firebirdsql.org/index.php?op=files&id=netprovider
[3]: http://www.firebirdsql.org
[4]: http://www.nunit.org/index.php?p=setup&r=2.4.8
[5]: http://www.nunit.org/index.php?p=teardown&r=2.4.8
