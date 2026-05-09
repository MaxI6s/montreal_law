---
stepsCompleted: [1, 2, 3]
inputDocuments: [
  "/Users/Maxime/dev_ws/montreal_law/_bmad-output/planning-artifacts/prd.md",
  "/Users/Maxime/dev_ws/montreal_law/_bmad-output/planning-artifacts/prfaq-montreal_law.md",
  "/Users/Maxime/dev_ws/montreal_law/_bmad-output/planning-artifacts/product-brief-montreal_law.md",
  "/Users/Maxime/dev_ws/montreal_law/_bmad-output/planning-artifacts/ux-design-specification.md"
]
workflowType: 'architecture'
project_name: 'montreal_law'
user_name: 'Maxime'
date: '2026-05-09'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
- **Identity & Access**: Multi-tenant RBAC distinguishing Admins, Lawyers, and Sales Reps.
- **Document Collaboration**: Real-time native redlining, concurrent editing, state locking during AI processes, and document versioning.
- **AI Orchestration**: A multi-agent ecosystem featuring dual-sided Private Copilots (single-sided review) and an AI Conciliator (dual-sided mediation).
- **Playbook Engine**: Complex rule hierarchies, strict fallbacks, and non-negotiables mapping.
- **Security & Compliance**: Audit logging, manual purge overrides, and decoupled anonymized metadata.

**Non-Functional Requirements:**
- **Performance**: <500ms sync latency, 60fps native UI editing, AI Conciliator resolutions within 15 seconds.
- **Security**: Strict Data Incineration (5 mins post-export), AES-256 encryption, Zero-Leakage tenant isolation.
- **Resilience**: Instant LLM API failover for bulletproof live demonstrations.

**Scale & Complexity:**
The project represents a highly complex, mission-critical workflow with strict legal bounds.

- Primary domain: Full-Stack Web / B2B SaaS
- Complexity level: High
- Estimated architectural components: Auth/RBAC, Document Sync Engine, Multi-Agent AI Orchestrator, Ephemeral Data Manager, Playbook Rule Engine.

### Technical Constraints & Dependencies

- **Tech Stack**: Next.js 15 App Router, PostgreSQL, Prisma, Auth.js.
- **Live Demo Needs**: Requires a "Demo Viewer" for abstracting complex `.docx` logic and a dual-laptop compatible sync experience.
- **AI Integration**: Needs Zero-Data Retention agreements with LLM providers and failover orchestration.

### Cross-Cutting Concerns Identified

- **Real-Time State Synchronization**: Maintaining identical document states across multiple active clients.
- **Multi-Tenant Isolation**: Ensuring data boundaries are never crossed, especially concerning private playbooks and in-progress drafts.
- **Ephemeral Data Lifecycle**: Managing the automatic and secure deletion of proprietary data while retaining analytical metadata.
- **AI Orchestration**: Managing parallel AI processing, locking UI states, and aggregating multiple agent outputs.

## Starter Template Evaluation

### Primary Technology Domain

**Hackathon-Optimized React/Next.js Web Application**

### Starter Options Considered

Given the strict requirement for Next.js 15 and the critical need for speed and demo reliability, we considered enterprise boilerplates (like T3) versus a lean, standard Next.js foundation. We chose the lean approach to avoid over-engineering and to maintain absolute control over the demo flow.

### Selected Starter: Standard Next.js + shadcn/ui (Hackathon Mode)

**Rationale for Selection:**
For a hackathon, the focus must be entirely on the AI Conciliator feature. We will use the standard `create-next-app` but intentionally degrade certain enterprise requirements (like PostgreSQL) to lightweight, demo-safe alternatives (like SQLite) to maximize speed and reliability.

**Initialization Command:**

```bash
npx create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
# Followed immediately by UI setup:
npx shadcn@latest init
```

**Architectural Decisions Provided by Starter (Hackathon Variant):**

**Language & Runtime:**
Next.js 15 App Router with TypeScript for type safety on the critical AI payloads.

**Styling Solution:**
Tailwind CSS + `shadcn/ui` for instant, premium, accessible UI components (buttons, modals, cards) without writing custom CSS.

**Data Access (Demo Optimized):**
Prisma ORM, but backed by a local **SQLite** database instead of PostgreSQL. This guarantees zero configuration, zero network latency for DB calls, and works perfectly offline during a live demo.

**Authentication (Demo Optimized):**
Skip complex Auth.js OAuth. Use a simple, hardcoded "Mock Auth" context (e.g., selecting a "Vendor" or "Client" profile on load) to eliminate friction and risk during the presentation.

**Code Organization:**
Standard `src/` directory, keeping the demo logic highly centralized and easy to navigate under pressure.
