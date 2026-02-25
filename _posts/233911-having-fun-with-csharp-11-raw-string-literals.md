---
title: |-
  Having fun with C# 11 raw string literals
date: 2022-11-29T07:00:00Z
tags:
  - C#
  - Roslyn
---
The feature I'm most excited from freshly released C# 11 is _raw string literals_. You can read about the feature more [here][1]. In this blog post I'm going to try some limits. For fun. And learning.

<!-- excerpt -->

If you think the same way I do, the obvious first question to ask is whether there's some limit of number of double quotes at the beginning and end one can use... Let's try that.

I created a console app to help me quickly generate the file (note the usage of another nifty feature, _UTF-8 literals_).

```csharp
var prefix = """
    namespace CrazyRawStringLiterals;

    static class Generated
    {
        public static string String = 
    """u8;
var suffix = """
    ;
    }    
    """u8;
var path = Path.Join(Path.GetDirectoryName(Environment.ProcessPath), "..", "..", "..", "..", "CrazyRawStringLiterals", "Generated.cs");
using (var fs = new FileStream(path, new FileStreamOptions() { Access = FileAccess.Write, Mode = FileMode.Truncate, BufferSize = 64 * 1024 }))
{
    fs.Write(prefix);
    for (var i = 0; i < count; i++)
        fs.Write("\""u8);
    fs.Write("\r\n"u8);
    fs.Write("Test"u8);
    fs.Write("\r\n"u8);
    for (var i = 0; i < count; i++)
        fs.Write("\""u8);
    fs.Write(suffix);

    Console.WriteLine($"File is {fs.Length:#,0} bytes.");
}
```

Depending on the `count` variable it will generate raw string literal with that number of double quotes. I started hot and went directly with `int.MaxValue`. Which failed because the file was too big for Roslyn. The maximum I could do was `(int.MaxValue / 4) - 53`. The compilation was fast, nothing interesting. In case you'd like to try `- 52`, you'll end up in `System.OverflowException: Arithmetic operation resulted in an overflow.` at `Microsoft.CodeAnalysis.CSharp.Syntax.InternalSyntax.SlidingTextWindow.MoreChars`.

This left me unsatisfied. Nothing interesting happened. I was sad. But then I realized that any whitespace to the left of the closing double quotes will be removed from the string literal. That's something to try!

Another quick generator app.

```csharp
var prefix = """
    namespace CrazyRawStringLiterals;

    static class Generated
    {
        public static string String = 
    """u8;
var suffix = """
    ;
    }    
    """u8;
var path = Path.Join(Path.GetDirectoryName(Environment.ProcessPath), "..", "..", "..", "..", "CrazyRawStringLiterals", "Generated.cs");
using (var fs = new FileStream(path, new FileStreamOptions() { Access = FileAccess.Write, Mode = FileMode.Truncate, BufferSize = 64 * 1024 }))
{
    fs.Write(prefix);
    fs.Write("\"\"\""u8);
    fs.Write("\r\n"u8);
    for (var i = 0; i < count; i++)
        fs.Write(" "u8);
    fs.Write("Test"u8);
    fs.Write("\r\n"u8);
    for (var i = 0; i < count; i++)
        fs.Write(" "u8);
    fs.Write("\"\"\""u8);
    fs.Write(suffix);

    Console.WriteLine($"File is {fs.Length:#,0} bytes.");
}
```

This proved to be more interesting. After I played with small-ish files, I realized it takes a lot of time to compile such files. I went for big, but safe, `int.MaxValue / 10` and started the compilation. It took 2h39min on my machine to compile a simple console app using this file.

```
using CrazyRawStringLiterals;

Console.WriteLine(Generated.String);
```

Interesting? Maybe. On the other hand, you're not going to type such file. And when generated, it can be, with little effort, pre-processed. But it was fun. :)

[1]: https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-11#raw-string-literals

