---
title: |
  Firebird .NET provider and calling stored procedures with parameters
date: 2008-02-12T09:33:00Z
tags:
  - .NET
  - Firebird
layout: post
---
Firebird .NET provider has ability to create parameterized queries. Both named and unnamed parameters are supported. Everything works as you expect with select, insert, delete or update commands. The tricky part comes with stored procedures. Unlike MS SQL, that has direct support for named parameters, in provider, we're parsing parameter names and we're sending it to server "in right order”, so developer doesn't need to know, that internally parameters were send unnamed.

But with stored procedure you (developer) expect, that creating named parameter with same name as parameter in stored procedure, the parameter will be sent to right SP's parameter. Let see this example. First we create simple procedure:

```sql
SET TERM ^ ;
CREATE PROCEDURE TestSP
 ( a int, b int )
RETURNS
 ( result int )
AS
BEGIN
  result = a - b;
  suspend;
END^
SET TERM ;^
```

When you test call it, i.e. select * from TestSP(10, 5); you get expected result (5). Now create simple program:

```csharp
using (FbConnection conn = new FbConnection(@"data source=localhost;initial catalog=ucime;user id=SYSDBA;password=masterkey"))
{
    conn.Open();
    using (FbCommand cmd = conn.CreateCommand())
    {
        cmd.CommandText = "TestSP";
        cmd.CommandType = CommandType.StoredProcedure;
        cmd.Parameters.Add("@b", FbDbType.Integer).Value = 5;
        cmd.Parameters.Add("@a", FbDbType.Integer).Value = 10;
        int result = (int)cmd.ExecuteScalar();
        Console.WriteLine(result);
    }
}
```

When you run it, you got -5 on the output. What's wrong? Well, as I stated above, Firebird has no support for named parameters and provider isn't aware of name of parameters in stored procedure, in fact you can name it whatever you want, because only thing that matter is the order of parameters.

Solution? Well it's pretty easy. Use "select <column> from <stored procedure>" or "execute procedure <stored procedure>" instead of defining CommandType as StoredProcedure (internally is this handled in same way). The fragment could look like:

```csharp
cmd.CommandText = "select * from TestSP(@a, @b);";
//cmd.CommandType = CommandType.StoredProcedure;
cmd.Parameters.Add("@b", FbDbType.Integer).Value = 5;
cmd.Parameters.Add("@a", FbDbType.Integer).Value = 10;
```

I hope this helps prevent some confusion when using Firebird database in .NET using FirebirdClient (when using parameterized queries, which are sign of good programming style).

Originally created for [Databazovy svet][1].

[1]: http://www.dbsvet.cz/