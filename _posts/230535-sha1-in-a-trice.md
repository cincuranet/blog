---
title: |-
  SHA1 in a trice
date: 2009-06-08T06:49:00Z
tags:
  - .NET
  - Cryptography
  - LINQ
---
Having girls/womans in a dev team is always fun. Yes, you have to wash your body more than every Visual Studio release. :) But girls have also different way of looking at the problem. I had this experience in a [training last week][1]. There's one girl in dev team. While showing how to work with [Cryptography namespace][2] I was creating simple method for SHA1 hash. Saying, that's pretty easy to create SHA1 hash in a couple of lines I got a question (yes, from the girl ;)), whether it's possible to do it in one row, to make code more compact and show that's double pretty easy. And it really is:

```csharp
label1.Text = string.Join(string.Empty, new SHA1Managed().ComputeHash(Encoding.Unicode.GetBytes(textBox1.Text)).Select(_ => _.ToString()).ToArray());
```

It's not the most readable code, but as a helper function somewhere ... :)

[1]: {{ include "post_link" 230533 }}
[2]: http://msdn.microsoft.com/en-us/library/system.security.cryptography.aspx