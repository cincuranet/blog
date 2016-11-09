---
title: "Type safety of SQL commands"
date: 2011-03-14T04:03:28Z
tags:
  - Databases in general
  - SQL
layout: post
---
I don't know why, but often I hear that the SQL commands are not type safe. That's kind of badly said. No it's wrong, without the proper context.

SQL commands are actually type safe. Did you tried to compare blob and date? Yep, it doesn't work. And you get the error immediately during the prepare phase (or during compilation of i.e. trigger). Yes, you can compare int and date, because there's a lot of implicit conversions in every database engine. But basically, if you wrote something wrong, the engine will let you know very quickly.

The problem lies in other detail. Nobody creates and application based only on SQL commands. Your application is probably something like C# or Delphi application, created from C# or Delphi code and compiled. And inside this code you have SQL commands, very probably strings. The C# or Delphi compiler isn't able to verify the commands, hence to be sure it's OK, your application needs to execute these commads. And that's runtime.

Summary? No, SQL commands are type safe but only on server. Written in your applications code it's still type safe, but not from point of view of type safety of your code and compiler's rules.

<small>It's similar to some kind of hypothetical "eval" function in i.e. C#. If you write directly the code, it's OK. But once you put something into this function (corresponds to database engine), compiler can do nothing with it, until executed.</small>