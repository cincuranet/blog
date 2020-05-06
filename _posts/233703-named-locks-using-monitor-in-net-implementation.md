---
title: |-
  Named locks (using Monitor) in .NET: Implementation
date: 2018-02-19T06:00:00Z
tags:
  - .NET
  - Multithreading/Parallelism/Asynchronous/Concurrency
---
The `Monitor` class in .NET might be the most often used "locking" mechanism in C#, mostly because the `lock` keyword is making it so easy. One thing you might face is unknown number of locks you're going to need and how to solve this. This is often called named locks or named `Monitor`s, because the lock is bound to some name (or similar value).

<!-- excerpt -->

#### What is a `Monitor`?

[`Monitor`][1] has these four fundamental features: mutual exclusivity, recursion, thread ownership and spinning. _Mutual exclusivity_ guarantees that code "locked" using `Monitor` is executed always in single thread at any given time. Critical section in other words. _Recursion_ means that from the same thread you can "enter" the `Monitor` multiple times (and you have to also "exit" it the same amount of times). _Thread ownership_ supports the previous behavior and also enforces that the thread "entering" the `Monitor` is the thread "exiting" it (otherwise an exception is thrown).  Thread affinity in other words. _Spinning_ means, because `Monitor` can be put in _hybrid locks_ category, that for a short amount of time the `Monitor` will try to acquire the lock by trying in a loop, hence spinning, before giving up and blocking regularly, giving up the CPU.

#### Why?

Let's imagine you have a bunch of counters. And these counters are modified from various devices. Of course, you can create a global lock that will guard all the counters, but as the number of devices and counters grows, the single lock will become a bottleneck. So you decide to create lock per counter, for example.

`Monitor` can't be named, compared to i.e. [`Semaphore`][2] (in Windows kernel). As a result, you're left to your own creativity to solve it. And although you can come up with countless solutions, two most straightforward are the following: using interned string as an object to lock on and storing the objects in a hashtable (Dictionary in .NET terms). Let's explore both.

#### Using string interning

[_String interning_][3] is a feature in .NET that allows you to place a string into a table and whenever you intern the same string (same content) the reference to the string in that table is returned. That allows you to have an object (`string` is an object) that you can always get and always get the same one, if you have an appropriate string content. How it would look like?

```csharp
lock (string.Intern(name))
{
	// ...
}
```

Where the `name` is your string you want the lock to be bound to.

Does it have some drawbacks? Well, first, the interning was not designed for locking. It's just plain abuse of this behavior. Also, although improbable, the implementation can change and then you're in trouble. Among these philosophical concerns, there's one (at least) from real world. In case some other piece of code in your application uses the same technique over the same string content, deadlocks or contentions can occur. And you can't spot these easily. 

So, although it's very straightforward, it's also pretty dangerous.

#### Using `ConcurrentDictionary<TKey, TValue>`

The [`ConcurrentDictionary<TKey, TValue>`][4] was introduced in .NET 4 and it's a great fit for this. Using `ConcurrentDictionary<string, object>` you can get always the same object (in this case really an `object`, because what smaller object to create...). How it would look like?

It's easier to wrap this into tiny class to have it nicely self-contained.

```csharp
class NamedMonitor
{
	readonly ConcurrentDictionary<string, object> _dictionary = new ConcurrentDictionary<string, object>();

	public object this[string name] => _dictionary.GetOrAdd(name, _ => new object());
}
```

And then you can use it.

```csharp
lock (locker[name])
{
	// ...
}
```

Where the `locker` is instance of `NamedMonitor` and `name` is your string you want the lock to be bound to.

Does this have some drawbacks? Obviously, it's something you have to write, test and "maintain" it.  Additionally, you have to keep the instance around and accessible. 

On the other hand, this gives you the option to use different keys (i.e. `int`), plus different pieces of code can use different instances. You can even add a method to remove the object from the collection (although special care has to be taken because the object might be in use).

#### Summary

For me both options look the same in terms of effort. But I wouldn't use the interning, because it's a hack and I don't want that in my code, especially in multithreaded code. However. What about the performance? [Next section dives into performance.][5]

> [Performance][5]

[1]: https://docs.microsoft.com/en-us/dotnet/api/system.threading.monitor?view=netframework-4.7.1
[2]: https://docs.microsoft.com/en-us/dotnet/api/system.threading.semaphore?view=netframework-4.7.1
[3]: https://en.wikipedia.org/wiki/String_interning
[4]: https://docs.microsoft.com/en-us/dotnet/api/system.collections.concurrent.concurrentdictionary-2?view=netframework-4.7.1
[5]: {{ include "post_link" 233704 }}