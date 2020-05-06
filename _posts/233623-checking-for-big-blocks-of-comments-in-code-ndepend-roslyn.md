---
title: |-
  Checking for big blocks of comments in code (NDepend, Roslyn)
date: 2017-05-21T07:12:00Z
tags:
  - .NET
  - C#
  - Roslyn
  - NDepend
---
I don't like comments. Most of the time information in comments is wrong and obsolete. I believe the code should be clear as a fresh snow. Most of the time. Some design decisions or measurements can be commented, but not the code itself. If it needs commenting, it should be rewritten.

One cardinal sin I can't live with is commenting out code, just because you might need it later or because it's being "refactored". Nonsense. Sadly, this is done so often in a team where I'm responsible for code quality. Lucky me. 

Thus, to prevent it I decided to test for big chunks of comments in the codebase using a code. More specifically NDepend or Roslyn. Whatever will do the job.

<!-- excerpt -->

#### NDepend

I first started with NDepend, because NDepend has a handy property [`NbLinesOfComment`][1] (and because Patrick Smacchia again gave me license for up-to-date version of NDepend). I used fairly simple CQLinq rule to detect the comments. Couldn't be easier. But then I started wondering how and where I'm going to execute it. Most of the code quality metrics are a separate configuration executed by TeamCity. Although I can integrate NDepend with TeamCity fine, at the configuration I don't have the binaries (and NDepend needs binaries as well as source code for this). The tools I'm using are handling the source code only. Although I can get the binaries there, I didn't like the idea for this setup. Let's try Roslyn.

#### Roslyn

With Roslyn I can create a simple console app that will scan all the files in solution, without the binaries. Of course, I have to write all the code myself instead of just using the `NbLinesOfComment` property. I knew from my [TODO checking attempt][2] the comments are parsed as trivia without much more information. Initially I started writing just a LINQ query on nodes and tokens trying to extract some information about comments. That didn't work so I wrote a simple `CSharpSyntaxWalker`.

```csharp
class CommentsWalker : CSharpSyntaxWalker
{
    List<(int start, int end, int sentinel)> _comments;

    public IEnumerable<(int start, int end)> Comments => _comments.Select(x => (x.start, x.end));

    public CommentsWalker()
        : base(SyntaxWalkerDepth.StructuredTrivia)
    {
        _comments = new List<(int, int, int)>();
    }

    public override void VisitTrivia(SyntaxTrivia trivia)
    {
        if (trivia.IsKind(SyntaxKind.SingleLineCommentTrivia) || trivia.IsKind(SyntaxKind.MultiLineCommentTrivia))
        {
            var startLine = trivia.GetLocation().GetMappedLineSpan().StartLinePosition.Line;
            var nextTokenLine = trivia.Token.GetLocation().GetMappedLineSpan().StartLinePosition.Line;
            var index = _comments.FindIndex(x => x.sentinel == nextTokenLine);
            if (index != -1)
            {
                var item = _comments[index];
                _comments[index] = (item.start, startLine, item.sentinel);
            }
            else
            {
                _comments.Add((startLine, startLine, nextTokenLine));
            }
        }
    }
}
```

Yes. I was lazy to create a proper object for the list I was using and I used C# 7's tuples. The code is looking for `SingleLineCommentTrivia` or `MultiLineCommentTrivia` and a token after. The token allows me to see where next code is. From that I'm just looking for the end of the comments block, ignoring any, basically, whitespaces. Empty line in comments doesn't make it two blocks of comments for me. With that I have ranges where the comments are and I can have some logic on top of it.

```csharp
var workspace = MSBuildWorkspace.Create();
var solution = await workspace.OpenSolutionAsync(SolutionFile);
var documents = solution
    .Projects
    .SelectMany(x => x.Documents)
    .Where(InterestingFile);
foreach (var document in documents)
{
    var root = await document.GetSyntaxRootAsync();
    var walker = new CommentsWalker();
    walker.Visit(root);
    var comments = walker.Comments;
    if (comments.Any())
    {
        foreach (var item in comments)
        {
            if (item.end - item.start + 1 >= CommentLinesLimit)
            {
                var name = document.FilePath.Replace(SolutionDir, string.Empty);
                Console.WriteLine($"##teamcity[buildProblem description='File {name} has {CommentLinesLimit} or more lines of comments starting on L{item.start + 1}-{item.end + 1}']"); 
            }
        }
    }
}
```

I open the solution using the `MSBuildWorkspace` and go through all of the files. The `InterestingFile` method filters some files out (like generated files, `.Designer.cs`, etc.). From that I check whether the range of comment block is over `CommentLinesLimit` constant and if so I report a problem to TeamCity via [script interaction message][3].

#### Final thoughts

With that in place I can easily catch big blocks of comments so it is caught even before the code reviews time. Right now the `CommentLinesLimit` is `20`, which already uncovered complete classes being commented out and still in the code base. My plan is to slowly lower it down to probably `5`. Although I personally would be happy with even like `3`, people would start whining and arguing with me why this comment really needs to be there yadada. 

As usual with such tools, this is not perfect. One can outsmart it easily. And I don't want to make it super smart. Then it becomes a cat vs mouse fight instead of a safety net for clean(er) code. I'm trying to teach people that everybody will benefit from clean code at the end (failing so far, if you'd like to ask).

[1]: http://www.ndepend.com/docs/code-metrics#NbLinesOfComment
[2]: {{ include "post_link" 233551 }}
[3]: https://confluence.jetbrains.com/display/TCD10/Build+Script+Interaction+with+TeamCity#BuildScriptInteractionwithTeamCity-ReportingBuildProblems