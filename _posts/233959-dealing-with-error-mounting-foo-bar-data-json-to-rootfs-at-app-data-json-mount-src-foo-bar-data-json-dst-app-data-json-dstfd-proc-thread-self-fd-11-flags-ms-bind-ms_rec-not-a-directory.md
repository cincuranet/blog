---
title: |-
  Dealing with "Error response from daemon: failed to create task for container: failed to create shim task: OCI runtime create failed: runc create failed: unable to start container process: error during container init: error mounting "/foo/bar/data.json" to rootfs at "/app/data.json": mount src=/foo/bar/data.json, dst=/app/data.json, dstFd=/proc/thread-self/fd/11, flags=MS_BIND|MS_REC: not a directory: Are you trying to mount a directory onto a file (or vice-versa)? Check if the specified host path exists and is the expected type"
date: 2026-02-02T10:53:00Z
tags:
  - Docker
---
I recently spent great amount of time dealing with the error `Error response from daemon: failed to create task for container: failed to create shim task: OCI runtime create failed: runc create failed: unable to start container process: error during container init: error mounting "/foo/bar/data.json" to rootfs at "/app/data.json": mount src=/foo/bar/data.json, dst=/app/data.json, dstFd=/proc/thread-self/fd/11, flags=MS_BIND|MS_REC: not a directory: Are you trying to mount a directory onto a file (or vice-versa)? Check if the specified host path exists and is the expected type`. I guess I'll share and maybe this will save some time to somebody.

<!-- excerpt -->

This was a container that expects `/app/data.json` file and my `docker-compose.yml` contains `- /foo/bar/data.json:/app/data.json:ro` so everything should be working. But it wasn't. Here are the steps I did and you can guess where I made the mistake.

I started the container. Initially the `/foo/bar/data.json` was not present, you know, go raw, go big, go default. That created `/foo/bar/data.json` directory. OK, time to fix that. I deleted the directory and created a file. Start container. Same error. Time to double check. Yes, it is a file, and it is where it is supposed to be. Start container again. Same error. Am I crazy? Tripple check. Yep, all looks good. What's going on?

Can you guess? 

Of course, the problem was between the chair and the keyboard. I did not recreate the container; I was still starting the original one. Quick `docker rm ...` and `docker compose up -d` and everything was working. The `Are you trying to mount a directory onto a file (or vice-versa)?` threw me completely to a wrong path, because I was though it somehow still sees the old directory.

Lesson learned. And if you're reading this, I hope it saves you some time.