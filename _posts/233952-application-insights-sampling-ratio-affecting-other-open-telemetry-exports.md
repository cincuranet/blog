---
title: |-
  Application Insights' sampling ratio affecting other Open Telemetry exports
date: 2025-08-04T07:17:00Z
tags:
  - Smart home
  - Azure
  - Application Insights
  - SigNoz
  - OpenTelemetry
---
I have a small .NET application that manages some specific parts of my _Software Defined House_ aka Smart home. Recently, I decided to transition from _Application Insights_ and I found an unexpected behavior when using pure _Open Telemetry_ exporter.

<!-- excerpt -->

Let me explain why I'm moving away from [_Application Insights_][3]. While I appreciate the service and its features (really, it does 99 % of what I want), the underlying _Log Analytics_ costs are quite high for my personal application, even with a 10 % `SamplingRatio`. If it were more affordable, I would continue using it.

To ensure smooth migration, I decided to send the logs and traces to a new place (self-hosted [_SigNoz_][4], in case you'd like to ask) as well as still to _Application Insights_. For _Application Insights_ I'm using [`Azure.Monitor.OpenTelemetry.Exporter`][1], for _SigNoz_ regular ` OpenTelemetry.Exporter.OpenTelemetryProtocol`. As mentioned above, I have [`SamplingRatio`][2] of `0.1f` (10 %)  for _Application Insights_. 

While setting alerts up in _SigNoz_, I noticed they weren't firing as they did in _Application Insights_. After some investigation, I realized that _SigNoz_ was also receiving only 10 % of the events. It turns out the `SamplingRatio` of `Azure.Monitor.OpenTelemetry.Exporter` affects the entire OTEL exporting. In hindsight, this makes sense. (Interestingly, Application Insights shows the correct count of operations, with only the actual samples missing, which is quite smart.)

Now you and I both know the details, so if you ever experience this, you'll know exactly what to look for.

The final decision to make is whether to run without sampling for a short period (and incur higher costs) or trust that my alerts are set up correctly and switch over directly.

[1]: https://www.nuget.org/packages/Azure.Monitor.OpenTelemetry.Exporter
[2]: https://learn.microsoft.com/en-us/dotnet/api/azure.monitor.opentelemetry.exporter.azuremonitorexporteroptions.samplingratio
[3]: https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview
[4]: https://signoz.io/