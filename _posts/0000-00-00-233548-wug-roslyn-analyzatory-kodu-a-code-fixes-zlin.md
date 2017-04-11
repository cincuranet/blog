---
title: |-
  WUG: Roslyn: Analyzátory kódu a code fixes (Zlín)
date: 2016-02-09T08:00:00Z
tags:
  - Presentations &amp; Speaking
  - Visual Studio
  - Roslyn
  - C#
layout: post
---
Po [Praze][2] se na zoubek analyzátorům podíváme i ve Zlíně - 16.2.2016 od 17:30 na [WUGu][1].

<!-- excerpt -->

##### Update (Feb 2016)

Protože mám rád věci více interaktivní, tak zvláště na komunitní akce nedělám předpřipravená dema. Lépe se to pak přizpůsobí aktuálnímu stavu. No a včera jsem zaboha nemohl ukázat, jak (ne)použití `WithAdditionalAnnotations(Formatter.Annotation)` změní výsledek. Asi málokdy člověk chce, aby to _nebylo_ zformátované. Ale já to v tu chvíli chtěl. No a kde byl háček? Když člověk neposkládá celý kód sám, ale použije metody, kde může některé "nezajímavé" parametry vypustit (jako třeba jasně očekávané závorky u bloku), odekorují se elementy implicitně. Protože proč jinak, že? Stačí porovnat otevírací a zavírací závorku v tomto případě (zkuste odkomentovat i `WithAdditionalAnnotations`).

```csharp
SyntaxFactory.Block()
	.WithOpenBraceToken(
	    SyntaxFactory.Token(
	        SyntaxFactory.TriviaList(),
	        SyntaxKind.OpenBraceToken,
	        SyntaxFactory.TriviaList())/*.WithAdditionalAnnotations(Formatter.Annotation)*/)
	.WithCloseBraceToken(SyntaxFactory.Token(SyntaxKind.CloseBraceToken))
```

A nebo prostě s výsledkem tohoto.

```csharp
SyntaxFactory.Block()
```

A případně se podívat na property `ContainsAnnotations` u závorek.

[1]: http://wug.cz/zlin/akce/763-Roslyn-Analyzatory-kodu-a-code-fixes
[2]: {% post_url 0000-00-00-233540-wug-roslyn-analyzatory-kodu-a-code-fixes-praha %}/