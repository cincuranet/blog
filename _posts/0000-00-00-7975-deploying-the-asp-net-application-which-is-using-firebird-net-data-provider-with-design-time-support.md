---
title: |-
  Deploying the ASP.NET application which is using Firebird .NET Data Provider (with design-time support)
date: 2006-04-22T15:44:00Z
tags:
  - .NET
  - Firebird
layout: post
---
A few days ago I was trying to deploy my web app, which is using Firebird .NET Data Provider with design time stuff too. There was some problem with this, so I've created small how-to.

If you just use FirebirdClient "in code", you can just place the dll into the Bin directory of your web app. But if you use the design time support, you have to do some additional steps.

First check, whether you have FirebirdSql.Data.FirebirdClient.dll in your Bin directory and if you have setted the reference to it. :)

Next open your web.config and add the record of <DbProviderFactories>. It's similar to [adding design time support into VS][1]. The record should be like this:

```xml
<configuration xmlns="http://schemas.microsoft.com/.NetConfiguration/v2.0">
  <system.data>
    <DbProviderFactories>
      <add name="FirebirdClient Data Provider" invariant="FirebirdSql.Data.FirebirdClient" description=".Net Framework Data Provider for Firebird" type="FirebirdSql.Data.FirebirdClient.FirebirdClientFactory, FirebirdSql.Data.FirebirdClient, Version=2.0.0.0, Culture=neutral, PublicKeyToken=3750abcc3150b00c" />
    </DbProviderFactories>
  </system.data>
</configuration>
```

After adding this, your app should be able to use not only "code time" Firebird, but also the "code" from design time (i.e. configured SqlDataSource).

If you have any perception to this topic, let me know!

[1]: {% include post_id_link.txt id="7471" %}