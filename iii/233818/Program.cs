using System;
using System.Buffers.Text;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using System.Text;

namespace ConsoleApp1
{
	class Program
	{
		static void Main(string[] args)
		{
			const string FilePath = @"C:\Users\Jiri\Downloads\weewx.csv";

			var sw = Stopwatch.StartNew();
			var data = ParseFile(FilePath);
			Console.WriteLine(data.Count);
			Console.WriteLine(sw.Elapsed);
		}

		static List<List<ReadOnlyMemory<char>>> ParseFile(string filename)
		{
			var data = LoadFile(filename);
			var lines = data.Split(Environment.NewLine, StringSplitOptions.None);
			var rows = new List<List<ReadOnlyMemory<char>>>(100);
			foreach (var line in lines)
			{
				var items = Split(',', line.AsMemory());
				rows.Add(items);
			}
			return rows;
		}

		static List<ReadOnlyMemory<char>> Split(char separator, ReadOnlyMemory<char> s)
		{
			var result = new List<ReadOnlyMemory<char>>(50);
			while (true)
			{
				var index = s.Span.IndexOf(separator);
				if (index != -1)
				{
					result.Add(s.Slice(0, index));
					s = s.Slice(index + 1);
					continue;
				}
				else
				{
					result.Add(s);
					break;
				}
			}
			return result;
		}

		//readonly struct Item
		//{
		//	public string Data { get; }
		//	public int Start { get; }
		//	public int End { get; }

		//	public Item(string data, int start, int end)
		//	{
		//		Data = data;
		//		Start = start;
		//		End = end;
		//	}

		//	public override string ToString() => Data.Substring(Start, End - Start);
		//}

		static string LoadFile(string filename)
		{
			var position = 0;
			using (var fs = File.OpenRead(filename))
			{
				var data = new byte[(int)fs.Length];
				Span<byte> buffer = stackalloc byte[1024];
				while (true)
				{
					var read = fs.Read(buffer);
					if (read == 0)
						break;
					for (int i = 0; i < read; i++)
					{
						data[position++] = buffer[i];
					}
				}
				return Encoding.UTF8.GetString(data);
			}
		}

		static int Test(ReadOnlySpan<byte> test)
		{
			var sum = 0;
			for (int i = 0; i < test.Length; i++)
			{
				sum += test[i];
			}
			return sum;
		}
	}
}
