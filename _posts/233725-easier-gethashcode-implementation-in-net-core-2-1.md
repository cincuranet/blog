---
title: |-
  Easier GetHashCode implementation in .NET Core 2.1
date: 2018-06-05T11:38:00Z
tags:
  - .NET
  - .NET Standard
  - .NET Core
  - C#
---
Writing correct [`GetHashCode`][1] implementation is difficult. I know you've written it before and simple `xor`-ing looks fine. But trust me, it's more than that. Especially if you want your implementation to be solid and useful for hash-tables etc. And .NET was not helping in any way. Until now.

<!-- excerpt -->

In .NET Core 2.1 a new `struct` was added. It's called [`System.HashCode`][2] and it makes generating hash codes super convenient. Have a look at this class.

```csharp
class Person
{
	public string FirstName { get; set; }
	public string LastName { get; set; }

	public override int GetHashCode() => HashCode.Combine(FirstName, LastName);
}
```

That's all I have to do! _Proper_ hash code implementation. I don't have to care about `null`s, distribution, uniqueness, speed, ... Of course one should, for solid code, also provide `Equals` override (and maybe also `IEquatable<T>` implementation).

Sadly this `struct` is not part of .NET Framework 4.7.2 (or any older) nor it's available on NuGet. Not talking about .NET Standard 2.0 (or 2.1?). But hope is not lost. It might become available [on NuGet as an OOB package][4].

[1]: https://docs.microsoft.com/en-us/dotnet/api/system.object.gethashcode?view=netframework-4.7.2
[2]: https://github.com/dotnet/coreclr/blob/master/src/System.Private.CoreLib/shared/System/HashCode.cs
[3]: https://docs.microsoft.com/en-us/dotnet/api/system.object.equals?view=netframework-4.7.2
[4]: https://github.com/dotnet/corefx/issues/26412