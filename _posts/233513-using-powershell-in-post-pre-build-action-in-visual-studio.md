---
title: |-
  Using PowerShell in post/pre build action in Visual Studio
date: 2015-07-15T17:51:00Z
tags:
  - Visual Studio
  - PowerShell
---
Let's say it. Batch files are plain simple for any real developer to use. [PowerShell][1] rocks. Sadly in Visual Studio in fairly useful feature of post/pre build actions you can by default use only batch files. Normally for full builds I use [psake][2] or I just script it on build server as next step, but today I needed it directly in Visual Studio. Time to start playing. 

<!-- excerpt -->

To make editing easier I decided to create file `post-build.ps1` (I needed just post build action). This way I don't need to go to Properties window just to change something in script. I then set this file to be copied to output directory.

The invocation is not difficult. Visual Studio executes the commands with output directory as working directory so I know where the relative paths start from. Then I just added simple command to post build action to execute the script.

```batch
powershell.exe -ExecutionPolicy Bypass -NoProfile -NonInteractive -File post-build.ps1
```

I'm setting `ExecutionPolicy` to `Bypass` in case somebody would not have it set to `Unrestricted`. ;) I'm using `NoProfile` as I often use plain PowerShell and loading my profile would just slow it a bit. Of course `NonInteractive` because, well, there is no interaction possible. And finally the `File` with my script file. Because I set it to be copied to output directory and the commands are executed with output directory as working directory I can just use the name without any juggling with paths.

There's one final piece I needed to do. Exit codes. If (or when ;)) the script fails it should return non zero exit code so the Visual Studio know something happened. I just put everything into `try`-`catch` block, but surely there's multiple options (like PowerShell's `trap`).

```powershell
try {
	# code
}
catch {
	exit 1
}
```

And that's it. Smooth.     

[1]: https://en.wikipedia.org/wiki/Windows_PowerShell
[2]: https://github.com/psake/psake