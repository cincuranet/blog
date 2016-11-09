---
title: "DDEX and Firebird .NET Data Provider"
date: 2006-02-19T20:19:00Z
tags:
  - .NET
  - Firebird
layout: post
---
Well, in this article I'm going do describe step-by-step how-to add Firebird .NET Data Provider into Visual Studio 2005. So I assume, I have downloaded and installed the provider (be sure that's for .NET2).

1. You have to download the VS SDK (**not** the Framework SDK). It's available on MSDN. It's not the standard part of installation.
2. Check whether (installation should add them in) the provider assemblies are in GAC (you can use the gacutil util from provider directory or the Framework GUI). You have to focus to FirebirdSql.Data.FirebirdClient (`gacutil.exe /l FirebirdSql.Data.FirebirdClient`).
3. Locate your machine.config and add into `<configuration> -> <configSections>` add `<section name="firebirdsql.data.firebirdclient" type="System.Data.Common.DbProviderConfigurationHandler, System.Data, Version=2.0.0.0, Culture=neutral, PublicKeyToken=<PublicKeyToken of _System.Data_ assembly>" />`.
4. Into `<system.data> -> <DbProviderFactories>` add `<add name="FirebirdClient Data Provider" invariant="FirebirdSql.Data.FirebirdClient" description=".Net Framework Data Provider for Firebird" type="FirebirdSql.Data.FirebirdClient.FirebirdClientFactory, FirebirdSql.Data.FirebirdClient, Version=2.0.0.0, Culture=neutral, PublicKeyToken=<PublicKeyToken of your FB client assembly>" />`.
5. Then open the FirebirdDDEXProvider.reg file and replace the `%Path%` variable with the correct path for your installation, i.e.: `C:\Program Files\FirebirdClient`, and load it into the registry (also check whether all entries were successfuly added). **But!** If you're adding the path to the reg file you have input `C:\\Program Files\\FirebirdClient` (backslash the backslashes).

Now you can startup the VS and try to add database to Database Explorer toolbox. If you will follow these steps exactly, you have 99,9% chance for success. :)

PS: Sorry for my English. ;)