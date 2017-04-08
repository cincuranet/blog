---
title: |-
  My old game you'll never stop playing
date: 2015-08-07T07:26:00Z
tags:
  - C#
  - .NET
  - Games
layout: post
---
After [yesterday's post with I-don't-want-to-just-delete-this-code][1] I realized I have another code I'm keeping already for years. It's from my college years. At that time I was entering as much programming classes as I could - it was way easier than i.e. "Automata, Grammars, and Complexity" ;) (IB102 is the code in case you'd like to search catalog of [Faculty of Informatics Masaryk University][2]), it was fun and I liked it.

Anyway I entered also the newly created class related to CLR, .NET, C# etc. and we had weekly seminars where we actually did the programming. At one point in this seminar I wrote the code below. I don't know whether it was just some fun project because I had time to do it or some spin-up from assignment we had to do. 

<!-- excerpt -->

Doesn't matter. It's an awesome game. Really. It's simple and me and my friends spent more than a reasonable time "playing" it. And obviously I'm not the first one to create such a game. :D

So how it works? You're presented with a canvas with points connected by lines. Unless you're very lucky some lines intersect. Your task is to move the points (click somewhere in the circle) in such a way that the lines do not intersect using as little moves as possible. The number of moves is displayed in title bar. That's it.

![image](/i/233521/game.png)

Of course there are some rough edges. What you expect from one hour project?

* No detection whether the game is done (no intersections) or not. Yes, it's up to you. 8-)
* No way to start the same game (the points are always created freshly with random coordinates).

And of course the code could use some love as well.

The code below is intentionally just one file so you can just grab it, compile it and have fun.  

```csharp
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Game
{
	static class Program
	{
		[STAThread]
		static void Main()
		{
			Application.EnableVisualStyles();
			Application.SetCompatibleTextRenderingDefault(false);
			Application.Run(new GameCanvas());
		}
	}

	class GameCanvas : Form
	{
		const int MaxPoints = 20;
		const int Delta4Point = 10;

		static readonly Random Random = new Random();

		Point[] _points = new Point[MaxPoints];
		bool _moving = false;
		int _steps = 0;
		int _pointIndex;

		public GameCanvas()
		{
			BackColor = Color.White;
			Size = new Size(400, 400);

			Paint += (sender, e) => DrawGame(e.Graphics);
			MouseDown += (sender, e) => PointBeginMove(e);
			MouseUp += (sender, e) => PointEndMove(e);
			MouseMove += (sender, e) => PointMoving(e);

			for (int i = 0; i < MaxPoints; i++)
			{
				_points[i] = new Point(Random.Next(0, ClientSize.Width), Random.Next(0, ClientSize.Height));
			}

			UpdateGameStatus();
		}

		void UpdateGameStatus()
		{
			Text = _steps.ToString();
		}

		void DrawGame(Graphics g)
		{
			var i = 0;
			for (i = 0; i < MaxPoints - 1; i++)
			{
				g.DrawLine(new Pen(Color.Red), _points[i], _points[i + 1]);
				g.DrawArc(new Pen(Color.Blue), _points[i].X - (Delta4Point / 2), _points[i].Y - (Delta4Point / 2), Delta4Point, Delta4Point, 0, 360);
			}
			g.DrawLine(new Pen(Color.Red), _points[i], _points[0]);
			g.DrawArc(new Pen(Color.Blue), _points[i].X - (Delta4Point / 2), _points[i].Y - (Delta4Point / 2), Delta4Point, Delta4Point, 0, 360);
		}

		void PointBeginMove(MouseEventArgs e)
		{
			for (int i = 0; i < MaxPoints; i++)
			{
				if (Math.Abs(_points[i].X - e.X) < Delta4Point && Math.Abs(_points[i].Y - e.Y) < Delta4Point)
				{
					_pointIndex = i;
					_moving = true;
					_steps++;
					break;
				}
			}
			UpdateGameStatus();
		}

		void PointEndMove(MouseEventArgs e)
		{
			_moving = false;
		}

		void PointMoving(MouseEventArgs e)
		{
			if (_moving)
			{
				_points[_pointIndex].X = e.X;
				_points[_pointIndex].Y = e.Y;
				Invalidate();
			}
		}
	}
}
```

Don't play too hard. ;)

[1]: {% post_url 0000-00-00-233520-dirty-html-to-markdown-converter-code %}
[2]: http://www.fi.muni.cz/