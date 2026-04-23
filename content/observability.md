+++
title = "Observability"
date = 2026-04-23
[taxonomies]
tags = ["observability", "logging", "software-engineering", "backend"]
[extra]
lang = "en"
+++

Observability used to be one of those scary words for me. Early on, still learning, it felt very technical. What do you even mean by "observability"? I didn't get it.

It only clicked after I worked on some production apps. Of course you need some way to know what's going on in prod. You need to detect issues before users do. You need to monitor things. You don't really understand a concept until you see what it solves, until you see why it exists.

So: observability is just your ability to observe your application. Not only in production, also in development. When you're building something, you still need to know what's happening with each request, what's going on inside the app.

Heads up: this post ends up being mostly about **logs**, because that's where I've spent the most time. The other pillars I'll introduce but not go deep on.

## The three pillars

Observability rests on three pillars: **metrics, logs, and traces**. Which one matters most depends on your use case.

**Metrics** are numerical measurements: request count, error rate, p99 latency, how long your video transcoder takes per video, CPU usage, queue depth. They're cheap to store, easy to graph, and what you usually alert on. "Monitoring" is the practice of watching metrics; metrics are the data.

**Logs** are a diary of what happened in your app. Timestamped records of events. A request came in, a query ran, an error was thrown.

**Traces** show where a single request went and what happened at each service it hit. Big deal in microservices, where a checkout can touch 15 services before it finishes.

The glue that ties all three together is a **correlation ID** (often called a trace ID or request ID). When a request enters your system, you generate one ID and attach it to every log, span, and metric that request produces, and you propagate it across services via HTTP headers. Now you can pull up a single request's entire journey by that ID: every log, span, and metric it touched. If you take one habit away from this post, make it this one.

## Logs

There's a really good article called [Logging Sucks](https://loggingsucks.com/). Honestly one of the best things I've read. The whole site is beautiful, well written, well articulated. It talks about why your logs suck and what they should actually look like.

The main idea: your logs should contain everything you need to know about a request. A request comes in, and you want to know the payment method, the user's region, whatever context matters. You attach that to the log.

This is called **structured logging**, emitting logs as key-value pairs (usually JSON) instead of plain strings:

```js
// bad
console.log("Payment failed for user " + userId)

// good
logger.info({ event: "payment_failed", userId, amount, provider, requestId })
```

The extreme version of structured logging is what Stripe calls a **canonical log line**, and what the Logging Sucks article calls a **wide event**: one big, context-rich log per request per service, with 30–50 fields attached, instead of 15 thin log lines scattered across your codebase. You accumulate context as the request moves through your code and emit one event at the end. This is where modern logging is heading, and it's worth reading the Logging Sucks article end-to-end for the full pitch.

You can already imagine how this gets complicated. You need to track the request, follow where it goes, and enrich it with context along the way. Thankfully, libraries handle this for you.

### Log levels

Every log has a severity level. The usual ladder, from chattiest to loudest:

- **trace**: extremely fine-grained, usually off
- **debug**: dev-only, noisy
- **info**: normal events (requests completing, jobs running)
- **warn**: something weird but not broken
- **error**: something broke, but the app kept going
- **fatal / critical**: something broke and the app is going down

Your app produces all this data and you need somewhere to store it and view it. That's where observability backends come in: Grafana (on top of Loki/Prometheus), Datadog, New Relic, Honeycomb, Axiom. Every big cloud provider has their own too: AWS CloudWatch, GCP Cloud Logging, Azure Monitor. Sentry is in this ecosystem but narrower. It's mainly an error tracking / APM tool, not a general log store, so don't expect to route all your logs there the way you would with Loki.

The nice thing is you can swap between these pretty easily, because the industry has mostly agreed on a standard: OpenTelemetry.

### Don't log everything (sampling)

One thing the Logging Sucks article made me realize: you don't actually want to log 100% of everything. You **sample**, meaning you keep only a percentage.

