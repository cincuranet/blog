---
title: |-
  Comparing disk speed of various disks and VMs in Azure
date: 2020-03-05T17:58:00Z
tags:
  - Cloud
  - Azure
  - Azure VMs
---
For an estimation and planned move of some resources to Azure, I had to do comparison of various VMs and disks. It's not meant to be exhaustive with all possibilities. Just some numbers one can compare.

<!-- excerpt -->

The move is considered mostly because the VMs can be placed closer to the customer compared to on-premise datacenter, in case you'd like to ask.

#### Setup

The measurement was done using [CrystalDiskMark][2] version 7.0.0 x64 running as an Administrator. `Default` profile was used with this test: `4 GiB (x5) [Interval: 5 sec] <DefaultAffinity=DISABLED>`. CrystalDiskMark was selected because on-prem machines had it already installed.

I tested _Standard D8s v3 (8 vcpus, 32 GiB memory)_, _Standard L8s_v2 (8 vcpus, 64 GiB memory)_ and _Standard L8s (8 vcpus, 64 GiB memory)_ all running Windows Server 2019 Datacenter from the default image in Azure with Premium SSDs (always fresh VM). P20 (D8sv3 only), P30, P40 (D8sv3 only), OS disk (because why not), Temp disk and NVMe disk (only available in L8sv2) were tested. No further VM modification was done except for attaching disks and turning on read caching where possible.

#### Read

| Read (MB/s)                   | Sequential 1MiB (Q=8, T=1) | Sequential 1MiB (Q=1, T=1) | Random 4KiB (Q=32, T=16) | Random 4KiB (Q=1, T=1) |
|-------------------------------|---------------------------:|---------------------------:|-------------------------:|-----------------------:|
| L8s - P30 disk (no caching)   |                    203.859 |                     78.228 |                   20.910 |                  0.994 |
| L8sv2 - P30 disk (no caching) |                    167.754 |                     66.484 |                   21.042 |                  0.911 |
| D8sv3 - P30 disk (R caching)  |                    135.068 |                    135.060 |                   67.520 |                 27.121 |
| D8sv3 - P20 disk (R caching)  |                    135.067 |                    135.069 |                   67.516 |                 26.741 |
| D8sv3 - P40 disk (R caching)  |                    135.065 |                    135.059 |                   67.513 |                 26.760 |
| L8sv2 - NVMe disk             |                   1837.758 |                   1840.725 |                  355.024 |                 48.016 |
| L8s - OS disk (RW caching)    |                    417.126 |                    417.154 |                  169.536 |                 52.680 |
| L8sv2 - OS disk (RW caching)  |                     89.965 |                     89.961 |                   17.703 |                 17.702 |
| D8sv3 - OS disk (RW caching)  |                    140.113 |                    140.090 |                   68.338 |                 27.494 |
| L8s - Temp disk               |                    412.129 |                    412.084 |                  168.776 |                 17.344 |
| L8sv2 - Temp disk             |                     84.724 |                     84.736 |                   16.879 |                 16.496 |
| D8sv3 - Temp disk             |                    135.059 |                    135.073 |                   67.519 |                 16.566 |

| Read (IOPS)                   | Sequential 1MiB (Q=8, T=1) | Sequential 1MiB (Q=1, T=1) | Random 4KiB (Q=32, T=16) | Random 4KiB (Q=1, T=1) |
|-------------------------------|---------------------------:|---------------------------:|-------------------------:|-----------------------:|
| L8s - P30 disk (no caching)   |                      194.4 |                       74.6 |                   5105.0 |                  242.7 |
| L8sv2 - P30 disk (no caching) |                      160.0 |                       63.4 |                   5137.2 |                  222.4 |
| D8sv3 - P30 disk (R caching)  |                      128.8 |                      128.8 |                  16484.4 |                 6621.3 |
| D8sv3 - P20 disk (R caching)  |                      128.8 |                      128.8 |                  16483.4 |                 6528.6 |
| D8sv3 - P40 disk (R caching)  |                      128.8 |                      128.8 |                  16482.7 |                 6533.2 |
| L8sv2 - NVMe disk             |                     1752.6 |                     1755.5 |                  86675.8 |                11722.7 |
| L8s - OS disk (RW caching)    |                      397.8 |                      397.8 |                  41390.6 |                12861.3 |
| L8sv2 - OS disk (RW caching)  |                       85.8 |                       85.8 |                   4322.0 |                 4321.8 |
| D8sv3 - OS disk (RW caching)  |                      133.6 |                      133.6 |                  16684.1 |                 6712.4 |
| L8s - Temp disk               |                      393.0 |                      393.0 |                  41205.1 |                 4234.4 |
| L8sv2 - Temp disk             |                       80.8 |                       80.8 |                   4120.8 |                 4027.3 |
| D8sv3 - Temp disk             |                      128.8 |                      128.8 |                  16484.1 |                 4044.4 |

