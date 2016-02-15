---
title: "My migration process from Exchange 2010 to Exchange 2013 on SherWeb"
date: 2013-01-17T11:10:56Z
tags:
  - Email
redirect_from: /id/233142/
category: none
layout: post
---
I'm a long time customer of [SherWeb][1]. I'm with them almost since they started offering hosted Exchange and I like it. Great service (uptime, antispam, performace, ...). I migrated from Exchange 2007 to 2010 and now the time brought me to 2013. Currently there's no automated click-in-admin-panel solution available, hence you have to do a lot of stuff "manually". And a lot of things can go wrong. If you're a huge company, with thousands of mailboxes, you'll probably need more advanced/automated process than me with few of mailboxes.

<!-- excerpt -->

My preparation took about two hours. And of course I wanted to do everything without any email loss and so on. First I started thinking about it. Not because I'm unhappy on Exchange 2010, but why not to try Exchange 2013, especially if it's hosted, thus not much work for me (except the migration of course). Then I sketched it in my head and asked sales person to enable the Exchange 2013 in my client section. After that was done, it was all on my shoulders. So here's the process.

*	Create same users and mailboxes on 2013 as you had on 2010. You can do it manually or import from file in SherWeb's admin panel. I did it manually. Partly because I have few users and partly because I wanted to see whether is there something new to learn about.
*	Log in to new mailboxes. Just to init everything.
*	Then I disconnected all mobile devices. I simply removed the account. To start clear.
*	I changed all DNS records, except the one for _autodiscover_.
*	Wait. :)
*	In admin panel you can see number of items in mailbox for selected user. As the DNS records start propagating you'll emails coming to new mailbox (and you'll also see your old mailbox being silent). Give it a more time, just to be sure majority has new DNS records (this may be up to few days, based on your TTL and real refresh rate of other DNS servers).
*	Export current mailbox(es) to PST. Close Outlook.
*	Activate "data import" in admin panel. This will give you FTP account where to upload the PST(s).
*	Upload PST(s).
*	Refresh the page mentioned in 7.
*	Check the matching of filenames and users, correct if needed and start import. This will probably take a while. You could probably do it with Outlook as well, copying all items to new location, but I thought this could be faster.
*	Change the DNS record for _autodiscover_ and wait again (or force your local DNS server to refresh, if you have one).
*	Wait for import to finish.
*	Delete the current profile for Outlook and add new. You'll get all the information from already available _autodiscover_.
*	Outlook starts fetching emails from mailbox on 2013. And also the new emails are there waiting for you. :)

Enjoy. After some testing (give it a few days) you can terminate your old Exchange 2010 contract.

This process worked for me. I tried to avoid any potential traps, but your mileage may vary. Use your brain. Always have working backups.

[1]: http://www.sherweb.com
