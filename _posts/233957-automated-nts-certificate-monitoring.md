---
title: |-
  Automated NTS certificate monitoring
date: 2025-11-19T08:48:00Z
tags:
  - Time
  - Network
  - NTS
---
As I'm running my [time.cincura.net][1] timeserver I have some monitoring in place. But one thing was missing: checking the certificate for NTS. Although the renewal is semi-automated, having an additional layer of verification provides peace of mind. The challenge is that most monitoring tools do not support NTS, so I decided to create my own tool - which you can now use as well.

<!-- excerpt -->

Because HTTP is ubiquitous and nearly every monitoring tool can check HTTP status code, I created a HTTP API that will return `200 OK` or `412 Precondition Failed` respectively depending on whether NTS certificate is valid (within the configured number of days).

On `https://mon-tools.cincura.net/nts-cert?host={host}&days={days}`, you can specify the NTS host and the number of days to check if the certificate remains valid. The tool does not validate whether the certificate is trusted. For example, you can check my server with: <https://mon-tools.cincura.net/nts-cert?host=time.cincura.net&days=5>.

In both cases, you'll receive a JSON response with basic information about the certificate, which can be useful for troubleshooting or adding extra validation.

OpenAPI specification is available at: <https://mon-tools.cincura.net/openapi/v1.json>.

Hope you find it useful. If you have any feedback or request, please feel free to comment below.

[1]: https://time.cincura.net