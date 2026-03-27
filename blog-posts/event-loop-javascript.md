+++
title = "نحاول نفهم JavaScript"
date = 2025-10-27
[taxonomies]
tags = ["javascript", "event-loop", "web-development"]
[extra]
lang = "ar"
+++

الـ Event loop واحد من المفاهيم الأساسية التي لا يسعنا تجاهلها في جافاسكربت.

اي كود جافاسكربت بيعتمد على عدة عناصر لازم نفرق بينهم عشان نفهم دور الـ Event loop:

## 1. الـ V8 Engine

ووظيفته يحوّل JS إلى Machine Code. مكتوب بـ C++ مستعمل في متصفحات مثل كروم وفي Node. اهم نقطة هنا انه Single Thread ويستعمل Call Stack لتنفيذ العمليات

## 2. الـ (Node/Browser) Runtime Environment

هي البيئة اللي بتوفر الـ Node APIs او الـ Web APIs مثل الـ setTimeout او الـ Network requests الخ.

## طيب اذا كان الـ V8 اصلا Single threaded كيف نقدر نكتب كود asynchronous ؟

هنا يجي دور الـ Event loop والـ Callback Queue اللي هم جزء من الـ Runtime Environment

## طيب كيف تتم العملية؟

1. لما نسوي call لمثلاً setTimeout الكود يتنفذ أولا في الـ Call Stack داخل V8.
2. تتم متابعة العملية في الـ Runtime Environment وهنا Node تستعمل open source library اسمها libuv
3. لما تنتهي العملية الـ Callback ينحط في Callback Queue.
4. الـ Event Loop كل اللي عليه يراقب: إذا الـ Call Stack فاضي، يسحب الـ Callback من الـ Queue ويدفه للـ Stack عشان يتنفذ.

---

الفيديو هذا يوضح الفكرة بشكل ممتاز باستخدام امثلة عملية:

[Watch: What the heck is the event loop anyway?](https://www.youtube.com/watch?v=8aGhZQkoFbQ)
