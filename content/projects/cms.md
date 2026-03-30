+++
title = "CMS"
type = "project"
description = "A construction document management system for Saudi projects — digital workflows for RFIs, NCRs, approvals, and SLA tracking."
symbol = "▤"
year = 2026
featured = true
[taxonomies]
tags = ["Next.js", "PostgreSQL", "Prisma", "TypeScript"]
[extra]
github = "https://github.com/yousufaltayeb/cms"
+++

Saudi construction projects still run on paper — RFIs, NCRs, material approvals, and shop drawings get passed around as physical documents, tracked in spreadsheets, and lost in email chains. Deadlines slip because no one knows where a document is in the approval chain. This system replaces that entire workflow with a digital platform purpose-built for Saudi construction.

Each document type follows its own multi-step workflow with role-based routing — engineers submit, reviewers approve or reject with comments, and project managers get dashboard visibility into everything. SLA timers enforce response deadlines automatically, escalating overdue items so nothing sits in someone's inbox for weeks. The system supports both Arabic and English throughout, including RTL layout and bilingual PDF/Excel exports.

Built with Next.js and PostgreSQL via Prisma. Auth and role management handle the typical project hierarchy (contractor, consultant, owner) with per-project permissions. Document exports generate formatted PDFs and Excel reports that match the templates Saudi firms are used to seeing.
