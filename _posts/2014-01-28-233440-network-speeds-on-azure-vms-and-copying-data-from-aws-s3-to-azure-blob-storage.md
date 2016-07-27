---
title: "Network speeds on Azure VMs and copying data from AWS S3 to Azure Blob Storage"
date: 2014-01-28T09:39:00Z
tags:
  - Amazon AWS
  - Azure
  - Azure Storage
  - Cloud
  - Storage &amp; Backup
redirect_from: /id/233440/
layout: post
---
I recently moved about one TB from [AWS S3][1] to [Azure Storage][2]. Nothing special. However, doing that using my connection would mean weeks of copying, I decided to spin up a VM and use huge pipes in both datacenters to speed up the process.

<!-- excerpt -->

Because this is network-IO bound process I didn't needed beefy machine with bunch of CPUs and plenty of RAM. I decided to spin up "Extra Small" [VM in Azure][3] datacenter ([West Europe][4] in my case). In my view it's easier on Azure. This VM has the network bandwidth limited to 5Mbps, as I learned later. Surprisingly the limitation is applied even when you connect to the same Azure datacenter (frankly even the same availability group). That caught me little off guard.

I didn't wanted to wait that long and I switched to "Small" VM instance where the bandwidth is (according to documentation) 100Mbps. But I was able to hit between 300Mbps to 500Mbps reading from AWS S3 and about 100Mbps to 200Mbps writing to Azure Blob Storage. Maybe when there's enough bandwidth available the limiting is not applied.

Bandwidth limitation "in same Azure datacenter" was surprising (though I understand the limit is probably enforced on VM's NIC) and pleased that the "Small" instance (at least in my case), although having some limitation on bandwidth specified, transferred the data like a storm.

[1]: http://aws.amazon.com/s3/
[2]: http://www.windowsazure.com/en-us/services/storage/
[3]: http://www.windowsazure.com/en-us/services/virtual-machines/
[4]: http://en.wikipedia.org/wiki/Windows_Azure#Datacenter