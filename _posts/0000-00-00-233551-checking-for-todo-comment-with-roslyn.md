---
title: |-
  Checking for "TODO" comment with Roslyn
date: 2016-02-19T10:36:00Z
tags:
  - Roslyn
  - C#
layout: post
---
This week I was [speaking at a local user group][1] and got a fairly interesting question for Roslyn analyzers - search for `// TODO: something` comments and do something with it. I think it's a great idea, because the comment is not a code exactly, but still Roslyn processes it. And to make it bit more interesting I decided not to sketch some analyzer for Visual Studio, but create just a raw console application that reports these comments, so anybody can tweak it for own needs (or eventually create a full blown analyzer from it, it's just a few lines of code).

<!-- excerpt -->

Into plain console application I added some packages. The `Microsoft.CodeAnalysis.CSharp` and `Microsoft.CodeAnalysis.CSharp.Workspaces` are what I need (and of course the dependencies).

I just need to find the files somewhat and check them all. So I need to load solution or project file. The `Workspace` and `MSBuildWorkspace` namely to help me. Once I have that I can easily loop through projects (`workspace.CurrentSolution.Projects`) and files (`project.Documents`). From that it's analyzing as usual. Find the `SingleLineCommentTrivia` and work on it.

Here's the code.

```csharp
const int ExitOK = 0;
const int ExitError = 99;
const int ExitIssueFound = 1;

static async Task<int> MainAsync(string[] args)
{
	var workspace = await GetWorkspace().ConfigureAwait(false);
	if (workspace == null)
		return ExitError;
	using (workspace)
	{
		var issueFound = false;
		foreach (var project in workspace.CurrentSolution.Projects)
		{
			foreach (var document in project.Documents)
			{
				var documentWritten = false;
				var root = await document.GetSyntaxRootAsync().ConfigureAwait(false);
				foreach (var item in root.DescendantTrivia().Where(x => x.IsKind(SyntaxKind.SingleLineCommentTrivia)))
				{
					var match = Regex.Match(item.ToFullString(), @"//\s?TODO:\s*(.*)");
					if (match.Success)
					{
						issueFound = true;
						var text = match.Groups[1].Value;
						if (!documentWritten)
						{
							documentWritten = true;
							Console.WriteLine(MinimizePath(document.FilePath));
						}
						var position = item.GetLocation().GetMappedLineSpan();
						var line = position.StartLinePosition.Line;
						Console.WriteLine($"\tL{line}:\t{text}");
					}
				}
			}
		}
		return issueFound ? ExitIssueFound : ExitOK;
	}
}

static async Task<Workspace> GetWorkspace()
{
	var workspace = MSBuildWorkspace.Create();
	var solution = Directory.EnumerateFiles(Environment.CurrentDirectory, "*.sln", SearchOption.TopDirectoryOnly).FirstOrDefault();
	if (solution != null)
	{
		await workspace.OpenSolutionAsync(solution).ConfigureAwait(false);
		return workspace;
	}
	var project = Directory.EnumerateFiles(Environment.CurrentDirectory, "*.csproj", SearchOption.TopDirectoryOnly).FirstOrDefault();
	if (project != null)
	{
		await workspace.OpenProjectAsync(project).ConfigureAwait(false);
		return workspace;
	}
	return null;
}

static string MinimizePath(string path)
{
	return path.Remove(0, Environment.CurrentDirectory.Length + 1);
}
```

I'm trying to find first solution file and then C# project file in current directory. Straightforward. Once I have that I do the looping and looking for the magic comment. Bit of writing to console (for humans, probably) and exit codes (for machines).

And there you have it. Take it, use it, change it. Enjoy.

[1]: {% post_url 0000-00-00-233548-wug-roslyn-analyzatory-kodu-a-code-fixes-zlin %}