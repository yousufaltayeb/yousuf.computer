+++
title = "medseras.com"
type = "project"
description = "A bilingual educational community platform that brings courses, exams, live learning, and member communities into one product."
symbol = "M"
year = 2026
featured = true
[taxonomies]
tags = ["Next.js", "NestJS", "GraphQL", "PostgreSQL"]
[extra]
demo = "https://medseras.com"
+++

Medseras is a bilingual educational community platform built around the way professional learning actually happens: people join focused communities, follow courses, sit exams, attend live sessions, share resources, and learn from each other in one place.

The product spans three interfaces — a learner app, a workspace for community staff, and a platform administration dashboard. Community managers can publish courses, question banks, videos, documents, and live streams; configure membership plans and staff permissions; and follow learner progress. Members get community feeds, direct and group messaging, notifications, leaderboards, and a single place for their subscriptions and learning.

Built with Next.js and TypeScript on the frontend, backed by a NestJS GraphQL API and PostgreSQL via Prisma. The platform uses role- and community-scoped authorization, Stripe for subscriptions and payments, Redis-backed queues for background work, and real-time connections for chat and live notifications. English and Arabic are supported throughout, including full RTL layouts.
