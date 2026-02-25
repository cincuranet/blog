---
title: |-
  I want quick'n'dirty HTTP GET endpoint that sends SMS via Twilio for testing - couldn't see the forest for the trees
date: 2020-02-20T07:48:00Z
tags:
  - Cloud
  - Azure
  - Twilio
---
It was a nice workweek evening and for testing I needed simple HTTP GET endpoint that would send SMS via [Twilio][1] for testing of really weird integration in my "home automation". As fast and as easy as possible. Sounds simple, right? Sadly, my brain being fogged by all the cloud goodness couldn't see the forest for the trees.

<!-- excerpt -->

I started with [Azure Logic App][2]. Because I knew I can trigger it with HTTP request and the Twilio integration is there too. But as I quickly realized I can't use HTTP GET to trigger Logic App. Bummer.

Next step was [Azure Function App][3]. I know HTTP GET definitely works there, as I'm using it in various projects. The Twilio output binding is there too, thus it should be very simple piece of code that I can write even in portal. For some reason I had issue properly referencing Twilio's NuGet from _csx_ and to not waste time I decided to write it in Visual Studio and deploy it as a DLL. For some other reason when the function started it complained it can't find `AccountSidSetting` and others. No desire to burn time here to investigate, let's move on.

I can actually deploy [Azure App Service][4] and easily do the SMS sending myself in a simple ASP.NET Core application. I already have the Twilio code and it's dead simple and I don't have to fiddle with settings; I can hardcore - because it's for testing - everything. Half way into creating the App Service I realized I don't need that at all. I can simply _publish_ the application and either run in on my machine or even better on one of my Raspberry Pis. And that's what I did.

Would I started creating ASP.NET Core application and running it on Raspberry Pi, I would be done like three times faster and already chilling. But no. I had to start with cloud solution and kept trying to fit it in, instead of focusing on task at hand. But it was a good experience I can relate to sometime later, instead of blindly pushing through problems.

[1]: https://www.twilio.com/
[2]: https://azure.microsoft.com/en-us/services/logic-apps/
[3]: https://azure.microsoft.com/en-us/services/functions/
[4]: https://azure.microsoft.com/en-us/services/app-service/