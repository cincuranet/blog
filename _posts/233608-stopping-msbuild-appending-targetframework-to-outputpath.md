---
title: |-
  Stopping MSBuild appending TargetFramework to OutputPath
date: 2017-04-04T17:32:00Z
tags:
  - Visual Studio
  - MSBuild
  - .NET Core
---
If you're using the new `csproj` format maybe you noticed that the `OutputPath` has the last part automatically appended according to the framework you're targeting. For example targeting `netstandard1.6` would result in build results to be in `bin\[Debug|Release]\netstandard1.6`, for `net462` it would be `bin\[Debug|Release]\net462`. But what if you don't like this behavior? What if you want to specify the path exactly?

<!-- excerpt -->

Well, I needed the same. Sadly the framework part was always appended no matter what I did. Setting `OutputPath` explicitly. Using `BaseOutputPath`. Even using absolute path instead of relative didn't help. So it was time to try luck grep-ing through the `*.targets` files, because it's for sure something there. And hopefully can be disabled. It needs to be something with `TargetFramework` variable around `OutputPath`. Few attempts later I found `AppendTargetFrameworkToOutputPath`, which looked very promising. Quick test setting it to `false` and bingo. That's what I need.

Therefore, if you're ever in need to have your `OutputPath` exactly as you specified it, the `AppendTargetFrameworkToOutputPath` set to `false` is your answer.