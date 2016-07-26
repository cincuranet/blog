---
title: "HomePage dokumentace k .NETu"
date: 2007-03-25T14:46:00Z
tags:
  - .NET
redirect_from: /id/224680/
category: none
layout: post
---
Dlouhou dobu mě strašně štvalo, ze když otevřu dokumentaci k .NET FW, tak se načte "taková ta první stránka". Ladil jsem kde co v Document Exploreru a nic. Až včera mě napadlo podívat se, co vlastně ten zástupce dělá. Bingo. Stačilo vyhodit jeden přepínač a bylo vymalováno. Pokud to někoho taky štve, stačí upravit na tvar `"C:\Program Files\Common Files\Microsoft Shared\Help 8\dexplore.exe" /helpcol ms-help://MS.NETFramework.v20.en /usehelpsettings NETFrameworkSDK.20` tedy vyhodit `/LaunchNamedUrlTopic DefaultPage`.

Teď jsem spokojený, aspoň se to otevírá trochu rychleji a nehrabe to hned na disk pro věc, kterou vůbec nechci. :-) Vždycky si otevřu až stránku co mne zajímá.