+++
title = "Promises could make your code slower"
date = 2025-11-05
[taxonomies]
tags = ["javascript", "web-development", "nodejs"]
[extra]
lang = "en"
+++

if a task doesn't take that much time but you still use a promise, when that promise is resolved. it still goes to the back of the queue and waits for other functions to execute.
GraphQL uses a lot of promises.

Source: [The Hidden Cost Of GraphQL And NodeJS - YouTube](https://youtu.be/i0YfiQlzv6M?si=DB9aMBp4u-zMdJfy)

