---
title: |-
  Mail today?
date: 2015-09-11T13:58:00Z
tags:
  - Email
  - Windows
  - Cloud
---
I recently moved my email. Moving from Exchange 2013 to IMAP with CardDAV and CalDAV. I felt the Exchange started to be too much for me and also constraining me a little. The weird behavior of Outlook last week was the trigger.

Thanks to the option to connect to my Exchange also via IMAP exporting emails was easy. Same with contacts. The plain old CSV and that's it. Finally the calendar. That was bit harder, because export to iCal from Outlook was, well say, dirty. But I found tool called _FreeMiCal_. After changing the sources a little and also doing some mass changes via Outlook I was able to export it in a format I liked and also format I was able to import into services I was testing. Once the exports were imported it was time to start consuming all the services.

<!-- excerpt -->

Although I tried bunch of email-only programs (like Opera Mail, Claws Mail, The Bat!, ...) I knew that's this not a way to go. Without contacts being synchronized it's useless. I was just looking what's available, maybe hoping for something awesome, where I would consider, maybe, synchronizing contacts manually (nothing).

So at the end I ended up with two programs: [eM Client][1] and [Thunderbird][2]. I started with eM Client. Although the calendar and contacts worked fine, the IMAP was different story. IMAP folders subscribe function I could skip as I use all folders except one anyway. But it was unable to synchronize all my email – just under 4GB and about 80 thousand items – in almost 4 days. The IMAP `IDLE` command seemed to be not working, although it might have been because of the running synchronization in background. Who cares? At the end I decided this isn't program I want to use.

Thunderbird was next. I knew the development was no longer priority for Mozilla. Not necessarily bad thing if it's already good. It synchronized all the emails in less than half a day. Good start. The IMAP `IDLE` worked great (even during synchronization). Clearly the implementation was field tested. I made calendar work, although the CalDAV discovery was not working. With help of extension, the CardDAV started to work, although when the address book was named "Default" or "Test" it was no able to synchronize. Go figure. Then I started customizing the UI. First some keyboard shortcuts. Not possible. Extension needed. Everything pointed to "Keyconfig" extension. After installing it was clear that my feeling that it's outdated was confirmed. To make the story short some shortcuts we're not working. Then it was showing the list of emails. Two line list not supported. Bug report years old. Nobody cares. Not a state for year 2015, at least for me. Missing conversation view. Another missing piece. No, the extension sucks as well (but I would not blame the extension, this in my opinion needs to be integral part of product).

Who would have thought that in 2015 there will be shortage on email clients on such an internet-born technology field as email? Weird and depressing together.

At the end I'm using the web interface (as probably the majority of normal users). It's not best (if you're power user), especially the offline experience, but it sucks the least from all the other options.

Funny that the best email client today, I currently use, is the default Mail app one on my iPhone. And it has CardDAV and CalDAV support.

[1]: http://www.emclient.com/
[2]: https://www.mozilla.org/en-US/thunderbird/