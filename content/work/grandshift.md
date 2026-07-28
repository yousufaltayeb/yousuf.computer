+++
title = "Grandshift"
type = "job"
role = "Software Engineer"
period = "2026"
location = "Riyadh, Saudi Arabia"
description = "Built payment, notification, and POS integrations across Grandshift's cashback and loyalty platform."
symbol = "gs"
[taxonomies]
tags = ["NestJS", "Next.js", "Payments", "Integrations"]
+++

A short, high-output stint at Grandshift, a Saudi cashback and loyalty platform connecting shoppers with local merchants. I worked across the NestJS backend and the vendor, shifter, and staff applications, focusing primarily on payments, notifications, and POS integrations.

I built the Foodics integration end to end: OAuth onboarding, merchant and branch mapping, order webhooks, queued processing, cashback distribution, returns, refunds, and the accompanying vendor and staff dashboards. I hardened the integration against duplicate and out-of-order webhooks, OAuth replay, forged requests, stale mappings, and partial-return edge cases, with end-to-end coverage for the critical flows.

I also migrated vendor wallet recharges to Moyasar's Form API, added billing-address and tax-document workflows, strengthened payment verification and recovery, and simplified the notification pipeline around BullMQ and OneSignal. Across the frontend applications, I improved production Docker builds, dependency security, and push-notification reliability.
