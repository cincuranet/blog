---
title: |-
  My Bash like prompt in PowerShell
date: 2016-01-24T19:55:00Z
tags:
  - PowerShell
  - Bash
---
It all started with this [tweet][1]:

> Pimped up my #PowerShell prompt a little. More bash-like style. #geek

And was asked what I did. It's actually nothing special, just few things I really like while working via `ssh` in [`Bash`][2], which is my default shell wherever possible.

So what I actually did? I just really played little bit with formatting. But the whole prompt for me is like this.

<!-- excerpt -->

In your PowerShell profile (`$PROFILE`) you can specify `Prompt` function and have the prompt whatever you like. The mine is the blank line, followed by current path and the "real" prompt on new line. From `Bash` I'm used to `$` as a prompt and `#` as root (or `Administrator` in Windows case) respectively. I also change the title of the window to include `ADMIN: ` prefix, just to see it there as well, i.e. for Alt-Tab. Finally I also replace the path from `USERPROFILE` environment variable (if it's there) in current path by `~`.

Here's how it looks like.

![image]({{ include "post_ilink" page "prompt.png" }})

So my `Prompt` function look like this.

```powershell
$isAdministrator = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]'Administrator')
function Prompt {
	$currentDir = $pwd.Path.Replace($env:USERPROFILE, "~")

	$prefix = ''
	if ($isAdministrator) {
		$prefix = 'ADMIN: '
	}
	$Host.UI.RawUI.WindowTitle = "$prefix$(Split-Path $currentDir -Leaf)"

	$prompt = '$'
	if ($isAdministrator) {
		$prompt = '#'
	}
	return "`n$currentDir`n$prompt "
}
```

No colors as you can see (not much to choose from in [`ConsoleColor` enum][5]).

That's mostly the visual part. Now the behavior. For a long time I'm using [PSReadLine][3], which is, by the way, in Windows 10 directly. I'm quite happy with defaults (`Cmd` mode). So I'm only tweaking the _bell_ and mapping Ctrl-D to closing the shell. Other shortcuts I'm often using, the Esc and Ctrl-R, have the default functions as I like it already (and I would remap these if not).

```powershell
Set-PSReadlineKeyHandler -Chord 'Ctrl+d' -Function DeleteCharOrExit
Set-PSReadlineOption -BellStyle Visual
```

Some final fine tuning. Bash uses `> ` as a continuation line prompt. So do I.

```powershell
Set-PSReadlineOption -ContinuationPrompt '> '
```

And that's it. That's my Bash-like prompt in PowerShell (with PSReadLine's help (and in [ConEmu][4] which I also use)).

[1]: https://twitter.com/cincura_net/status/690265970116526081
[2]: https://www.gnu.org/software/bash/
[3]: https://github.com/lzybkr/PSReadLine
[4]: https://conemu.github.io/
[5]: https://msdn.microsoft.com/en-us/library/system.consolecolor(v=vs.110).aspx