---
title: |-
  One big EXE file with all the DLLs in .NET
date: 2016-11-05T07:28:00Z
tags:
  - .NET
  - C#
  - IL
layout: post
---
Where do I begin? ... If you're developing classic client side applications, like WinForms, having a one big EXE file to deploy is a huge benefit. One item to copy, you know all the dependencies are there and nobody can accidentally remove some, plus updating is a breeze too.

Sadly there's nothing in the .NET available right now (my hopes are high for .NET Native). So you have to find some other way. Luckily there's a way, in fact multiple.

<!-- excerpt -->

There are some products on the market you can use - like [_ILMerge_][1], [_SmartAssembly_][2] or [_PostSharp_][8]. In fact we used _SmartAssembly_, but lately it was getting more into our way instead of helping us. Thus decision has been made to replace it - and to my pleasure - replace it with something I'll create. :)

The path I chose, because I used it manually couple fo times before, was to use [`AppDomain.AssemblyResolve` event][3]. Handling this event you can load assembly the way you want. In my case from resources. The rest is just a glue. I also wanted to have a tool that will be fully autonomous and independent from the application itself.

For the impatient [here][4]'s the tool. Run it without any parameters and it gives you help. If you're interested in details continue reading.

#### Embedding DLLs into resource

First step was taking all the DLLs around the EXE file and creating resources from these. For this, as for the rest of the project, I used with great pleasure [Mono.Cecil library][6]. The code is really easy.

```csharp
static void EmbeddDlls(AssemblyDefinition assembly, string directory)
{
	var resources = assembly.MainModule.Resources;
	foreach (var dll in Directory.EnumerateFiles(directory, "*.dll", SearchOption.TopDirectoryOnly))
	{
		var name = dll.Remove(0, directory.Length + 1);
		Console.WriteLine($"  {name}");
		var resource = new EmbeddedResource($"{Definitions.Prefix}{name}", ManifestResourceAttributes.Private, File.ReadAllBytes(dll));
		resources.Add(resource);
	}
}
```

I'm giving the resources a prefix with a pipe `|` symbol as a separator to minimize collisions.

#### Injecting `AppDomain.AssemblyResolve` event

This event needs to be handled as soon as possible, before any dependencies are needed and itself needs to be self-contained because the dependencies loading is just running. So I decided the good place to put it is a static constructor of the class where the entry point is. To minimize any code I have to generate I'm just calling an injected method (more about that in following section) that does all the steps for attaching a handler to the event.

Only small hurdle is that I need to either generate completely new static constructor if there's none or inject into existing otherwise, handling also the `beforefieldinit` flag.

```csharp
public static void ProcessCctor(TypeDefinition type, string prefix)
{
	var cctor = type.Methods.FirstOrDefault(m => m.IsStatic && m.IsConstructor);
	if (cctor == null)
	{
		cctor = new MethodDefinition(
			CctorName,
			MethodAttributes.Private | MethodAttributes.Static | MethodAttributes.HideBySig | MethodAttributes.SpecialName | MethodAttributes.RTSpecialName,
			type.Module.Import(typeof(void)));
		cctor.Body.Instructions.Add(Instruction.Create(OpCodes.Ret));
		type.Methods.Add(cctor);
	}
	type.Attributes = type.Attributes & ~TypeAttributes.BeforeFieldInit;
	cctor.Body.Instructions.Insert(0, Instruction.Create(OpCodes.Call, new MethodReference($"{prefix}.cctor", cctor.ReturnType, type)));
}
```

I inject the simple `call` instruction at the beginning and that's it.

#### The assembly loading code

Because I didn't wanted to generate everything in IL manually I opted for compiling the actual code into my executable and then "just copying it" to the executable I'm processing.

The code is in a class in a shape I'd like to have it in the entry point's class at the end. And it's trying to use as less C# features as possible to make the copying simple. For example _lambdas_ often create _closures_, which are classes in `IL` and that increases the complexity. But because the code is really not long, sticking to basic C# is fine for me.

```csharp
static class InjectMe
{
	static InjectMe()
	{
		AppDomain.CurrentDomain.AssemblyResolve += AssemblyResolve;
	}

	static Assembly AssemblyResolve(object sender, ResolveEventArgs args)
	{
		var assemblyName = new AssemblyName(args.Name);
		return GetLoadedAssembly(assemblyName) ?? GetEmbeddedAssembly(assemblyName);
	}

	static Assembly GetLoadedAssembly(AssemblyName assemblyName)
	{
		foreach (var a in AppDomain.CurrentDomain.GetAssemblies())
		{
			if (a.FullName == assemblyName.FullName || a.GetName().Name == assemblyName.Name)
			{
				return a;
			}
		}
		return null;
	}

	static Assembly GetEmbeddedAssembly(AssemblyName assemblyName)
	{
		var executingAssembly = Assembly.GetExecutingAssembly();
		foreach (var resourceName in executingAssembly.GetManifestResourceNames())
		{
			using (var s = executingAssembly.GetManifestResourceStream($"{Definitions.Prefix}{assemblyName.Name}.dll"))
			{
				if (s != null)
				{
					using (BinaryReader reader = new BinaryReader(s))
					{
						return Assembly.Load(reader.ReadBytes((int)s.Length));
					}
				}
			}
		}
		return null;
	}
}
```

