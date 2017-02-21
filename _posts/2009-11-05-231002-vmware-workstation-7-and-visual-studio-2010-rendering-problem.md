---
title: |
  VMWare Workstation 7 and Visual Studio 2010 rendering problem
date: 2009-11-05T10:28:03Z
tags:
  - Virtualization
  - Visual Studio
  - VMware
layout: post
---
[I recently migrated][1] from VPC to VMWare Workstation. So far all looks good only one problem I faced two days ago. When I run Visual Studio 2010 (Beta 2), the menu rendering was odd, text in code editor was disappearing and so on. After some searching I found, that it may be caused by 3D graphics acceleration turned on in VMWare Workstation. Surprisingly you have to turn it off - either in system, [setting DisableHWAcceleration in registry][2] (it's for WPF) or unchecking the 3D acceleration in VM's settings. After this adjustment (my choice was the VM level, as it may be improved later and it's IMO easier to turn it on), all works great. I hope when the RTM of Visual Studio 2010 will be released, this will work as expected.

[1]: {% post_url 2009-11-05-231004-virtual-pc-vmware-workstation %}
[2]: http://msdn.microsoft.com/en-us/library/aa970912.aspx