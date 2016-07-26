---
title: "Synchronizace threadů"
date: 2005-12-28T21:08:00Z
tags:
  - .NET
redirect_from: /id/7062/
category: none
layout: post
---
Včera jsem se pokušel napsat příklad, který by demonstroval co se stane, pokud thready využívající sdílený prostředek nejsou synchronizovány. Jak asi každý ví, že se to tam a tam může pokazit, snaží se automaticky myslet tak, aby tomuto nedeterministickému chování předešel. Já jsem však potřeboval napsat příklad, který by toto záměrně porušoval. Pachtil jsem se s tim poměrně dlouho - myslel jsem si, že špatný příklad lehce dokážu vytvořit - a hle, není to tak jednoduché. :)

Pokud by tedy někdo potřeboval příklad, který by toto ukázal, může využít tento (těžce vymyšlený :) ):

```csharp
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
namespace synchro
{
	class Program
	{
		public static int globalni = 0;
		static void Main(string[] args)
		{
			for (int i = 0; i < 5; i++)
			{
				ThreadStart ts = new ThreadStart((new Worker()).Run);
				new Thread(ts).Start();
			}
			Console.ReadKey();
		}
	}
	class Worker
	{
		public Worker()
		{
		}
		public void Run()
		{
			//lock(typeof(Program))
			{
				int i = Program.globalni;
				i++;
				Thread.Sleep(new Random().Next(2000));
				Program.globalni = i;
				Console.WriteLine(Program.globalni.ToString());
			}
		}
	}
}
```