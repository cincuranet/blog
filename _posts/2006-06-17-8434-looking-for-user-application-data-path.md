---
title: "Looking for user application data path"
date: 2006-06-17T08:04:00Z
tags:
  - .NET
  - Windows
layout: post
---
Today I was looking for user application data path (`Application.UserAppDataPath`) but without creating the `BasePath\CompanyName\ProductName\ProductVersion` structure. I was really confused with this, but suddenly I found the solution. <small>(ok, you're right, I should use google prior to surfing in documentation :))</small> The `Environment.SpecialFolder` enumeration and `Environment.GetFolderPath` - it's so easy.

So the result is: 

```csharp
Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData)
```

or maybe better for you:

```csharp
Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData)+Path.DirectorySeparatorChar
```