---
title: |-
  Unexpected finding about "await using var"
date: 2021-03-08T18:39:00Z
tags:
  - Roslyn
  - C#
---
I'm now updating my [ConfigureAwaitChecker][1] to handle `await using` and `await foreach` (release soon, if you'd like to ask) and when trying to handle `await using var` I was surprised how the compiler interprets that.

<!-- excerpt -->

Let me first clear, that the same applies to `using var`, I'm just going to use `await using var`, because that's what I'm actually working with.

#### Initial expectation

I always thought about the `await using var` as a shortcut. Shortcut in a sense that the pieces of code following are simply in `{` and `}` where the closing `}` would be at the of the method (or before other `}` from pieces of code above). And from a point of basic understanding how the code is going to behave that's absolutely fine and correct. But when dealing with syntax trees, the story is different. Very different.

#### Regular block

```csharp
public async Task M1() 
{
	await using (var _ = Foo())
	{ }
}
```

The code above is [`UsingStatementSyntax`][2] node and has an [`AwaitKeyword`][3]. So far so good.

![Regular block]({{ include "post_ilink" page "syntax-tree-1.png" }})

#### The "shortcut" block

```csharp
public async Task M2() 
{
	await using var _ = Foo();
}
```

Yet this code is completely different story. This is a [`LocalDeclarationStatementSyntax`][4], again with an [`AwaitKeyword`][5] and also with an [`UsingKeyword`][6]. Unexpected. Yes. At least it surprised me the first time. When you think about it obviously makes sense. It was just, ..., unexpected.

![The "shortcut" block]({{ include "post_ilink" page "syntax-tree-2.png" }})

#### Closing

And now you know. But unless you deal with syntax trees, Roslyn and analyzers and/or code fixes, well, I don't know if this has any value.

[1]: https://github.com/cincuranet/ConfigureAwaitChecker
[2]: https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.csharp.syntax.usingstatementsyntax?view=roslyn-dotnet
[3]: https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.csharp.syntax.usingstatementsyntax.awaitkeyword?view=roslyn-dotnet#Microsoft_CodeAnalysis_CSharp_Syntax_UsingStatementSyntax_AwaitKeyword
[4]: https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.csharp.syntax.localdeclarationstatementsyntax?view=roslyn-dotnet
[5]: https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.csharp.syntax.localdeclarationstatementsyntax.awaitkeyword?view=roslyn-dotnet#Microsoft_CodeAnalysis_CSharp_Syntax_LocalDeclarationStatementSyntax_AwaitKeyword
[6]: https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.csharp.syntax.localdeclarationstatementsyntax.usingkeyword?view=roslyn-dotnet#Microsoft_CodeAnalysis_CSharp_Syntax_LocalDeclarationStatementSyntax_UsingKeyword