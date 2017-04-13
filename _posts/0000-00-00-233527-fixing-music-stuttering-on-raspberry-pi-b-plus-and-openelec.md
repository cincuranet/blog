---
title: |-
  Fixing music stuttering on Raspberry Pi (B+) and OpenELEC
date: 2015-08-27T06:40:00Z
tags:
  - OpenELEC
  - Raspberry Pi
layout: post
---
I like music a lot. When I'm listening for pleasure, not simply as a "noise" on background, I like to enjoy it on my stereo without any fiddling with laptop or cables. I recently took Raspberry Pi (the B+ model) and OpenELEC and connected it to my receiver using HDMI. Everything works fine - I'm even impressed how smooth the OpenELEC runs and how much power the Raspberry Pi has, given the friendly price. There was only one problem. Sometimes. Irregularly. The music was playing fine and suddenly it stopped for a second or two. And then it was fine again for a minute or hour.

<!-- excerpt -->

I was trying to find what's the problem and fix. The challenge was that the system has no display connected, thus it's more of measuring from other places and guessing. 

#### Long story

I'm [running the setup via WiFi][1]. Less cables more fun. So my initial idea was that the WiFi is not fast enough. Although for few MB audio file it doesn't seemed plausible. And i.e. Chromecast was playing videos(!) fine. But you never know. I tried to create a lot of traffic on the wireless network to see whether the stuttering will occur more often. It didn't. 

So I thought maybe the small Raspberry Pi has not enough computing power to handle the WiFi dongle and the playback. That turned out not to be the case either. The CPU is not going over 80% during playback. 

So obviously it's the NAS not being able to sometimes get the data quickly enough. It's an old - but still absolutely fine for my home - Synology DS207+. Let's create some load there and see whether the problem occurs more often. Nope.

I was lost. I had one last idea to try. Buffering issue. But it convinced myself, based on my expert-guess-work-with-no-evidence (and tests described above), that that's not the cause. Also there was lot of descriptions of similar problem around interwebs with only small difference - mentioning video. Of course video data is bigger and need more bandwidth and processing power. I though I clearly disproved that by my testing earlier. Proved.  

I left it for few months, having other stuff to do. Finally this week I gave up and decided to first connect a screen and also to check the buffering. It took me a while to simulate it, because it happens so randomly. But once it happened there was no "buffering" message on the screen. "Dammit I thought. I even tried this stupid idea and it's, clearly, not it." But while I was there I decided to not only try find the cause, but also blindly try the solution. The solution often mentioned with video problems I mentioned above. 

#### Solution    

I edited [`advancedsettings.xml`][3] file with this content.

```xml
<advancedsettings>
        <network>
                <buffermode>1</buffermode>
                <readbufferfactor>4.0</readbufferfactor>
        </network>
</advancedsettings>
```

Although a lot of articles mentions this with respect to video, it applies to audio (music) as well (at least in my case). The `buffermode` (although `1` is default) turns off buffering for any filesystem. Just in case the default value would change in future. I'm not specifying, often mentioned too, `cachemembuffersize`, leaving it on default value (in time of writing 20971520). For music, who cares. But what is important is the `readbufferfactor`. It's basically multiplier of cache fill rate ([full description][2]). I think all the reasons I tested previously are the cause (OK, maybe the Raspberry Pi has enough processing power (for music) no matter what). But all together. I tested them in isolation. With the `readbufferfactor` set gracefully to `4.0` (I guess (again ;)) that's a good multiplier - not too much, not too little) I have no problems with music stuttering. I don't even mind OpenELEC eating a lot of bandwidth, as the documentation warns. First the music files are not huge. And also when I'm listening, that's the priority on my network and nothing else.

Now I can nicely enjoy my music and relax. 

[1]: {% include post_id_link.txt id="233491" %}
[2]: http://kodi.wiki/view/HOW-TO:Modify_the_video_cache#Cache_settings
[3]: http://kodi.wiki/view/Advancedsettings.xml