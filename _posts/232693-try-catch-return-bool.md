---
title: |-
  Try catch return bool
date: 2012-01-24T11:41:36Z
tags:
  - .NET
  - C#
---
I was recently writing a lot of method that talked to 3<sup>rd</sup> party API. And after small refactoring a lot of methods was like try to call some method, if it throws exception return false, if not return true. And I was wondering, what's the best (in terms of code being generated, speed, efficiency but also readability) way to write it.

I found basically three ways to write it (sure there are other ways):

```csharp
try
{
	FooBar();
	return true;
}
catch (SomeException ex)
{
	LogException(ex);
	return false;
}
```

```csharp
try
{
	FooBar();
	return true;
}
catch (SomeException ex)
{
	LogException(ex);
}
return false;
```

```csharp
bool result = false;
try
{
	FooBar();
	result = true;
}
catch (SomeException ex)
{
	LogException(ex);
}
return result;
```

No magic. The third way is probably something you might recognize, if you were programming couple of years in Delphi/(Object)Pascal. Anyway, back to basics. My friend `ildasm` is going to help us with initial review, what we have actually done.

Everything compiled with full optimization turned on.

```text
.method private hidebysig static bool  Test1() cil managed
{
  // Code size       28 (0x1c)
  .maxstack  1
  .locals init (class TryCatchTest.SomeException V_0,
           bool V_1)
  IL_0000:  nop
  .try
  {
    IL_0001:  nop
    IL_0002:  call       void TryCatchTest.Program::FooBar()
    IL_0007:  nop
    IL_0008:  ldc.i4.1
    IL_0009:  stloc.1
    IL_000a:  leave.s    IL_0019
  }  // end .try
  catch TryCatchTest.SomeException
  {
    IL_000c:  stloc.0
    IL_000d:  nop
    IL_000e:  ldloc.0
    IL_000f:  call       void TryCatchTest.Program::LogException(class [mscorlib]System.Exception)
    IL_0014:  nop
    IL_0015:  ldc.i4.0
    IL_0016:  stloc.1
    IL_0017:  leave.s    IL_0019
  }  // end handler
  IL_0019:  nop
  IL_001a:  ldloc.1
  IL_001b:  ret
} // end of method Program::Test1
```

```text
.method private hidebysig static bool  Test2() cil managed
{
  // Code size       32 (0x20)
  .maxstack  1
  .locals init (class TryCatchTest.SomeException V_0,
           bool V_1)
  IL_0000:  nop
  .try
  {
    IL_0001:  nop
    IL_0002:  call       void TryCatchTest.Program::FooBar()
    IL_0007:  nop
    IL_0008:  ldc.i4.1
    IL_0009:  stloc.1
    IL_000a:  leave.s    IL_001d
  }  // end .try
  catch TryCatchTest.SomeException
  {
    IL_000c:  stloc.0
    IL_000d:  nop
    IL_000e:  ldloc.0
    IL_000f:  call       void TryCatchTest.Program::LogException(class [mscorlib]System.Exception)
    IL_0014:  nop
    IL_0015:  nop
    IL_0016:  leave.s    IL_0018
  }  // end handler
  IL_0018:  nop
  IL_0019:  ldc.i4.0
  IL_001a:  stloc.1
  IL_001b:  br.s       IL_001d
  IL_001d:  nop
  IL_001e:  ldloc.1
  IL_001f:  ret
} // end of method Program::Test2
```

```text
.method private hidebysig static bool  Test3() cil managed
{
  // Code size       34 (0x22)
  .maxstack  1
  .locals init (bool V_0,
           class TryCatchTest.SomeException V_1,
           bool V_2)
  IL_0000:  nop
  IL_0001:  ldc.i4.0
  IL_0002:  stloc.0
  .try
  {
    IL_0003:  nop
    IL_0004:  call       void TryCatchTest.Program::FooBar()
    IL_0009:  nop
    IL_000a:  ldc.i4.1
    IL_000b:  stloc.0
    IL_000c:  nop
    IL_000d:  leave.s    IL_001b
  }  // end .try
  catch TryCatchTest.SomeException
  {
    IL_000f:  stloc.1
    IL_0010:  nop
    IL_0011:  ldloc.1
    IL_0012:  call       void TryCatchTest.Program::LogException(class [mscorlib]System.Exception)
    IL_0017:  nop
    IL_0018:  nop
    IL_0019:  leave.s    IL_001b
  }  // end handler
  IL_001b:  nop
  IL_001c:  ldloc.0
  IL_001d:  stloc.2
  IL_001e:  br.s       IL_0020
  IL_0020:  ldloc.2
  IL_0021:  ret
} // end of method Program::Test3
```

The third way is longest and I think also least readable (taking into account it's C#). Also you can easily break the code. The first and second are really close in terms of code. The first one I'm using if I like to state, that after the exception is processed, nothing is going on further - "do, return or catch, return, done". Nor in catch block, nor after it. The second one I'm using if my code is like "do something and return something" and then "else recover based on error and return fallback result".

And what's your preference?