using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace csharp
{
	class Program
	{
		static int[] SomeArray = new int[] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 };

		static void Main(string[] args)
		{
			//Indices();
			//Ranges();
			//UsingDeclarations();
			DisposableRefStructs();
		}

		static void Indices()
		{
			var i = 1;
			O(SomeArray[i]);
			Index index = i;
			O(SomeArray[index]);
			var index2 = ^2;
			O(SomeArray[index2]);
			O(SomeArray[^3]);
		}

		static void Ranges()
		{
			foreach (var item in SomeArray[5..10])
				O(item);
			S();
			foreach (var item in SomeArray[11..])
				O(item);
			S();
			foreach (var item in SomeArray[..2])
				O(item);
			S();
			foreach (var item in SomeArray[11..^2])
				O(item);
		}

		enum MyEnum
		{
			A,
			B,
			C,
			D,
		}
		static void SwitchExpressions()
		{
			MyEnum myEnum = default;
			var x = myEnum switch
			{
				MyEnum.A => "A",
				MyEnum.B => "B",
				MyEnum.C => "C",
				MyEnum.D => "D",
				_ => "snafu",
			};
			//switch (myEnum)
			//{
			//	case MyEnum.A:
			//		break;
			//	case MyEnum.B:
			//		break;
			//	case MyEnum.C:
			//		break;
			//	case MyEnum.D:
			//		break;
			//	default:
			//		break;
			//}
		}

		class Navigation
		{
			public string Heading { get; }
		}
		static void PropertyPatterns()
		{
			Navigation navigation = default;
			var x = navigation switch
			{
				{ Heading: "N" } => "Sever!",
				//_ => "Ne sever."
			};
		}

		static void TuplePatterns(int x, int y)
		{
			var foo = (x, y) switch
			{
				(0, 0) => "stred",
				(_, 0) => "osa Y",
				(0, _) => "osa X",
				(_, var f) => f.ToString(),
				//_ => "ble",
			};
		}

		public class Coordinates
		{
			public int X { get; }
			public int Y { get; }

			public Coordinates(int x, int y) => (X, Y) = (x, y);

			public void Deconstruct(out int x, out int y) => (x, y) = (X, Y);
		}
		static void PositionalPatterns()
		{
			Coordinates point = default;
			var foo = point switch
			{
				(0, 0) => "stred",
				var (x, y) when x > 0 && y > 0 => "1",
				var (x, y) when x < 0 && y > 0 => "2",
				var (x, y) when x < 0 && y < 0 => "3",
				var (x, y) when x > 0 && y < 0 => "4",
				var (_, _) => "hranice",
				_ => "?",
			};
		}

		#region Nullable
#nullable enable
		static int Nullable1(string s)
		{
			return s.Length;
		}
		static int Nullable2(string? s)
		{
			return s.Length;
		}
		static int Nullable3(string? s)
		{
			return s!.Length;
		}
		static int Nullable4(string? s)
		{
			if (s == null)
				throw new ArgumentNullException();
			if (string.IsNullOrEmpty(s))
				throw new ArgumentException();
			//if (s is null)
			//	throw new ArgumentNullException();
			return s.Length;
		}
		static void Nullable5()
		{
			DateTime? dt = DateTime.Now;
			NullableTest(dt, dt?.ToString()!);
		}
		static string NullableTest(DateTime? dt, string s) => dt switch
		{
			null => "?",
			_ => s,
		};
		#endregion

		static async Task AsyncDisposable()
		{
			static IAsyncDisposable Helper() => default;
			await using (var x = Helper())
			{

			}
		}

		static async Task AsyncEnumerable()
		{
			static async IAsyncEnumerable<int> Helper()
			{
				yield return await Task.FromResult(10);
			}
			await foreach (var x in Helper())
				O(x);
		}

		#region DefaultInterfaceMembers
		interface ITest
		{
			void FooBar(long i);
			//void FooBar(int i) => FooBar(Convert.ToInt64(i));
		}
		class TestMe : ITest
		{
			public void FooBar(long i) => throw new NotImplementedException();
		}
		#endregion

		#region ReadonlyStructMembers
		public struct Point
		{
			public double X { get; set; }
			public double Y { get; set; }
			public double Distance => Math.Sqrt(X * X + Y * Y);

			public override string ToString() =>
				$"({X}, {Y}) is {Distance} from the origin";
		}
		#endregion

		static void UsingDeclarations()
		{
			//using (var f = File.OpenRead(@"C:\Windows\win.ini"))
			//{
			//	O(f.Length);
			//	O(f.SafeFileHandle.DangerousGetHandle());
			//}
			using var f = File.OpenRead(@"C:\Windows\win.ini");
			O(f.Length);
			O(f.SafeFileHandle.DangerousGetHandle());
		}

		static void StaticLocalFunctions()
		{
			static int FooBar()
			{
				return 2 + 3 + 1;
			}
			O(FooBar());
		}

		#region DisposableRefStructs
		ref struct RefStruct /*: IDisposable*/
		{
			public void Dispose()
			{
				O(nameof(Dispose));
			}
		}
		static void DisposableRefStructs()
		{
			using (var s = new RefStruct())
			{

			}
		}
		#endregion

		static void O(object o) => Console.WriteLine(o);
		static void S() => Console.WriteLine();
	}
}
