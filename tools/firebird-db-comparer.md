---
title: FirebirdDbComparer
no_page: true
layout: page
---
### FirebirdDbComparer

#### Introduction

FirebirdDbComparer is pure managed .NET library that allows comparing of two Firebird databases and producing alter script to get the source database to the target's structure.

#### Versions supported

Firebird 2.5 (any edition) is supported. Firebird 3.0 (any edition) is in preview.

#### Usage

Use `FirebirdDbComparer.Compare.Comparer.ForTwoDatabases` providing connection strings (in .NET (_FirebirdClient_) format) for source and target and `IComparerSettings` where you can specify server version you're going to use and whether or not to ignore permissions on database objects. The `Compare` method then gives you the result (structured as well as list of SQL statements). 

#### Details

The alter script is aimed to use only what Firebird permits (no direct changes in system tables) and breaking dependencies chain as early as possible to avoid long scripts. The script should look familiar as if you'd have written it manually. That means we expect this library to be used by sane developers. 

Because it's a library you can take the output, which is structured (not a single string), and do whatever you need to - save to file, execute one by one, etc.

The library is heavily tested with hundreds of tests, giving us confidence it works in wide range of scenarios.

#### Buy

You can buy the library in [IBPhonenix Shop][1].

[1]: https://www.ibphoenix.com/shop/subcategory/42