---
description: |
  I have successfully changed an audio file to a new format using Deno and ffmpeg with a child sub-process but discovered a new hurdle for deployment.
date: "2023-01-29T12:17:05Z"
---

I have successfully changed an audio file to a new format using Deno and ffmpeg with a child sub-process but discovered a new hurdle for deployment.

This all started when I began experimenting with streaming files from the back end. All of these tasks are quests on the way to
prototyping Plaeback*.

I found insufficient tools in the Deno environment to convert a audio files format. After long hours of research the first solution that worked
and communicated simply and effectively was to run a sub-process calling `ffmpeg` package.

I will continue to explore finding a ffmpeg Web Assembly to leverage as an alternative.

I am now pushed into a new world of considering where my application will need to live in production. I will have to use an AWS EC2 with 
a dockerized image of my program most likely, because Deno Deploy will likely not allow me to use that many resources (I need to check their paid tier plans first).

All in all, a lot of discover on the mission to create a powerful web application that will change the world. :smile: