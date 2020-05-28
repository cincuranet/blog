---
title: |-
  How I got my machine back, patiently, after overloading it
date: 2018-02-07T20:36:00Z
tags:
  - Lessons learned
  - Life
  - Disaster recovery
  - Windows
  - Operating systems
---
At the moment, one of my explorations is how the system (Windows) handles more-than-number-of-CPUs threads (all ready to run) under full load (from these threads). And because I'm out of office, I access my workstation remotely (using [TeamViewer][1], in case you're wondering).

<!-- excerpt -->

As I was hammering the machine with threads and fully (or rather overly) utilizing the CPU, I realized the test-bench I had, is going to take a while to complete. So, I closed my connection and let it run. Unfortunately, I miscomputed the time (or rather the size of the task) and it was not finishing after almost 24 hours. It was time to kill it and start over.

The (first) problem was, the machine was so hammered, I couldn't connect back. TeamViewer was not able to respond quickly enough to the connection request. I had to patiently keep trying, until I was lucky enough the TeamViewer's thread(s) were scheduled at the correct time and had enough CPU quota to respond. Love to the scheduler, priority boost and who knows what was kicking in at that time.

Once I was there, the machine still hammered, it was (again) question of waiting for the right threads of Process Explorer and TeamViewer (remember I was connected remotely) to get CPU love and respond to my inputs and process my "killing orders". With about ten-fifteen minutes of patience, I killed my process and the machine was again under my full control. Yay.

What is the lesson? Patience is the key and OS scheduler is the king. Moreover, now I know my workstation stays stable even under 23+ hours of full (CPU) load.

[1]: http://www.teamviewer.com