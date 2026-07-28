+++
title = "mutamad.net"
type = "project"
description = "A bilingual construction management platform for document control, contract administration, reporting, and project closeout."
symbol = "▤"
year = 2026
featured = true
[taxonomies]
tags = ["TanStack Start", "Cloudflare Workers", "PostgreSQL", "Prisma"]
[extra]
demo = "https://mutamad.net"
+++

mutamad.net started with a problem I saw firsthand while working as a document controller on a Saudi construction project. WIRs, RFIs, NCRs, material approvals, drawings, and letters moved between paper files, spreadsheets, and email. Finding the latest version could take longer than reviewing it. I wanted to build the system I wished we had on site.

The difficult part wasn't storing documents. It was modeling how construction work actually moves: contractor to consultant to client, engineer to discipline lead to project manager, with revisions, evidence, response codes, and deadlines at every stage. Mutamad ships with 27 built-in construction document types and lets each project define custom types with their own fields, attachments, workflows, routing, and SLA rules. It also covers payment claims, programme delays, progress reporting, contract administration, and project closeout. Every action is auditable, every overdue stage is visible, and the entire product works in English and Arabic.

Most of the interesting engineering is invisible: strict tenant isolation, role-scoped access, immutable revision chains, SLA enforcement, reliable background processing, and PDF and Excel exports that match the project record. I built it with TanStack Start, PostgreSQL, Prisma, and Cloudflare's platform. It also includes Ask Mutamad, a citation-backed project copilot that answers questions against live project data through text or voice without being allowed to modify the underlying records.