| Read (us)                     | Sequential 1MiB (Q=8, T=1) | Sequential 1MiB (Q=1, T=1) | Random 4KiB (Q=32, T=16) | Random 4KiB (Q=1, T=1) |
|-------------------------------|---------------------------:|---------------------------:|-------------------------:|-----------------------:|
| L8s - P30 disk (no caching)   |                   40817.78 |                   13385.39 |                 98649.36 |                4115.48 |
| L8sv2 - P30 disk (no caching) |                   49612.29 |                   15723.51 |                 98600.99 |                4477.90 |
| D8sv3 - P30 disk (R caching)  |                   61571.46 |                    7712.98 |                 30938.71 |                 150.24 |
| D8sv3 - P20 disk (R caching)  |                   61626.01 |                    7690.78 |                 30897.07 |                 152.44 |
| D8sv3 - P40 disk (R caching)  |                   61461.37 |                    7719.54 |                 30853.62 |                 152.34 |
| L8sv2 - NVMe disk             |                    3990.00 |                     569.32 |                  3883.10 |                  85.12 |
| L8s - OS disk (RW caching)    |                   20000.46 |                    2498.25 |                 12340.33 |                  77.16 |
| L8sv2 - OS disk (RW caching)  |                   92281.99 |                   11597.10 |                116845.03 |                 230.29 |
| D8sv3 - OS disk (RW caching)  |                   59395.36 |                    7428.99 |                 30443.21 |                 148.17 |
| L8s - Temp disk               |                   20200.87 |                    2534.45 |                 12374.76 |                 235.33 |
| L8sv2 - Temp disk             |                   97826.63 |                   12307.93 |                122198.56 |                 247.96 |
| D8sv3 - Temp disk             |                   61528.75 |                    7709.53 |                 30871.49 |                 246.41 |

As expected, the NVMe disk is a clear winner with impressive numbers. Disks P20, P30 and P40 have similar performance in D8sv3 no matter the sequential vs random IO or other parameters. I suppose it's the [limit of D8sv3 VM][1] itself and hence bigger/faster disks do not make sense unless you also get bigger VM.

#### Write

| Write (MB/s)                  | Sequential 1MiB (Q=8, T=1) | Sequential 1MiB (Q=1, T=1) | Random 4KiB (Q=32, T=16) | Random 4KiB (Q=1, T=1) |
|-------------------------------|---------------------------:|---------------------------:|-------------------------:|-----------------------:|
| L8s - P30 disk (no caching)   |                    204.068 |                     40.052 |                   21.093 |                  1.082 |
| L8sv2 - P30 disk (no caching) |                    167.793 |                     43.201 |                   20.993 |                  1.068 |
| D8sv3 - P30 disk (R caching)  |                    133.368 |                     45.303 |                   21.093 |                  1.392 |
| D8sv3 - P20 disk (R caching)  |                    133.166 |                     44.668 |                    9.704 |                  1.386 |
| D8sv3 - P40 disk (R caching)  |                    132.965 |                     46.768 |                   31.476 |                  1.410 |
| L8sv2 - NVMe disk             |                   1300.216 |                   1303.379 |                 1206.941 |                202.007 |
| L8s - OS disk (RW caching)    |                    417.296 |                    413.544 |                  169.629 |                 59.352 |
| L8sv2 - OS disk (RW caching)  |                     89.971 |                     89.968 |                    9.357 |                 11.926 |
| D8sv3 - OS disk (RW caching)  |                    140.084 |                    140.092 |                   28.910 |                 42.610 |
| L8s - Temp disk               |                    412.075 |                    412.138 |                  168.797 |                 36.305 |
| L8sv2 - Temp disk             |                     84.729 |                     84.730 |                   16.878 |                 16.772 |
| D8sv3 - Temp disk             |                    135.069 |                    135.069 |                   67.517 |                 27.387 |

