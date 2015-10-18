---
title: "Rename all fields to start with underscore (Roslyn analyzer and codefix)"
date: 2015-10-18T16:28:00Z
tags:
  - C#
  - .NET
  - Roslyn
  - Visual Studio
redirect_from: /id/233534/
category: none
layout: post
---
The task was pretty simple. I had a solution with a lot of objects and the naming of fields was not nice. How can I solve that, preferably without too much manual labor? Of course, automate!

<!-- excerpt -->

The problem with code is that you need to have at least minimal context information else the automation will just break - although very quickly - a lot of stuff. Clearly the regex will not cut it. Luckily with Visual Studio 2015 and Roslyn I can use compiler-as-a-service and write so called _analyzer_ and _codefix_. I [have written][1] few already so I knew this path was a good path.

So basically I want every (private) field of an object to start with an underscore and then the original name (some people also use `m_Whatever`) aka the `string name;` becomes `string _name;`. In whole solution. Of course all the uses renamed as well. Nothing else. Well, I'm skipping `static` fields and `struct`s. For obvious reasons.

Here's the code for analyzer and the codefix.

```csharp
[DiagnosticAnalyzer(LanguageNames.CSharp)]
public class UnderscoreForPrivateFieldAnalyzer : DiagnosticAnalyzer
{
	public const string DiagnosticId = "FieldUnderscore";

	private static DiagnosticDescriptor Rule = new DiagnosticDescriptor(DiagnosticId, "FU001", "Field {0} does not start with `_`", "Naming", DiagnosticSeverity.Warning, isEnabledByDefault: true);

	public override ImmutableArray<DiagnosticDescriptor> SupportedDiagnostics { get { return ImmutableArray.Create(Rule); } }

	public override void Initialize(AnalysisContext context)
	{
		context.RegisterSymbolAction(AnalyzeField, SymbolKind.Field);
	}

	private static void AnalyzeField(SymbolAnalysisContext context)
	{
		var field = (IFieldSymbol)context.Symbol;
		if (field.IsStatic)
			return;
		if (field.ContainingType.TypeKind == TypeKind.Struct)
			return;
		if (!field.Name.StartsWith("_", StringComparison.Ordinal))
		{
			var diagnostic = Diagnostic.Create(Rule, field.Locations[0], field.Name);
			context.ReportDiagnostic(diagnostic);
		}
	}
}
```

```csharp
[ExportCodeFixProvider(LanguageNames.CSharp, Name = nameof(UnderscoreForPrivateFieldCodeFixProvider)), Shared]
public class UnderscoreForPrivateFieldCodeFixProvider : CodeFixProvider
{
	public sealed override ImmutableArray<string> FixableDiagnosticIds
	{
		get { return ImmutableArray.Create(UnderscoreForPrivateFieldAnalyzer.DiagnosticId); }
	}

	public sealed override FixAllProvider GetFixAllProvider()
	{
		return WellKnownFixAllProviders.BatchFixer;
	}

	public sealed override async Task RegisterCodeFixesAsync(CodeFixContext context)
	{
		var root = await context.Document.GetSyntaxRootAsync(context.CancellationToken).ConfigureAwait(false);
		var diagnostic = context.Diagnostics.First();
		var token = root.FindToken(diagnostic.Location.SourceSpan.Start);
		context.RegisterCodeFix(
			CodeAction.Create("Prepend `_` to field", c => PrependUnderscore(context.Document, token, c), UnderscoreForPrivateFieldAnalyzer.DiagnosticId),
			diagnostic);
	}

	private async Task<Solution> PrependUnderscore(Document document, SyntaxToken declaration, CancellationToken cancellationToken)
	{
		var newName = $"_{declaration.ValueText}";
		var semanticModel = await document.GetSemanticModelAsync(cancellationToken);
		var symbol = semanticModel.GetDeclaredSymbol(declaration.Parent, cancellationToken);
		var solution = document.Project.Solution;
		return await Renamer.RenameSymbolAsync(solution, symbol, newName, solution.Workspace.Options, cancellationToken);
	}
}
```

It's pretty raw and simple. Doing only what _I_ needed. No tests 8-).

Anyway if you're interested improving it or integrating it into some of these big refactoring packages, be my guest. Just please keep the credits.

[1]: {{ site.url }}{% post_url 2015-08-22-233523-checking-for-configureawait-false-as-visual-studio-2015-analyzer %}