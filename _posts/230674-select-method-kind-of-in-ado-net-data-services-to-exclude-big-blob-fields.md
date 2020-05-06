---
title: |-
  Select method (kind of) in ADO.NET Data Services (to exclude big blob fields)
date: 2009-07-02T10:37:44Z
tags:
  - Entity Framework
  - OData/Data Services (Astoria)
---
Current version of ADO.NET Data Services doesn't support Select method. Neither the .NET Framework v4. This may cause you problems when your entity contains relatively big blob fields, like photo of user in users table/entity. You can do almost nothing with it.

Today I was facing exactly this problem. While inspecting some easy workarounds I found the [problem with non-public members in entity][1]. But I came with another solution. It's not directly solution to missing Select method support, but kind of workaround for blob fields, mainly focused on web usage.

First I deleted the blob column (in my case Photo) from my entity (in my case User). Then I created stored procedure to return this field from database and created [Function import][2]. If you're working with EF4, then the code for invoking the procedure is generated for you, in EFv1 you have to create it yourself as the procedure [returns non-entity result][3]. For this method I created [Service Operation method][4] with [WebGet][5] and [SingleResult][6] attributes, plus [MimeType][7] attribute. The method I returning directly `byte[]` (from .NET 4 you can directly return primitive types).

Sure, this field must be nullable or has some default value to support insert. For update the blob field you have to write another separate method. Yep, some manual work. ;)

Removing the field from EDM (remember you can have more models in you app, hence you don't have to change your model for desktop app for example) has some drawbacks and limits you. On the other hand, creating the separate method has some advantages. With all these attributes declared, you can call `http://something/Service.svc/GetUserPhoto/$value?id=x` and get the result back directly, with proper mime type. So you can easily use it in <img /> tag without any further processing (yes, with you could do `http://something/Service.svc/Users(x)/Photo/$value`, but that means not deleting the "Photo" property from model and when asking for entity getting all the binary data to the client, which is what I'm trying to avoid).

It's not the best solution one can imagine, sure. But works for selecting as well as updating/inserting, with only small limitation and small amount of extra work.

Here's the complete code, if you wanna try (no updating/inserting support, from EDM just Photo deleted):

```csharp
[MimeType("GetUserPhoto", "image/jpeg")]
public class SelectTest : DataService<TestEF>
{
	public static void InitializeService(IDataServiceConfiguration config)
	{
		config.SetEntitySetAccessRule("*", EntitySetRights.All);
		config.SetServiceOperationAccessRule("GetUserPhoto", ServiceOperationRights.All);
	}
	[WebGet]
	[SingleResult]
	public byte[] GetUserPhoto(int id)
	{
		return this.CurrentDataSource.GetUserPhoto(id).FirstOrDefault();
	}
}
```

```sql
create table Users (ID int primary key, FirstName nvarchar(255) not null, LastName nvarchar(255) not null, Photo varbinary(max));
go
create procedure GetUserPhoto(@ID int)
as
begin
  select Photo from Users where ID = @ID;
end
go
```

[1]: {{ include "post_link" 230669 }}
[2]: http://msdn.microsoft.com/en-us/library/bb896231.aspx
[3]: {{ include "post_link" 228940 }}
[4]: http://msdn.microsoft.com/en-us/library/cc668788(VS.100).aspx
[5]: http://msdn.microsoft.com/en-us/library/system.servicemodel.web.webgetattribute.aspx
[6]: http://msdn.microsoft.com/en-us/library/system.data.services.singleresultattribute.aspx
[7]: http://msdn.microsoft.com/en-us/library/system.data.services.mimetypeattribute.aspx