| Write (IOPS)                  | Sequential 1MiB (Q=8, T=1) | Sequential 1MiB (Q=1, T=1) | Random 4KiB (Q=32, T=16) | Random 4KiB (Q=1, T=1) |
|-------------------------------|---------------------------:|---------------------------:|-------------------------:|-----------------------:|
| L8s - P30 disk (no caching)   |                      194.6 |                       38.2 |                   5149.7 |                  264.2 |
| L8sv2 - P30 disk (no caching) |                      160.0 |                       41.2 |                   5125.2 |                  260.7 |
| D8sv3 - P30 disk (R caching)  |                      127.2 |                       43.2 |                   5149.7 |                  339.8 |
| D8sv3 - P20 disk (R caching)  |                      127.0 |                       42.6 |                   2369.1 |                  338.4 |
| D8sv3 - P40 disk (R caching)  |                      126.8 |                       44.6 |                   7684.6 |                  344.2 |
| L8sv2 - NVMe disk             |                     1240.0 |                     1243.0 |                 294663.3 |                49318.1 |
| L8s - OS disk (RW caching)    |                      398.0 |                      394.4 |                  41413.3 |                14490.2 |
| L8sv2 - OS disk (RW caching)  |                       85.8 |                       85.8 |                   2284.4 |                 2911.6 |
| D8sv3 - OS disk (RW caching)  |                      133.6 |                      133.6 |                   7058.1 |                10402.8 |
| L8s - Temp disk               |                      393.0 |                      393.0 |                  41210.2 |                 8863.5 |
| L8sv2 - Temp disk             |                       80.8 |                       80.8 |                   4120.6 |                 4094.7 |
| D8sv3 - Temp disk             |                      128.8 |                      128.8 |                  16483.6 |                 6686.3 |

| Write (us)                    | Sequential 1MiB (Q=8, T=1) | Sequential 1MiB (Q=1, T=1) | Random 4KiB (Q=32, T=16) | Random 4KiB (Q=1, T=1) |
|-------------------------------|---------------------------:|---------------------------:|-------------------------:|-----------------------:|
| L8s - P30 disk (no caching)   |                   40799.23 |                   26029.26 |                 98372.25 |                3777.46 |
| L8sv2 - P30 disk (no caching) |                   49617.07 |                   24181.19 |                 98992.59 |                3829.51 |
| D8sv3 - P30 disk (R caching)  |                   62353.77 |                   23019.10 |                 98263.99 |                2936.44 |
| D8sv3 - P20 disk (R caching)  |                   62433.34 |                   23427.75 |                204262.98 |                2949.40 |
| D8sv3 - P40 disk (R caching)  |                   62371.02 |                   22387.84 |                 66148.71 |                2900.10 |
| L8sv2 - NVMe disk             |                    5623.68 |                     803.43 |                  1577.99 |                  20.11 |
| L8s - OS disk (RW caching)    |                   19946.69 |                    2512.65 |                 12277.98 |                  68.47 |
| L8sv2 - OS disk (RW caching)  |                   91918.53 |                   11602.18 |                116659.01 |                 234.15 |
| D8sv3 - OS disk (RW caching)  |                   59136.99 |                    7424.76 |                 29183.79 |                  95.48 |
| L8s - Temp disk               |                   20195.58 |                    2532.72 |                 12364.83 |                 112.18 |
| L8sv2 - Temp disk             |                   97673.81 |                   12279.27 |                122200.62 |                 242.85 |
| D8sv3 - Temp disk             |                   61271.61 |                    7692.77 |                 30760.47 |                 148.73 |

Same story, first place for NVMe. Who would have thought, right? :) Now at least for the _Random 4KiB (Q=32, T=16)_ (which matches the best the workload the machines are doing now) workload the P20, P30 and P40 in D8sv3 show different performance and match the expectation of P20 < P30 < P40.

#### Summary

Different workloads have different needs, so measure yourself. Frankly switching between VMs isn't that difficult, so you can change your mind later if needed. And if you relies on best IO subsystem possible, get the Lsv2 and use the NVMe disk available.

[1]: https://docs.microsoft.com/en-us/azure/virtual-machines/dv3-dsv3-series#dsv3-series
[2]: https://crystalmark.info/en/software/crystaldiskmark/