---
title: |-
  MailAddress class is driving me crazy
date: 2013-05-14T08:41:19Z
tags:
  - .NET
  - Best practice or not?
  - Email
---
I'm now working a lot with emails and email addresses. Loading, parsing and so on. Because of that I'm also using a [`MailAddress`][1] class a lot. And I hate it. The class, even simple, makes me want to scream.

<!-- excerpt -->

Consider simple code like this.

```csharp
var mail1 = new MailAddress("mail@example.com");
var mail2 = new MailAddress("MAIL@example.com");
Console.WriteLine("Equals?:\t{0}", mail1.Equals(mail2));
Console.WriteLine("Equals?:\t{0}", mail2.Equals(mail1));
Console.WriteLine("GetHashCode1:\t{0}", mail1.GetHashCode());
Console.WriteLine("GetHashCode2:\t{0}", mail2.GetHashCode());
```

What do you think the output be? Drum roll please...

```text
Equals?:        True
Equals?:        True
GetHashCode1:   582340455
GetHashCode2:   1045083261
```

Why the hell somebody did the work overriding the [`Equals`][2] and not providing the implementation of [`GetHashCode`][3] that aligns with that?

I think it's time to implement my own. 8-)

[1]: http://msdn.microsoft.com/en-us/library/yh392kbs.aspx
[2]: http://msdn.microsoft.com/en-us/library/bsc2ak47.aspx
[3]: http://msdn.microsoft.com/en-us/library/system.object.gethashcode.aspx