A sensible default: 100% of errors, 100% of slow requests, 100% of anything from VIP customers, and 1–10% of the happy path. This is called **tail sampling**, where you decide what to keep *after* the request finishes, so you never throw away the weird ones.

Two reasons this matters. One: the signal-to-noise ratio gets better when you're not drowning in successful requests. Two: **cost**. Observability bills get scary at scale. Datadog surprise invoices are a whole genre. Sampling is how you stay solvent.

## OpenTelemetry

OpenTelemetry (OTel) is the industry standard for collecting and shipping telemetry. It's a CNCF project that includes APIs, SDKs, a collector service, and a wire protocol called **OTLP**. "OpenTelemetry" is the whole thing; "OTLP" is specifically the format data travels in.

The gist: everyone agreed on a standard shape for telemetry data, so your backend (often called a **sink**, **exporter**, or sometimes a **drain**) becomes swappable. Change a few lines of config, send your data somewhere else.

I haven't read deeply into OTel. The deep stuff is more DevOps and SRE territory. As a software engineer, you mostly need to know how to log and what to log, and trust that OTel-compatible libraries and your platform team handle the transport.

## What to actually do as a software engineer

For JavaScript, there's a library called [evlog](https://www.evlog.dev/) that does a lot of this well: structured logs, wide events, sampling, OTel-compatible drains, all with one `npm install`. .NET has `Microsoft.Extensions.Logging` built in. Most other languages have an equivalent (pino, winston, zap, logrus, zerolog, etc.).

But the one thing no library and no AI can do for you: decide **what** to log and monitor. That's on you.

Two frameworks help as starting points:

- **RED**: for request-driven services (most web apps), track **R**ate, **E**rrors, and **D**uration of requests.
- **USE**: for resources (databases, queues, workers), track **U**tilization, **S**aturation, and **E**rrors.

They're not the whole answer but they beat staring at a blank dashboard. Some other things most apps want to know:

- how many requests are coming in
- how long each request takes (p50, p95, p99, averages lie)
- which requests fail and why
- how long database queries take
- business stuff specific to your app: checkout conversion, jobs processed per minute, emails sent, whatever you actually care about

### Alerting

Logging and monitoring are how you *see* things going wrong. Alerting is how you get *told*, at 3am. You wire up a rule like "page me if error rate > 2% for 5 minutes" in something like PagerDuty, Opsgenie, or Grafana Alerting. Alerting is its own skill (bad alerts → alert fatigue → ignored pages → outages nobody notices), but the basic loop is: metric crosses a threshold, alert fires, someone gets paged.

## Wrapping up

All these tools (Grafana, Sentry, OpenTelemetry, evlog, Datadog, and the rest) together are called the observability stack. It's a whole world. I've barely scratched the surface.

If I had to boil it down:

- Three pillars: metrics, logs, traces.
- Attach a correlation ID to every request and propagate it everywhere.
- Use structured logs (JSON, key-value). Prefer one wide event per request over 15 scattered prints.
- Sample: keep the errors and the weird stuff, drop the boring successes.
- Start with RED and USE, then add what's specific to your app.
- OpenTelemetry is the standard that makes your backend swappable.

That's what I've got so far.

### Sources

- [Logging Sucks](https://loggingsucks.com/) by Boris Tane, the wide events / canonical log lines piece
- [evlog](https://www.evlog.dev/) the JS library
- [YouTube — observability episode](https://www.youtube.com/watch?v=5PEuwgLOQQM&list=PLui3EUkuMTPgZcV0QhQrOcwMPcBCcd_Q1&index=18)
- [YouTube — live session](https://www.youtube.com/live/VetYFD0MlGI?si=RMkVLznVWmc1CC8l)
- [YouTube — playlist](https://www.youtube.com/playlist?list=PLTRDUPO2OmImfWPK4cSusvHoEV6KWeXNm)
