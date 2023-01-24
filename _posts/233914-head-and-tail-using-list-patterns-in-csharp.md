---
title: |-
  Head and Tail using list patterns in C#
date: 2023-01-17T12:35:00Z
tags:
  - C#
---
Some time ago I wrote blog posts playing with [_head-_ and _tail-like_ functions][2] and implementing [_sum_ function in C# using these][1]. With the recent addition of [_list patterns_][3] into C# 11, I revisited that topic.

<!-- excerpt -->

In fact, the list pattern makes it very easy to implement. And also looks, in my opinion, most slick from all the previous.

```csharp
int Sum(int[] list) => list switch
{
    [] => 0,
    [var head, .. var tail] => head + Sum(tail),
};
```

But I'm cheating here a bit. In my previous posts I used `List<int>` as my datatype, while here I'm using `int[]`. The problem is that `.. var tail` needs _indexer_ with support for `Range` and `List<T>` does not have support for that. I smell some challenge ahead.

So, can I make it work with vanilla `List<T>`? I need to somehow add `this[Range range]` into existing type. This would be a great place of _extension everything_ in C#, but we're not there yet. Time for `ListRangeWrapper<T>`.

```csharp
class ListRangeWrapper<T>
{
    readonly List<T> _list;

    ListRangeWrapper(List<T> list)
    {
        _list = list;
    }

    public int Count => _list.Count;
    public T this[Index index] => _list[index];
    public ListRangeWrapper<T> this[Range range] => _list.Take(range).ToList();
    public static implicit operator ListRangeWrapper<T>(List<T> list) => new ListRangeWrapper<T>(list);
    public static implicit operator List<T>(ListRangeWrapper<T> wrapper) => wrapper._list;
}
```

This wrapper (ab)uses implicit operators to get from `List<T>` into itself (and back to `List<T>`) and introduces the already mentioned `this[Range range]`. It also has `this[Index index]` and `Count` to make our pattern work completely.

With that I can create the method and feed in _list_.

```csharp
int Sum(ListRangeWrapper<int> list) => list switch
{
    [] => 0,
    [var head, .. var tail] => head + Sum(tail),
};

var list = new List<int>() { 1, 2, 3 };
Sum(list);
```

Almost as nice as the _array_ version. In the wild the `ListRangeWrapper<T>` would probably be confusing to consumers. Maybe having the operators explicit and preparing overload with casting would help. But is it then still slick? You can comment below.

Furthermore, as I was writing the code, I realized, there's another new feature in C# 11, that would allow me to have the method fully generic. Yes, it's [_generic math_][4]. I'll leave that for [next blog post][5].

[1]: {{ include "post_link" 233813 }}
[2]: {{ include "post_link" 233633 }}
[3]: https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/patterns#list-patterns
[4]: https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-11#generic-math-support
[5]: {{ include "post_link" 233915 }}

