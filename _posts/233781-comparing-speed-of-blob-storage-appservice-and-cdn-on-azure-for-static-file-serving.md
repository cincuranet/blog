---
title: |-
  Comparing speed of Blob Storage, AppService and CDN on Azure for static file serving
date: 2019-04-30T06:16:00Z
tags:
  - Cloud
  - Azure
  - Azure Storage
  - CDN
  - AppService
---
For no particular reason and with no particular goal I decided to see how "fast" some selected services, with the ability to serve a static file, on Azure are. I was interested in the time to serve the file and requests per second. The services I selected are AppService in B1 and S1 plan, Blob Storage GPv2 and CDN in Standard plan from Verizon and Microsoft.

<!-- excerpt -->

The file I chose was a 26143 bytes long C# text file (`FbMigrationSqlGenerator.cs` renamed to `test.txt`, to be exact). The file was always accessed using HTTPS from an Azure VM in DS3_v2 size in the same region (West Europe). All the above-mentioned services were in default configuration (Blob Storage container was public). I use Apache Bench tool (Apache 2.4.39 x64 OpenSSL 1.1.1 VC15) with various settings (see below). I know this is in no way comprehensive test, but I'd like to say before you steam into comments section, I'm interested more in comparison than in absolute numbers.

The settings I used for Apache Bench all used _Keep Alive_ (`-k`) and I did runs with concurrency (`-c`) 6 and 1k requests (`-n`), concurrency 100 and 20k requests and finally concurrency 400 and 80k requests.

First let's look at requests per second.

|             | Blob Storage | AppService B1 | AppService S1 | CDN Verizon | CDN Microsoft |
|-------------|--------------|---------------|---------------|-------------|---------------|
| 1000R/6C    | 820          | 1164          | 1143          | 1362        | 1208          |
| 20000R/100C | 6332         | 2253          | 2078          | 7032        | 7947          |
| 80000R/400C | 6480         | 1365          | 1865          | 5600        | 6966          |

With a small number of concurrent requests, the services are similar to each other (not sure why Blob Storage was doing bad with small concurrency and good with more concurrency, maybe some network glitch). As the load is added Blob Storage and both CDNs are fine (I was maxing-out VM's network (between 2.0-2.4 Gbps reported by _Task Manager_)).

Let's look at milliseconds per request now.

|             | Blob Storage | AppService B1 | AppService S1 | CDN Verizon | CDN Microsoft |
|-------------|--------------|---------------|---------------|-------------|---------------|
| 1000R/6C    | 7.313        | 5.156         | 5.250         | 4.406       | 4.969         |
| 20000R/100C | 15.792       | 44.386        | 48.127        | 14.221      | 12.584        |
| 80000R/400C | 61.719       | 293.016       | 214.424       | 71.432      | 57.426        |

Again, on a small concurrency the results are pretty much the same and not much users or applications will be able to recognize 7ms or 4ms request. What surprised me was, that the Blob Storage is on-par with CDN. Yes, this was the lucky case, because Blob Storage was in the same region and both Verizon and Microsoft have CDN POPs in Amsterdam which is where the West Europe region is located. But still.

At the end of the day, you're probably selecting (and configuring - i.e. location(s) and replication, number of instances and so on) services based on what the solution is asking for, but it's still nice to see what to expect in respect to other services.