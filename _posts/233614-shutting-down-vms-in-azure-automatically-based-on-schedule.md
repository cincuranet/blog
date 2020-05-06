---
title: |-
  Shutting down VMs in Azure automatically based on schedule
date: 2017-04-24T14:05:00Z
tags:
  - Azure
  - Cloud
---
Azure VMs are great for developers for testing stuff, not only running servers. Then often you don't need the VM all the time. You can shut it down i.e. during the night and save some money. The only problem is to remember to do it. Especially if the VM is used in a team etc. Luckily Azure portal has a less-known feature, as I've found last Friday when chatting with a friend, to help you with it.

<!-- excerpt -->

If you go to the VM's blade, then on the left side you can find "Auto-shutdown".

![Auto-shutdown]({{ include "post_ilink" page "001.png" }})

Clicking on that allows you to specify time when the VM should the turned off (with optional time zone). How convenient is that? 

![Auto-shutdown]({{ include "post_ilink" page "002.png" }})

You can also specify webhook that the infrastructure will call 15 minutes before the action happens.

Although you can do the same with simple script and _Scheduled Tasks_ or _cron_, this is very easy way with literally no barrier to do it.