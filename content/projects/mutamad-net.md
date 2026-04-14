+++
title = "mutamad.net"
type = "project"
description = "A construction document management platform for Saudi projects — digital workflows for RFIs, NCRs, approvals, and SLA tracking."
symbol = "▤"
year = 2026
featured = true
[taxonomies]
tags = ["TanStack Start", "PostgreSQL", "Prisma", "TypeScript"]
[extra]
demo = "https://mutamad.net"
+++

Saudi construction projects still run on paper — RFIs, NCRs, material approvals, and shop drawings passed around as physical documents, tracked in spreadsheets, lost in email chains. mutamad.net replaces that entire workflow with a construction document management platform built for the Saudi market.

Each document type has its own multi-step approval chain with role-based routing — engineers submit, reviewers approve or reject with comments, and project managers get live dashboard visibility across everything. SLA timers enforce response deadlines and auto-escalate overdue items so nothing sits in someone's inbox for weeks. Arabic and English throughout: RTL layout, bilingual PDF and Excel exports, and document templates that match the formats Saudi firms already use.

Built with TanStack Start and PostgreSQL via Prisma. Auth handles the standard project hierarchy — contractor, consultant, owner — with per-project role assignments.
