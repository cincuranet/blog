---
title: |
  Handling a dollar sign in a username for deploying Azure Web App via FTP on GitLab CI
date: 2017-02-26T16:45:00Z
tags:
  - Azure
  - GitLab
layout: post
---
As usual the easiest things take a lot of time - or luck - to debug. Last few days I was trying to deploy this blog to a Azure Web App (thanks to the credit I get as a MVP - else even the Raspberry could handle serving these static pages) from [GitLab's CI][1] via good old FTP. The problem is the FTP username on Web App is always in the form of `web_app_name\$web_app_name`. So the backslash and dollar cannot be avoided i.e. by regenerating publishing credentials. And I don't have to explain to you these characters are often, in various environments, handled specifically.  

<!-- excerpt -->

#### TL;DR

Long story short, if you have dollar sign in a GitLab CI variable, you have to escape it by another `$`. In my example it would be `web_app_name\$$web_app_name`.

#### Full story

For FTP deployment I'm using `lftp` and a trivial `bash` script. Putting the username and password into [Secret variables], to be able to have the repository public. Running the build I was unable to login. Some debugging later I found the username was not correctly passed to the FTP server. At that point I somewhat convinced myself the `lftp` is doing something wrong handling the credentials and I spent days trying to avoid it (various quotings, different commands, ...).

Luckily [I got a nudge][3] in a correct direction. What if the `lftp` is innocent and GitLab CI is doing something wrong? Quick `echo` test confirmed it. The dollar sign (and whatever follows) is expanded on GitLab CI before (as if it was a regular variable) passing it to the script. Quoting it with another `$` solves it right away. 

I was hunting in a completely wrong forest! 

[1]: https://about.gitlab.com/gitlab-ci/
[2]: https://docs.gitlab.com/ce/ci/variables/#secret-variables
[3]: http://stackoverflow.com/questions/42423215/handling-sign-in-username-in-lftp/42467280