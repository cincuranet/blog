---
title: |-
  Generics, structs and nulls - the JIT is smart so you don't have to
date: 2019-05-07T10:34:00Z
tags:
  - .NET Core
  - JIT
  - RyuJIT
---
Few days back I learned geeky little piece about JIT. This is exactly the type of knowledge you don't have to use, maybe ever, yet it's crucial the JIT handles it (so you don't have to), because every smart instruction is performance gained. Literally, every instruction or every CPU cycle counts.

<!-- excerpt -->

Let's start with this piece fairly normal, minus the dummy return values, code in a generic class (C# 7.x).

```csharp
class MyGeneric<T>
{
	T _instance;

	public MyGeneric(T instance)
	{
		_instance = instance;
	}

	public string Do()
	{
		if (_instance == null)
		{
			return "null";
		}
		return "foobar";
	}
}
```

If you're here and still remember the title of this post you can probably see where this is going. When the `MyGeneric<T>` would be instantiated with `T` being a value type, the `null` check completely useless and always false. Because value type can't be null. That means the whole `if` condition can be skipped and also the code in the `if` can be skipped. Not only skipped, even not generated at all. That would help not only memory usage, but also instruction cache, branch predictor, etc.

As you undoubtedly guessed, the JIT is doing that. Trying the fully optimized build, without (initially) debugger attached, with `MyGeneric<DateTime>` and `MyGeneric<object>` gives these assembly instructions (.NET Core 2.2.4, 64bit RyuJIT).

```asm
00007FFA256115C0  movsx       rax,byte ptr [rcx]
00007FFA256115C4  mov         rax,21739033068h
00007FFA256115CE  mov         rax,qword ptr [rax]
00007FFA256115D1  ret
```

```asm
00007FFA256115F0  cmp         qword ptr [rcx+8],0
00007FFA256115F5  jne         00007FFA25611605
00007FFA256115F7  mov         rax,21739033070h
00007FFA25611601  mov         rax,qword ptr [rax]
00007FFA25611604  ret
00007FFA25611605  mov         rax,21739033068h
00007FFA2561160F  mov         rax,qword ptr [rax]
00007FFA25611612  ret
```

The second assembly clearly has the `if` (`cmp` and `jne`) logic compared to the first one that does not. Less instructions: ✓; less branching: ✓. All this is done conveniently for you. You don't have to think about it (unless you're actually part of the JIT team, of course) yet the code is "optimal".

Plus, few of us can geek about it. Happy geeking.