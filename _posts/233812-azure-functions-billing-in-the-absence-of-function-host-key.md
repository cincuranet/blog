---
title: |-
  Azure Functions billing in the absence of function/host key
date: 2020-03-01T12:18:00Z
tags:
  - Cloud
  - Azure
  - Azure Functions
---
You might be wondering: "Am I going to be charged when somebody invokes my Azure Function but with wrong or missing [key][1]?". Well, some of the attendees on my currently running Azure course had the same question. And I thought it might be worth sharing the answer publicly.

<!-- excerpt -->

The answer is that you're not going to be charger for executions without or with wrong key. Simple as that. But as I was playing with that, I found something interesting.

Although the function itself is not executed and HTTP 401 is returned, the CPU load increases as the requests are flowing in. Something to theoretically take into account when doing some capacity planning i.e. when not using consumption plan.

Also, if you're using Application Insights, you get messages in the "log" about the endpoint being matched. Kind of makes sense.

[1]: https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-http-webhook-trigger?tabs=csharp#authorization-keys