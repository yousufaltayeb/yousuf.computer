+++
title = "Miyari"
type = "project"
description = "An Arabic-first assessment platform that connects exams to curriculum standards, performance reporting, and remedial plans."
symbol = "Mi"
year = 2026
featured = true
[taxonomies]
tags = ["NestJS", "Next.js", "GraphQL", "PostgreSQL"]
+++

Miyari (معياري, "standards-based") is an early-stage SaaS platform for Saudi schools. I started building it around a simple problem: exam scores show how a student performed, but rarely explain which specific skills need attention. In Miyari, every question is linked to a curriculum indicator, so results can be traced through the subject, unit, learning outcome, class, grade, school, and teacher.

The product covers the full assessment cycle. Teachers build online or paper exams from shared and private question banks, grade responses, and inspect performance from a school-wide overview down to a student's actual answers. Weak indicators can become structured remedial plans with enrolled students, targets, follow-up phases, and measured outcomes. Separate interfaces serve platform administrators, school staff, and students, with Arabic-first RTL layouts and full English support.

I built the backend as a NestJS GraphQL API over PostgreSQL and Prisma, with separate API lanes for administrators, organizations, and students. The system combines tenant and school isolation, role-scoped permissions, immutable exam snapshots, historical reporting, and Redis-backed background jobs. Paper exams connect to a self-hosted computer-vision service that reads scanned answer sheets and returns structured, per-question results for review and grading.