#### Copying the assembly loading code

I thought it will be "just copying it". In fact it needed some processing around as well. Importing into modules. Handling names, because, similar to the resources, I used the same prefix to minimize collisions. 

It took me a while to figure everything out. Mostly by trial and error, comparing the IL a lot in [`ILSpy`][7] and thinking about errors from `Mono.Cecil`. Through it was tedious, I liked it! So much of new stuff (like module imports)!

```csharp
static MethodDefinition CopyMethod(MethodDefinition source, TypeDefinition destination, string prefix)
{
	var targetModule = destination.Module;
	var newMethod = new MethodDefinition($"{prefix}{source.Name}", FixAttributes(source.Attributes), targetModule.Import(source.ReturnType));

	foreach (var p in source.Parameters)
	{
		newMethod.Parameters.Add(DuplicateParameter(p, targetModule));
	}
	newMethod.Body.InitLocals = source.Body.InitLocals;
	foreach (var v in source.Body.Variables)
	{
		newMethod.Body.Variables.Add(DuplicateVariable(v, targetModule));
	}
	foreach (var i in source.Body.Instructions)
	{
		var operand = i.Operand;

		if (operand is MethodReference)
		{
			var methodReference = operand as MethodReference;
			if (methodReference.DeclaringType == source.DeclaringType)
			{
				methodReference = FixLocalMethodReference(methodReference, destination, prefix, targetModule);
			}
			newMethod.Body.Instructions.Add(Instruction.Create(i.OpCode, targetModule.Import(methodReference)));
			continue;
		}
		if (operand is FieldReference)
		{
			newMethod.Body.Instructions.Add(Instruction.Create(i.OpCode, targetModule.Import(operand as FieldReference)));
			continue;
		}
		if (operand is TypeReference)
		{
			newMethod.Body.Instructions.Add(Instruction.Create(i.OpCode, targetModule.Import(operand as TypeReference)));
			continue;
		}

		newMethod.Body.Instructions.Add(i);
	}
	foreach (var eh in source.Body.ExceptionHandlers)
	{
		newMethod.Body.ExceptionHandlers.Add(DuplicateExceptionHandler(eh, source, newMethod, targetModule));
	}

	destination.Methods.Add(newMethod);
	return newMethod;
}

static MethodAttributes FixAttributes(MethodAttributes attributes)
{
	return attributes & ~MethodAttributes.RTSpecialName & ~MethodAttributes.SpecialName;
}

static MethodReference FixLocalMethodReference(MethodReference m, TypeDefinition destination, string prefix, ModuleDefinition targetModule)
{
	var method = new MethodReference($"{prefix}{m.Name}", targetModule.Import(m.ReturnType), destination);
	foreach (var p in m.Parameters)
	{
		method.Parameters.Add(DuplicateParameter(p, targetModule));
	}
	return method;
}

static VariableDefinition DuplicateVariable(VariableDefinition v, ModuleDefinition targetModule)
{
	return new VariableDefinition(v.Name, targetModule.Import(v.VariableType));
}

static ParameterDefinition DuplicateParameter(ParameterDefinition p, ModuleDefinition targetModule)
{
	return new ParameterDefinition(p.Name, p.Attributes, targetModule.Import(p.ParameterType));
}

static ExceptionHandler DuplicateExceptionHandler(ExceptionHandler eh, MethodDefinition source, MethodDefinition newMethod, ModuleDefinition targetModule)
{
	return new ExceptionHandler(eh.HandlerType)
	{
		CatchType = eh.CatchType != null ? targetModule.Import(eh.CatchType) : null,
		TryStart = newMethod.Body.Instructions[source.Body.Instructions.IndexOf(eh.TryStart)],
		TryEnd = newMethod.Body.Instructions[source.Body.Instructions.IndexOf(eh.TryEnd)],
		HandlerType = eh.HandlerType,
		HandlerStart = newMethod.Body.Instructions[source.Body.Instructions.IndexOf(eh.HandlerStart)],
		HandlerEnd = newMethod.Body.Instructions[source.Body.Instructions.IndexOf(eh.HandlerEnd)],
		FilterStart = eh.FilterStart,
	};
}
```

#### Summary

It was a joy to work on something simple and straightforward from outside, learning more about the internals of `IL` and .NET. I could get used to it. :)

The complete code is available in [this repository][5]. Feel free to contribute and improve it. 

> [Related story.][9]

[1]: https://www.microsoft.com/en-us/download/details.aspx?id=17630
[2]: https://www.red-gate.com/products/dotnet-development/smartassembly/
[3]: https://msdn.microsoft.com/en-us/library/system.appdomain.assemblyresolve%28v=vs.110%29.aspx
[4]: https://www.nuget.org/packages/SingleExecutable/
[5]: https://github.com/cincuranet/SingleExecutable/
[6]: http://www.mono-project.com/docs/tools+libraries/libraries/Mono.Cecil/
[7]: http://ilspy.net/
[8]: https://www.postsharp.net/
[9]: {% post_url 0000-00-00-233585-shortcutting-went-wrong-the-method-needs-to-be-jited-completely %}