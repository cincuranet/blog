---
title: "VMWare Workstation 7.1 solves the Visual Studio rendering problem"
date: 2010-06-01T13:52:02Z
tags:
  - Virtualization
  - Visual Studio
  - VMware
  - Windows Presentation Foundation (WPF)
layout: post
---
The [VMWare Workstation][1] [had a problem with Visual Studio 2010 rendering (in fact all WPF apps were affected) when the hardware graphic acceleration was turned on][2]. But since [version 7.1][3] this is no longer true.

Recently I updated my virtual machine (VMWare Workstation 7.1 + new VMWare Tools + turning graphic acceleration on) with Visual Studio 2010 and the rendering is correct. Finally I'll enjoy the graphic card accelerated machine and lighten up CPU.

[1]: http://www.vmware.com/products/workstation/
[2]: {% post_url 2009-11-05-231002-vmware-workstation-7-and-visual-studio-2010-rendering-problem %}
[3]: http://www.vmware.com/support/ws71/doc/releasenotes_ws71.html