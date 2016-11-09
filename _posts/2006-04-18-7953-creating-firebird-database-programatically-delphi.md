---
title: "Creating Firebird database programatically (Delphi)"
date: 2006-04-18T12:45:00Z
tags:
  - Delphi/Object Pascal/Pascal
  - Firebird
layout: post
---
Today my colleague asked me the question, "How to create FB database programatically from Delphi?". Well, the solution is very easy, just use the following code (it's using the InterBase Express components):

```delphi
IBDatabase1.DatabaseName := ChangeFileExt(Application.ExeName, '.fdb');
IBDatabase1.Params.Add('USER ''SYSDBA''');
IBDatabase1.Params.Add('PASSWORD ''masterkey''');
IBDatabase1.Params.Add('PAGE_SIZE 4096');
IBDatabase1.Params.Add('DEFAULT CHARACTER SET WIN1250');
IBDatabase1.CreateDatabase;
```