---
title: |-
  FBCon 09 - "live" feed
date: 2009-11-19T07:10:09Z
tags:
  - Firebird
---
The conference is about to start. I'll write here more and more from it, read it top to bottom.

* It's  8:25, conference rooms are getting the last polish. You can also deduct, that I successfully found the place.</li>
* The conference is held in [Bauzentrum in München][1]. There's a lot of stuff for people who are building houses etc. in hallways. I like it. :)
* Session from Dmitry. Good for people asking about limitations and features, why are/aren't there. The final statement is that [Firebird Project][2] isn't trying to implement all features from Oracle, MS SQL Server, PostgreSQL, ... ;) But project is definitely open to good ideas from other projects. And no experiments with features.
* The trace and audit session from Vlad just finished. I like this new feature, but I was not paying attention to during development, so this was a nice summary of my shattered knowledge. But what I don't like is the configuration file format - mix of XML and standard text config file. :( And same for output, it's not some kind of "computer ready" format, like i.e. again XML, it's just a text, which will be for people harder to parse - but [Thomas Steinmaurer][3] already created one application. However the API is open, so probably sooner or later, I hope, somebody will create plugin with this output (and maybe also one for putting the content into database - what about MS SQL and using Analysis Services? :D)
* After these sessions it was Holger's turn. About the replication of databases. It was interesting to see the different approach based on creating the actual query executed from inside the trigger. Sure it has some limitations and we found some also during the session, but if you're OK with the way how it works, it's a good and easy-to-implement solution. But I think, just because I rather wanna to have more "based on values rather than on creating commands" approach to the synchronization/replication I would probably go in a different direction.
* After this session was my session - the PocketPC and Firebird stuff. It was, sure, the best topic of the day ;), and because describing own presentation is weird, I would just skip it and hand you to the recording which will be available, for sure.
* The final session was a all-hands-session about the Firebird and performance. There's nothing special to write about it, because everybody put his/her input it was better to be there than not.
* And maybe the most important part was the city sightseeing and dinner during the evening. These "after-events" are great opprotunity to ask anybody you choose about your problem or give an interesting feedback, hence if you're not here, you're definitely missing something. :)

Day 2 is ready. Everybody fresh and relaxed ;). Weather in München is nice.

* The first session today was from Vlad about mainly some MS C++ runtime issues with recent changes in WinXP, Vista and Win7. If you were deploying the server in the meantime (or you're using older (sub)versions) it was definitely worth listening. The current versions of Firebird server have not these issues, because it was successfully solved.
* Following session was from Alex about new protocol features, mainly in 2.5. As a provider writer I was a nice overview of what I will need to do in next couple of months to catch up with server. :) Also if you wanna to use some brand new features, this session was a good opportunity to see what's going on inside and what you can do (i.e. if you components are not supporting all options).
* If you're reading this, you missed my presentation, which was the next in schedule. Again I'll skip any description.
* Session finished right now was Holger's about backup and restore. Because I saw last presentation from Ivan Prenosil last year about (I think) 10 ways of doing backup I was not expecting something new. But in fact there was something new. The IBExpert except the [IBExpert][4] itself has a really nice set of tools, like a scheduler for backup & restore which you can very easily plug into your environment and use it for almost hot backup of your database on different server. Similarly for dealing with metadata changes and pumping data out and in.
* The final session from regular speaker was Dmitry's about the lock manager. To be honest I was never paying to much attention to fb_lock_print utility and I had only a very limited knowledge about it. But this presentation, especially demos, widened my knowledge little bit and I know, at least, what useful information I can find there, and if I'll not forgot all stuff also how to use these. ;) And seeing what's going on inside the lock manager also helps understanding the internals.
* Really the last session of the day was continuation of talking about improving performance of Firebird (itself or tools) and sharing and exchanging the information. Because everybody was contributing with (but mainly Holger) own pieces, it was really great ending of the day.

And here we're. The last day of conference. Everybody is looking little bit exhausted, but I'm sure we all are gonna to survive no matter what. :)

* First session of the day, was classical session about "what we can expect in next development and in next year", held by Dmitry. It was a nice overview what's going to happen and if you're not a member of devel and/or architect list (or you're not reading it often) also nice summary.
* Then the Vlad came in with new SQL features in Firebird 2.5. As I like a 2.5 a lot and I'm using it for more than a year, I was more or less familiar with these features (although I'm using only few of these). So if you're too lazy to read release notes for betas and RCs, this session was surely good for you.
* Before the lunch Alex had session about security. I liked the small recap of the history of security in Firebird and InterBase. Then the walk thru the new features and improvements was really good and exhausting, nice samples. I'm really looking forward to Firebird 3.0 to test all new security, mainly authentication functions. This could also make life easier for i.e. hosting providers offering Firebird.
* Once again (and for last this year) skipping my session. (BTW I realized that even if you're reading this text, there's change, that you've seen my presentation, so my yesterdays statement wasn't completely correct.)
* The session about the BI tools and Firebird from Roman was really nice. My focus is mainly in OLTP, and I'm looking to OLAP world only little bit, and this was a really nice for me to see also the other side of some problems and see, for me unknown, tools and what is and what is not possible and how hard or easy (desining some transformation looked really easy and quick, at a first sigh).
* Following session was from Roman too. Simply about the Java driver and using it. It was really nice to see how it works in Java world and what problems they're facing and comparing these in my head with .NET world problems. The example of [Hibernate][5] was nice too, as it's a similar tool to [Entity Framework][6] and "father" of [NHibernate][7], so I was able to briefly look to different approach for O/M mappers solution.
* The final (of the day) + final (of the conference) session was simply roundtable, where every developer from different parts of Firebird project (core, .NET, Java, ...) introduced little bit the subproject he is working on as well as him/herself. I was expecting people asking little bit too much about these subprojects and maybe sharing ideas and needs, but the discussion didn't furiously started. A pity.

What to say about this years conference? It was good definitely. I was really enjoying my presence as well as my presentations. So see you next year, maybe face to face maybe reading this feed (if I'll be doing it).

[1]: http://www.muenchen.de/bauzentrum
[2]: http://www.firebirdsql.org/
[3]: http://blog.upscene.com/thomas/index.php?entry=entry091117-082809
[4]: http://ibexpert.net/ibe/
[5]: https://www.hibernate.org/
[6]: http://msdn.microsoft.com/en-us/library/bb399572.aspx
[7]: http://www.nhforge.org/