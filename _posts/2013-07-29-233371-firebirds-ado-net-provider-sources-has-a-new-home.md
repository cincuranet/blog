---
title: "Firebird's ADO.NET provider (sources) has a new home"
date: 2013-07-29T16:14:56Z
tags:
  - Firebird
  - Git
  - Subversion
redirect_from: /id/233371/
layout: post
---
Few months ago I wrote an email to [Firebird's ADO.NET provider][1] mailing list expressing my desire to release more often and with less friction (which is more important for me, than to consumers). Because there are some bugs of features that need testing with some underlying code or setup, I often create my private "branches". But with Subversion that's not easy and sooner or later I end up with multiple copies of sources, manually merging changes etc. So I decided to make a move and move sources to Git. I recently started using it for a lot of my projects and it's really way better compared to Subversion if you're doing a lot of small changes and jumping back and forth (which is what I do, because I do provider in my free time).

<!-- excerpt -->

So from today on, the sources for ADO.NET provider for Firebird are available in Git repository. I'll keep the Subversion repository still there for a while. The [official Git repository is still on SourceForge][2], because that's where rest of the project is. But honestly I think SourceForge lost the traction few years back. And [GitHub][3] found itself to be de-facto place for open-source projects. So with that, I'm also having (my own, not official by definition) repository on [GitHub][4]. Hence if you'd like to issue a pull request you're not limited. ;)

Enjoy, download, contribute.

[1]: http://www.firebirdsql.org/en/net-provider/
[2]: https://sourceforge.net/p/firebird/NETProvider/ci/master/tree/
[3]: https://github.com
[4]: https://github.com/cincuranet/FirebirdSql.Data.FirebirdClient