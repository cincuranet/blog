---
title: |
  Full CI for FirebirdClient
date: 2015-08-24T08:23:00Z
tags:
  - .NET
  - C#
  - Continuous Integration
  - Firebird
  - Test Driven Development (TDD)
layout: post
---
Recently I got a good [PR][1] changing the tests for [FirebirdClient][2]. Basically the suite is now executed for regular server as well as Embedded. Directly. You don't need to change configuration values and restart tests etc. Great idea. There's never enough tests. Especially as these are free. 

<!-- excerpt -->                                                                                                                            

While talking about the PR we also went around question why the tests are not executed on CI ([AppVeyor][3] in this case). I originally setted up the build just to try AppVeyor and play with it a little. But running the tests is, of course, a good idea. Normally I'm running these tests here and there, as usual ;), and of course a lot before release. So the original contributor [contributed][5] set up for AppVeyor too. Nice. 

Then I went to slightly polish it and make it 100%-ish reliable, else it's just rubbish. That took me three evenings (tell me about estimates) - I was mostly afraid of this before, but once the PR was in place I was determined to do it. So now we have full (almost one might say, see below) CI stack for FirebirdClient. Every commit is compiled and fully tested.

If you want to have "nightly" build to test something new you can get it from [here][4]. And if you issue PR you don't need to run all tests (although you should ;)), the machine will do it (and you can eventually fix what's broken).

<small>So why _almost_ full CI stack? Well, first we're not building all the packages with binaries, NuGet packages and installers. Would you like these? And also the tests are running only one type (SC, SS, CS) and version of server. Normally, before a release, I do kind of a matrix. Although it's doable, given how long it takes to execute everything on AppVeyor currently (~20 minutes), I doubt it's worth adding it and having the whole process take couple of hours. Or is it?</small>    

[1]: https://github.com/cincuranet/FirebirdSql.Data.FirebirdClient/pull/27
[2]: http://www.firebirdsql.org/en/net-provider/
[3]: http://appveyor.com
[4]: https://ci.appveyor.com/project/cincura_net/firebirdsql-data-firebirdclient
[5]: https://github.com/cincuranet/FirebirdSql.Data.FirebirdClient/pull/28