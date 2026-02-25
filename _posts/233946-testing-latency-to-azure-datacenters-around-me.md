---
title: |-
  Testing latency to Azure datacenters around me
date: 2024-11-05T08:20:00Z
tags:
  - Azure
  - Cloud
  - Network
---
Purely out of curiosity I decided to test latencies to a few [Azure datacenters][2] around me. Specifically, Germany West Central (Frankfurt), Poland Central (Warsaw) and West Europe (Amsterdam). I wanted to test Azure DC in Austria as well, but it is not yet available.

<!-- excerpt -->

My (second level) ISP is peering in both [NIX.CZ][3] and [Peering.cz][4] (two biggest peering points here in Czech Republic) and [Microsoft (AS8075)][5] is peering there as well (although the peering policies can change how the packets flow at the end). Once it is in Microsoft's backbone network, we can only guess how the packets flow.

For my test I created VNET with default configuration in each location and Debian VMs using `Standard_B1ls` size. I didn't want to use only ICMP for the tests, but also TCP to better simulate "real" traffic. For that reason, I used `nping` on both sides. The first test used `--tcp -c 10` and the second test used `--tcp -c 100 --rate 20` on the client side, while server used always default configuration. All tests used IPv4.

Without further ado, here are the results (all numbers are averages).

| Azure DC             | ICMP   | nping 1 | nping 2 |
|----------------------|--------|---------|---------|
| Germany West Central | 18.666 | 19.056  | 19.115  |
| Poland Central       | 23.998 | 23.945  | 23.840  |
| West Europe          | 23.714 | 21.348  | 22.716  |

So, Germany West Central (Frankfurt) is clearly closest to me in terms of network latency. Not sure what I can do with this knowledge, but it will come handy at some point.

Sadly it is also useless numbers because it can change at any time in the future. Finally for you (or rather your ISP), dear reader, the numbers will be different. But you can try i.e. [Azure Speed Test 2.0][1] to get some comparison between regions.

[1]: https://azurespeedtest.azurewebsites.net/
[2]: https://datacenters.microsoft.com/globe/explore/
[3]: https://nix.cz/
[4]: https://www.peering.cz/
[5]: https://bgp.he.net/AS8075