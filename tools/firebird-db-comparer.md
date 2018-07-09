---
title: FirebirdDbComparer
no_page: true
layout: page
---
### FirebirdDbComparer

#### Introduction

_FirebirdDbComparer_ is pure managed .NET library that allows comparing of two Firebird databases and producing alter script to get the target database to the sources' structure.

#### Versions supported

Firebird 2.5 (any edition) is supported. Firebird 3.0 (any edition) is supported, but from new features only _functions_ work at the moment.

The library targets .NET 4.5.2 and .NET Standard 2.0.

#### Usage

Use `FirebirdDbComparer.Compare.Comparer.ForTwoDatabases` providing connection strings (in .NET (_FirebirdClient_) format) for source and target and [`ComparerSettings`][4]/`IComparerSettings` where you can specify server version you're going to use and whether or not to ignore permissions on database objects. The `Compare` method then gives you the result as a [`CompareResult`][5], where you can find the statements structured as well as just a list.

Explore the [`TestApp`][2] to see it in action.

#### Getting it

[Available on NuGet.][1]

#### Details

The alter script is aimed to use only what Firebird permits (no direct changes in system tables) and breaking dependencies chain as early as possible to avoid long scripts. The script should look familiar as if you'd have written it manually. That means, we expect this library to be used by sane developers. 

Because it's a library you can take the output, which is structured (not a single string), and do whatever you need to - save to file, execute one by one, etc.

The library is heavily tested with hundreds of tests and used in production since 2015, giving us confidence it works in wide range of scenarios.

#### Code

[Available on GitHub.][6]

#### Keep it working

It took a lot of man-days to have the library in the current state. Although the work was sponsored by [SMS-Timing][3], we're not keeping the library for ourselves. We're providing it for free and we expect you to honestly decide how to contribute back. It might be just sending an email and saying thank you. Or providing a good bug report. Or using the "Donate" button below. Whatever works for you. Just keep it honest. 

<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
<input type="hidden" name="cmd" value="_s-xclick">
<input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----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-----END PKCS7-----
">
<input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
<img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">
</form>

[1]: https://www.nuget.org/packages/FirebirdDbComparer
[2]: https://github.com/cincuranet/FirebirdDbComparer/blob/master/src/FirebirdDbComparer.TestApp/Program.cs
[3]: http://www.sms-timing.com/
[4]: https://github.com/cincuranet/FirebirdDbComparer/blob/master/src/FirebirdDbComparer/Compare/ComparerSettings.cs
[5]: https://github.com/cincuranet/FirebirdDbComparer/blob/master/src/FirebirdDbComparer/Compare/CompareResult.cs
[6]: https://github.com/cincuranet/FirebirdDbComparer