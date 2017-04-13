---
title: |-
  NuoDB has new (web-based) management console
date: 2012-11-21T15:38:56Z
tags:
  - Databases in general
  - NewSQL
  - NoSQL
  - NuoDB
layout: post
---
I don't know whether you noticed, [NuoDB][1] is now in RC stage. If you're following NuoDB long enough you might remember old console (you can check some images in [my older post][2]). It was a Java based application. Simple and it was not nice. Now it's different. It's web based. So it's easier to connect to it. You can even connect to it from your phone (if it's powerful enough to handle the JavaScript). It's way nicer, nothing fancy (but I'm not expecting to be super cool, it's basically admin panel for database, right?) and mainly, it has tons of new features.

After you log in, you see (initially) basic screen about your (now) so called domain.

[![image]({% include post_i_link post=page name="01-nuodb-newconsole-main_thumb.jpg" %})][3]

Probably first thing you'll try is starting new database. Simple wizard will allow you to do this. Here's final screen before starting it up.

[![image]({% include post_i_link post=page name="02-nuodb-newconsole-creatingdb_thumb.jpg" %})][4]

You can then see how is your database doing. Transaction nodes, storage nodes, memory etc.

[![image]({% include post_i_link post=page name="03-nuodb-newconsole-database1_thumb.jpg" %})][5]

You can even see some graphs about what's going on (it's live updated).

[![image]({% include post_i_link post=page name="04-nuodb-newconsole-database2_thumb.jpg" %})][6]

Very important for your database is keeping everything smooth and cleanly running. And if something goes wrong (or actually seems to be going wrong), act. In the new console you can set up alerts based on different events or metrics and browse these for investigation, for example.

[![image]({% include post_i_link post=page name="05-nuodb-newconsole-alerts_thumb.jpg" %})][7]

[![image]({% include post_i_link post=page name="06-nuodb-newconsole-newalert_thumb.jpg" %})][8]

You know I said I'm considering it being admin panel for database. Plain simple is OK for me. If I'm using it often enough my muscle memory learns the moves and I can get my information quickly whenever it is. Sometimes it takes little it longer, but hopefully we're not doing this admin stuff often. But the new web console allows you customize some views to your needs, hence you can have all your information in front of you on few screens. You can show different views, organize these or collapse some. Some views are even parametrized, i.e. by database.

[![image]({% include post_i_link post=page name="07-nuodb-newconsole-custommain_thumb.jpg" %})][9]

I like the new console. With the old one I was more happy with the command line and doing everything manually. With the new one I'm doing more and more stuff in it, especially if trying something.

_I know I promised blog post about using NuoDB in cloud (Amazon EC2/Amazon S3), but still busy to prepare it completely. :/_

[1]: http://www.nuodb.com
[2]: {% include post_id_link id="232901" %}
[3]: /i/233089/01-nuodb-newconsole-main.png
[4]: /i/233089/02-nuodb-newconsole-creatingdb.png
[5]: /i/233089/03-nuodb-newconsole-database1.png
[6]: /i/233089/04-nuodb-newconsole-database2.png
[7]: /i/233089/05-nuodb-newconsole-alerts.png
[8]: /i/233089/06-nuodb-newconsole-newalert.png
[9]: /i/233089/07-nuodb-newconsole-custommain.png