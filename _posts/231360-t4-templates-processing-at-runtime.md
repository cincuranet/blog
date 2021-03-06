---
title: |-
  T4 templates processing at runtime
date: 2010-05-15T18:22:02Z
tags:
  - .NET
  - C#
  - T4 templates
  - Visual Studio
---
The T4 templates are great tool for use. You can generate literally anything with it with comfort of using any .NET code you have available. Code generation (i.e. POCO classes in EFv4), web service proxies, simple DALs, …, all easily available.

But what if your scenario is one step further? You don't want to use T4 template to generate i.e. code you'll later compile into your application, but use the T4 template in runtime to generate result your application will later use (i.e. email based on template). Good news is you can do it, and it's not hard either.

Easiest way is to start with `Preprocessed Text Template` file type adding to your solution. The file itself is ordinary T4 template you're familiar with. But if you build your project the result produced isn't output from template, but the C#/VB code that produces the result if called. Same result can be done by changing `Custom Tool` into `TextTemplatingFilePreprocessor` in `Properties window` of your current T4 template file.

Then you can create instance of this class (it has same name as your template file), setting up properties, if any and calling `TransformText` method. Pretty easy, isn't it?