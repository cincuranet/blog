---
title: |-
  How to store GUID values (not only from .NET) on a Firebird database
date: 2007-07-08T11:26:00Z
tags:
  - .NET
  - Firebird
---
After [Binding Boolean fields from Firebird][1] post few days ago I got some comments about GUID values in Firebird. Firebird doesn't have some native guid-datatype alike to bool. :) But the solution is there (well, people around Firebird can do anything with FB ;)).

The most common way is to use CHAR field with character set `OCTETS`. You can of course use CHAR with i.e. NONE charset, but you're only wasting space. Creating column as `CHAR(16) CHARACTER SET OCTETS` will fit all your needs with GUID. Why only 16-chars length? Because when you use octets, you're saving data in "byte" form. So 128 is 16 x 8 and therefore `CHAR(16)` is good.

To test this, you can use this simple peice of code:

```csharp
using (FbConnection conn = new FbConnection(connectionStringBuilder.ToString()))
{
  conn.Open();
  using (FbCommand cmd = conn.CreateCommand())
  {
    // first create the table for testing
    cmd.CommandText = "recreate table GUID_test (guid char(16) character set octets)";
    cmd.ExecuteNonQuery();
  }
  using (FbCommand cmd = conn.CreateCommand())
  {
    // working with GUID
    cmd.CommandText = "insert into GUID_test values (@guid)";
    // classic way, works good
    cmd.Parameters.Add("@guid", FbDbType.Char, 16).Value = Guid.NewGuid().ToByteArray();
    // another way, maybe better readability, but same result
    cmd.Parameters.Add("@guid", FbDbType.Guid).Value = Guid.NewGuid();
    cmd.ExecuteNonQuery();
  }
  using (FbCommand cmd = conn.CreateCommand())
  {
    // drop it, it has no real application
    cmd.CommandText = "drop table GUID_test";
    cmd.ExecuteNonQuery();
  }
}
```

[1]: {{ include "post_link" 225918 }}