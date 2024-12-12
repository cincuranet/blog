#pragma warning disable IDE0051

using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;

namespace C8Demos
{
    class Program
    {
        static void Main(string[] args)
        {
            new RangesAndIndices().Do();
        }
    }

    class NullableReferenceTypes
    {
#nullable enable
        int StringLength(string s)
        {
            return s.Length;
        }
        
        int StringLengthNullable(string? s)
        {
            return s.Length;
        }
        int StringLengthNullable2(string? s)
        {
            if(s == null)
                return -1;
            return s.Length;
        }

        int StringLengthDammit(string? s)
        {
            return s!.Length;
        }
    }

    class AsyncStreams
    {
        async IAsyncEnumerable<int> GetNumbers()
        {
            await foreach (var n in GetNumbers())
            {
                yield return n;
            }
        }

        async IAsyncEnumerable<int> GetNumbersExtra()
        {
            await foreach (var n in GetNumbers())
            {
                yield return await Task.FromResult(n);
            }
        }
    }

    class AsyncDisposable : IAsyncDisposable
    {
        public async ValueTask DisposeAsync()
        {
            await Task.Delay(1000);
        }
    }

    class RangesAndIndices
    {
        public void Do()
        {
            Index i1 = 5;
            Index i2 = ^2;
            Range r;
            var arr = Enumerable.Range(0, 20).ToArray();
            Console.WriteLine($"Original: {string.Join(',', arr)}");
            Console.WriteLine($"Index 1: {arr[i1]}");
            Console.WriteLine($"Index 2: {arr[i2]}");
            Console.WriteLine($"Range: {string.Join(',', arr[4..7])}");
            Console.WriteLine($"Range: {string.Join(',', arr[10..^7])}");
        }
    }

    class DefaultImplOnInterfaces
    {
        interface ITest
        {
            void FooBar(string foobar);
            //void FooBarBaz(string foobarbaz) => FooBar(foobarbaz);
        }

        class Test : ITest
        {
            public void FooBar(string foobar)
            {
                throw new NotImplementedException();
            }
        }
    }

    class RecursivePatterns
    {
        class Person
        {
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public int Age { get; set; }
        }

        void Foo(object person)
        {
            //if (person is Person { Age: 99, LastName: string lastName })
            //{
            //    Console.WriteLine(lastName);
            //}
            //else
            //{
            //    return;
            //}
        }
    }

    class SwitchExpressions
    {
        interface IDataContainer
        { }

        class Json : IDataContainer
        {
            public override string ToString()
            {
                return base.ToString();
            }
        }

        class Xml : IDataContainer
        {
            public string WriteXml(bool indent)
            {
                return string.Empty;
            }
        }

        void Old(IDataContainer container)
        {
            var data = default(string);
            switch (container)
            {
                case Json json:
                    data = json.ToString();
                    break;
                case Xml xml:
                    data = xml.WriteXml(false);
                    break;
                default:
                    data = string.Empty;
                    break;
            }
            Console.WriteLine(data);
        }

        //void New(IDataContainer container)
        //{
        //    var data = container switch
        //    {
        //        Json json => json.ToString(),
        //        Xml xml => xml.WriteXml(false),
        //        _ => string.Empty,
        //    };
        //}
    }

    class TargetTypesNewExpression
    {
        //void Foo()
        //{
        //    Point[] ps = { new (1, 4), new (3,-2), new (9, 5) };
        //}
    }
}

namespace System.Threading.Tasks
{
    using System.Runtime.CompilerServices;
    using System.Threading.Tasks.Sources;

    internal struct ManualResetValueTaskSourceLogic<TResult>
    {
        private ManualResetValueTaskSourceCore<TResult> _core;
        public ManualResetValueTaskSourceLogic(IStrongBox<ManualResetValueTaskSourceLogic<TResult>> parent) : this() { }
        public short Version => _core.Version;
        public TResult GetResult(short token) => _core.GetResult(token);
        public ValueTaskSourceStatus GetStatus(short token) => _core.GetStatus(token);
        public void OnCompleted(Action<object> continuation, object state, short token, ValueTaskSourceOnCompletedFlags flags) => _core.OnCompleted(continuation, state, token, flags);
        public void Reset() => _core.Reset();
        public void SetResult(TResult result) => _core.SetResult(result);
        public void SetException(Exception error) => _core.SetException(error);
    }
}

namespace System.Runtime.CompilerServices
{
    internal interface IStrongBox<T> { ref T Value { get; } }
}
