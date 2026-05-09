---
stepsCompleted: ["step-01-validate-prerequisites", "step-02-design-epics", "step-03-create-stories"]
inputDocuments: ["prd.md", "architecture.md", "ux-design-specification.md", "ux-design-directions.html", "product-brief-NegoContract.md"]
---

# NegoContract - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for NegoContract, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: User can authenticate into their Tenant workspace via email/password or Enterprise SSO.
FR2: System Administrator can register a new tenant (organization) within the platform.
FR3: System Administrator can invite users and assign them specific roles (Admin, Lawyer, Sales Rep).
FR4: Admin or Lawyer can assign specific negotiation visibility rights to a Sales Rep.
FR5: Sales Rep can view a read-only dashboard of negotiation status metrics without accessing document content.
FR6: Admin can bulk-import or ingest existing playbook rules from standard document formats (e.g., CSV, Word) into their Tenant workspace.
FR7: Admin can manually create and store private playbook rules specific to their tenant.
FR8: Admin can define a hierarchy of fallback positions for specific contract clauses.
FR9: Admin can configure the "Concession Strategy" (e.g., incremental vs. immediate bottom-line) dictating how and when the AI deploys their playbook fallbacks.
FR10: Admin can mark specific playbook rules as strictly "non-negotiable."
FR11: The system must structurally prevent any user from viewing the playbook rules of an opposing tenant.
FR12: Lawyer can initiate a new negotiation session with an opposing firm.
FR13: Lawyer can upload a contract document (e.g., `.docx`) to begin a negotiation.
FR14: The system can automatically parse an uploaded `.docx` file into discrete, addressable clauses to enable targeted redlining and AI Conciliation.
FR15: Lawyer can invite opposing counsel to join an active negotiation session.
FR16: The system can track document versions across multiple rounds of negotiation.
FR17: Both Lawyers must execute a mutual "Sign-Off" action to freeze the document state before the final `.docx` export and data purge sequence is unlocked.
FR18: The system can export the final agreed-upon contract in `.docx` format with full fidelity.
FR19: Lawyer can view the contract document natively within the browser.
FR20: Lawyer can edit the document text using native track-changes functionality.
FR21: Lawyer can add, reply to, and resolve comments on specific document clauses.
FR22: The system can trigger in-app notifications to users when their action is required (e.g., pending Conciliation request, new comment, turn change).
FR23: The system must lock a specific document clause from manual user edits while an AI Conciliation request is pending or processing.
FR24: The system must support concurrent editing and presence indicators for multiple users within the same Tenant.
FR25: Lawyer can request AI Conciliation on a specific, disputed clause.
FR26: Opposing Lawyer can approve or reject a request for AI Conciliation.
FR27: Lawyer can withdraw or cancel a pending AI Conciliation request if the opposing party is unresponsive.
FR28: The system can analyze both parties' private playbooks simultaneously ONLY when Conciliation is mutually approved.
FR29: The AI Conciliator can propose a compromise clause that satisfies the fallback rules of both parties.
FR30: The AI Conciliator can declare a formal "Impasse" if no mutually acceptable fallback exists within the strict constraints of both playbooks.
FR31: Admin or Lead Lawyer can manually override a tenant playbook constraint for a specific negotiation to break a formal Impasse.
FR32: Either Lawyer can independently accept or reject the Conciliator's proposed compromise.
FR33: Lawyer can request a revised proposal from the AI Conciliator if the initial compromise is rejected by either party.
FR34: Lawyer can partially accept, manually modify, or fully reject an AI-generated suggestion before committing it to the document.
FR35: Lawyer can invoke their Personal Copilot to review an incoming third-party document.
FR36: The Personal Copilot can identify and highlight clauses that violate the tenant's playbook.
FR37: The Personal Copilot can generate suggested redlines based on the tenant's fallback rules.
FR38: Lawyer can approve a Copilot suggestion to apply it to the document as a standard redline.
FR39: The system must hide all Personal Copilot activities, prompts, and drafts from the opposing counsel.
FR40: The system can generate an unalterable metadata audit log of clause approvals.
FR41: The system can verify the successful export of a finalized document by the user.
FR42: The system must permanently purge all proprietary document text and PII after a negotiation is finalized and exported.
FR43: The system can decouple and retain anonymized metadata (e.g., rule success rates) independently of the purged contract text.
FR44: Admin can trigger an immediate, manual purge override of all data related to a specific negotiation.

### NonFunctional Requirements

NFR-SEC1 (Data Incineration): All proprietary contract text and PII must be permanently and irretrievably purged from the database within 5 minutes of a verified final .docx export.
NFR-SEC2 (Encryption): All data must be encrypted at rest (AES-256) and in transit (TLS 1.3) to meet law firm vendor compliance standards.
NFR-SEC3 (Isolation Assurance): Any backend query attempting a cross-tenant read outside of a formally linked "Negotiation" entity must immediately fail, be logged as a critical security event, and alert system administrators.
NFR-PER1 (Native Editing Speed): Manual document typing, scrolling, and redlining in the integrated Document Viewer must maintain 60fps with zero perceptible input lag (<50ms).
NFR-PER2 (Conciliator Speed): The AI Conciliator must analyze both playbooks and return a proposed compromise clause within 15 seconds of the dual-consent trigger to maintain negotiation momentum.
NFR-PER3 (Copilot Speed): The Personal AI Copilot must complete its initial scan and highlight playbook violations for an uploaded 50-page document within 30 seconds.
NFR-INT1 (Demo Resilience): The LLM API integration must support an automatic fallback provider (e.g., instantly switching from Anthropic to OpenAI) if the primary API times out after 5 seconds, ensuring the live Hackathon demo never visibly fails.
NFR-INT2 (Sync Latency): The document state must synchronize between the Next.js backend and the WOPI Document Server with less than 500ms latency to prevent redline race conditions when multiple users are editing.

### Additional Requirements

- **Starter Template Required:** Standard Next.js + shadcn/ui (Hackathon Mode). Initialization Command: `npx create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"` followed by `npx shadcn@latest init` and `npx playwright install`. THIS IMPACTS EPIC 1 STORY 1.
- Database Choice: SQLite (via Prisma ORM) to guarantee zero latency during the live demo.
- Authentication: Hardcoded "Mock Auth" Context to avoid OAuth overhead.
- API Design: Next.js Server Actions with standard wrapper `{ success, data, error }`.
- AI Integration: Vercel AI SDK (v6.0.177).
- State Management: Zustand (v5.0.13) for fast, lightweight global state synchronization.
- End-to-End Testing: Playwright e2e tests (`app/tests/e2e/happy-path.spec.ts`) are a strict requirement to mathematically verify the demo flow.

### UX Design Requirements

UX-DR1: Create a synchronized strict Dual-Pane Layout, splitting screen between the raw document (left) and the Kanban clause panel (right).
UX-DR2: Implement a SynchronizedDocumentViewer that scrolls automatically to the corresponding paragraph when a clause card is clicked in the Kanban view.
UX-DR3: Build a ClauseCard component for the Kanban panel with states: Default, Hover (highlights raw document text), Active, Dragging.
UX-DR4: Build a ConciliatorProposal component displaying AI compromise text, diff view, rationale block, and dual-action footer ("Accept" / "Reject & Provide Reason").
UX-DR5: Use Semantic Color Coding: Slate/Zinc for base, Client AI/Action (Blue), Vendor AI/Action (Green), AI Conciliator (Deep Purple/Indigo), Alerts/Warnings (Red).
UX-DR6: Use Serif typography (Merriweather/Times New Roman) for raw document view and Sans-Serif (Inter/Geist) for UI components.
UX-DR7: Implement the "Pending Mutual Consent" state with muted visual treatment and a "Waiting" icon on clause cards awaiting opponent action.
UX-DR8: Incorporate smooth micro-animations and a pulsing "skeleton" on specific Clause Cards and paragraphs during active AI Conciliation instead of full-screen spinners.
UX-DR9: Implement optimistic UI with auto-save on blur for the Playbook Ingestion review flow.
UX-DR10: Ensure strict keyboard accessibility (Tab, Enter) for dual-pane navigation.
UX-DR11: Build a SalesPipelineDashboard with Kanban-style visualization of active deals and their clause states.
UX-DR12: Create a PlaybookExtractionReview interface allowing users to edit/approve rules extracted from uploaded playbooks.

### FR Coverage Map

- **FR1, FR2, FR3, FR4, FR5, FR11, FR40** ➔ Epic 1 (Workspace & Identity)
- **FR12, FR13, FR14, FR15, FR16, FR17, FR18, FR19, FR20, FR21, FR24** ➔ Epic 2 (Core Negotiation Engine)
- **FR6, FR7, FR8, FR9, FR10, FR35, FR36, FR37, FR38, FR39** ➔ Epic 3 (Playbook & Private Copilot)
- **FR22, FR23, FR25, FR26, FR27, FR28, FR29, FR30, FR31, FR32, FR33, FR34** ➔ Epic 4 (AI Conciliator)
- **FR41, FR42, FR43, FR44** ➔ Epic 5 (Visibility & Compliance)

## Epic List

## Epic 1: Workspace & Identity Management

**Goal:** Users (Admins, Lawyers, Sales) can securely log in, set up their firm's tenant workspace, and invite their team with appropriate role-based access.

### Story 1.1: Project Initialization & Mock Authentication Core

As a System Administrator,
I want to initialize the application infrastructure and mock authentication context,
So that users can seamlessly switch between simulated identities (Vendor vs. Client) during the live demo without OAuth friction.

**Acceptance Criteria:**

**Given** the Next.js 15 application is running,
**When** I access the application,
**Then** I am presented with a Mock Login selector to choose a Tenant and User Profile.
**And** the global Zustand auth store accurately tracks my `tenantId` and `role`.

### Story 1.2: Tenant & User Data Schema

As a System Administrator,
I want the database schema to support organizations, users, roles, and audit logs,
So that I can register my firm and invite team members.

**Acceptance Criteria:**

**Given** the Prisma SQLite database,
**When** the migration runs,
**Then** `Tenant`, `User`, and `AuditLog` tables are created.
**And** the system supports Admin, Lawyer, and Sales Rep roles.
**And** mock data scripts can successfully seed two opposing firms for the demo.

### Story 1.3: Tenant Isolation & RBAC Enforcement

As a Developer,
I want strict data isolation middleware and role-based access controls,
So that no user can ever access the playbooks or documents of an opposing tenant, and Sales Reps are restricted to read-only views.

**Acceptance Criteria:**

**Given** an active Mock Auth session,
**When** a Server Action is executed to read a resource (like a playbook),
**Then** the action must validate that the resource's `tenantId` matches the session's `tenantId`, throwing a hard error if it fails.
**And** Sales Rep roles must be rejected if they attempt to execute mutation actions.

## Epic 2: Core Document Negotiation Engine

**Goal:** Opposing lawyers can upload a .docx, parse it into clauses, invite the other side, and collaboratively edit the document using traditional track-changes and comments before finally signing off and exporting it.

### Story 2.1: Contract Upload & Clause Parsing

As a Lawyer,
I want to upload a new contract (`.docx`) and have it automatically parsed,
So that I can initiate a negotiation session organized by individual clauses.

**Acceptance Criteria:**

**Given** an authenticated session,
**When** I upload a `.docx` file,
**Then** the document is saved and a new Negotiation session is created.
**And** the backend splits the document into discrete, addressable `Clause` entities stored in the database.

### Story 2.2: Dual-Pane UI Foundation

As a Lawyer,
I want to view the contract text and the clause structure side-by-side,
So that I can read the document chronologically while understanding its structural state.

**Acceptance Criteria:**

**Given** an active negotiation session,
**When** I load the workspace,
**Then** the screen strictly splits into a Raw Document Viewer (left) and Kanban Panel (right).
**And** clicking a clause in the Kanban panel smoothly scrolls the Document Viewer to the corresponding paragraph.

### Story 2.3: Kanban Clause Tracking

As a Lawyer,
I want to see each clause represented as an interactive card in the side panel,
So that I can quickly grasp what needs review, what is resolved, and what is dragging.

**Acceptance Criteria:**

**Given** the Dual-Pane view,
**When** I hover over a `ClauseCard` in the Kanban board,
**Then** the corresponding text in the Document Viewer is highlighted.
**And** I can drag a card between columns (e.g., "In Review" to "Resolved") to update its state in the database.

### Story 2.4: Native Redlining & Commenting

As a Lawyer,
I want to edit the document text using familiar track-changes and leave margin comments,
So that I can negotiate terms without having to leave the platform.

**Acceptance Criteria:**

**Given** the Document Viewer,
**When** I modify text inside a specific clause block,
**Then** the changes are displayed as standard redlines (strikethrough for deletion, underline for addition).
**And** I can attach, reply to, and resolve comments directly on the clause.

### Story 2.5: Concurrent Editing & Opponent Invites

As a Lawyer,
I want to invite the opposing counsel and see when they are actively editing,
So that we can negotiate safely without overwriting each other's work.

**Acceptance Criteria:**

**Given** an active negotiation,
**When** I generate an invite link and opposing counsel joins,
**Then** we can both see real-time presence indicators.
**And** the system prevents us from manually editing the exact same clause block simultaneously to avoid race conditions.

### Story 2.6: Versioning, Sign-Off, and Export

As a Lawyer,
I want to officially sign off on the agreed text and export it back to Word,
So that the document can be sent for final signature.

**Acceptance Criteria:**

**Given** all clauses are marked "Resolved,"
**When** both lawyers click "Execute Mutual Sign-Off,"
**Then** the document state is permanently frozen.
**And** either party can export a full-fidelity `.docx` file containing the clean, agreed-upon text.

### Story 2.7: ONLYOFFICE Infrastructure & API

As a Developer,
I want to set up the ONLYOFFICE Document Server infrastructure and a Next.js callback API,
So that we can render and persist actual `.docx` files.

**Acceptance Criteria:**
- ONLYOFFICE Document Server is reachable.
- Next.js API route `/api/onlyoffice/callback` successfully receives and logs save events.

### Story 2.8: Frontend ONLYOFFICE React Integration

As a Lawyer,
I want to view and edit the contract using a real ONLYOFFICE editor instead of a mock viewer,
So that I can use standard formatting and native track-changes.

**Acceptance Criteria:**
- `DocumentViewer.tsx` is replaced by `@onlyoffice/document-editor-react`.
- Document loads successfully in the workspace view.

### Story 2.9: Kanban to ONLYOFFICE API Sync

As a Lawyer,
I want the Kanban clause panel to remain synchronized with the ONLYOFFICE viewer,
So that clicking a card still scrolls the document to the correct location.

**Acceptance Criteria:**
- Clicks on Kanban cards trigger the ONLYOFFICE Connector API to navigate to document sections.

## Epic 3: Playbook Management & Private AI Copilot

**Goal:** Admins can ingest or manually create their firm's private rulebook (with fallbacks and non-negotiables). Lawyers can then invoke their "Private Copilot" to instantly scan an opponent's document, highlight violations, and draft compliant redlines—completely hidden from the other side.

### Story 3.1: Playbook Data Model & Manual Entry

As an Admin,
I want to manually define playbook rules, fallback hierarchies, and concession strategies,
So that the AI has a structured set of constraints to operate within.

**Acceptance Criteria:**

**Given** the Admin Dashboard,
**When** I create a new rule for a specific clause type (e.g., "Indemnification"),
**Then** I can define a primary position, multiple fallback positions, and mark the rule as "non-negotiable."
**And** I can set the concession strategy (e.g., immediate bottom-line vs. incremental).

### Story 3.2: Playbook Ingestion & Review Interface

As an Admin,
I want to bulk-import playbook rules by uploading an existing document and reviewing the AI-extracted rules,
So that I don't have to manually type hundreds of existing firm guidelines.

**Acceptance Criteria:**

**Given** the Playbook Extraction Review interface,
**When** the AI completes extracting rules from my uploaded document,
**Then** I can review the extracted rules side-by-side with the source text.
**And** any edits I make to the extracted rules are saved instantly using optimistic UI (auto-save on blur) without requiring a "Save" button.

### Story 3.3: Private AI Copilot - Scanning & Violation Detection

As a Lawyer,
I want to invoke my Private Copilot to review the opposing counsel's document against my firm's playbook,
So that I immediately know where we are misaligned before I start redlining.

**Acceptance Criteria:**

**Given** an uploaded third-party document,
**When** I click "Run Copilot Scan,"
**Then** the AI SDK analyzes the text and highlights specific clauses that violate my playbook within 30 seconds.
**And** the UI strictly hides all of these highlights and processing states from the opposing counsel.

### Story 3.4: Private AI Copilot - Redline Suggestions

As a Lawyer,
I want my Copilot to draft compliant redlines for the violated clauses,
So that I can counter-propose with one click instead of rewriting the text manually.

**Acceptance Criteria:**

**Given** a clause highlighted as a violation by the Copilot,
**When** I select it,
**Then** the Copilot displays a suggested redline based on my approved fallback hierarchy.
**And** if I click "Approve," the suggestion is applied to the raw document as a standard track-change.
**And** until I click "Approve," the opposing counsel cannot see the drafted text.

## Epic 4: The AI Conciliator (Dual-Sided Mediation)

**Goal:** When deadlocked on a clause, opposing lawyers can mutually agree to invoke the neutral AI Conciliator. The AI analyzes both private playbooks instantly and proposes a compromise (or declares an impasse), allowing users to accept or refine it without endless emails.

### Story 4.1: Requesting Conciliation & Mutual Consent

As a Lawyer,
I want to request AI Conciliation on a disputed clause and wait for opposing counsel to agree,
So that we both formally authorize the AI to view our private playbooks for mediation.

**Acceptance Criteria:**

**Given** an unresolved clause card,
**When** I click "Request AI Conciliation,"
**Then** the clause enters a muted "Waiting for Opponent" state in my Kanban panel.
**And** the opposing counsel receives an inline notification to either "Agree" or "Reject."
**And** I can cancel my request if they are unresponsive.

### Story 4.2: AI Conciliator Processing & UI Locking

As the System,
I want to lock the document text and show a processing state when mutual consent is achieved,
So that neither party can edit the text while the AI is analyzing the playbooks.

**Acceptance Criteria:**

**Given** opposing counsel has clicked "Agree,"
**When** the Conciliation workflow triggers,
**Then** the clause text in both users' Document Viewers becomes uneditable.
**And** the UI displays a pulsing purple skeleton rather than a full-screen spinner.
**And** the backend retrieves only the relevant playbook rules from both tenants for the LLM prompt.

### Story 4.3: Conciliator Proposal Generation & Industry Standard Grounding

As the System,
I want to generate a compromise proposal that is grounded in industry-standard legal language,
So that the proposed middle ground is immediately recognizable, legally sound, and more likely to be accepted by both parties.

**Acceptance Criteria:**

**Given** the playbooks have been sent to the LLM via the Vercel AI SDK,
**When** the primary LLM (e.g., Anthropic) responds within 15 seconds,
**Then** it returns a structured proposal containing the Diff Text and a Rationale.
**And** the backend LLM prompt explicitly instructs the AI to synthesize the playbooks using "industry-standard contract language" (e.g., standard SaaS MSA market practice or Spellbook references).
**And** the Rationale block explicitly explains why the clause matches standard market practice, in addition to satisfying both playbooks.
**And** if the primary LLM times out after 5 seconds, the SDK automatically fails over to the secondary provider.

### Story 4.4: Impasse & Manual Overrides

As a Lawyer,
I want to be notified if no compromise is mathematically possible, and have the ability to override my own firm's rules,
So that I can save the deal even if the strict playbooks clash completely.

**Acceptance Criteria:**

**Given** the Conciliator cannot find a middle ground between the two playbooks,
**When** it returns an "Impasse" state,
**Then** both users are notified that their rules strictly conflict.
**And** a Lead Lawyer can click "Override Constraint" for that specific session to give the AI more flexibility and re-run the prompt.

### Story 4.5: Approving or Rejecting AI Compromises

As a Lawyer,
I want to review the Conciliator's proposal and decide whether to accept, modify, or reject it,
So that I maintain absolute control over the final contract text.

**Acceptance Criteria:**

**Given** a rendered Conciliator Proposal,
**When** I review the Diff text and Rationale,
**Then** I can independently click "Accept" or "Reject."
**And** if both parties "Accept," the new text is instantly applied to the raw document as a track-change.
**And** I can manually edit the AI's proposed text before accepting it (Partial Acceptance).

## Epic 5: Pipeline Visibility & Compliance

**Goal:** Sales Reps get an abstracted, Kanban-style dashboard showing exactly where deals are stuck without seeing legal text. Meanwhile, the system guarantees that once a deal is exported, the proprietary text is permanently incinerated.

### Story 5.1: Sales Pipeline Dashboard

As a Sales Rep,
I want to see an abstracted Kanban board of all my active deals,
So that I know exactly which clauses are holding up the negotiation without needing to read the legal text.

**Acceptance Criteria:**

**Given** I am logged in with a Sales Rep role,
**When** I access my dashboard,
**Then** I see a Kanban view of my active negotiations.
**And** the view summarizes progress (e.g., "7/10 Clauses Resolved") but structurally prevents me from opening the Document Viewer.

### Story 5.2: Automated Data Incineration & Metadata Decoupling

As the System,
I want to permanently delete contract text upon finalization while retaining anonymized metadata,
So that we comply with strict law firm security standards without losing our product analytics.

**Acceptance Criteria:**

**Given** a negotiation has been mutually signed off and exported,
**When** 5 minutes have passed,
**Then** a background worker executes a hard delete (`DELETE FROM`) on all `Clause` rows and raw text associated with the session.
**And** the system retains anonymized metrics (e.g., "Rule A had a 60% success rate") entirely decoupled from the original tenant data.

### Story 5.3: Manual Purge Override

As an Admin,
I want to trigger an immediate data purge for a specific session,
So that I can guarantee compliance if a client demands immediate destruction of records before the automatic timer.

**Acceptance Criteria:**

**Given** an active or finalized negotiation session,
**When** an Admin clicks "Force Purge,"
**Then** the system bypasses the 5-minute timer and executes the incineration sequence immediately.
**And** an Audit Log entry is created recording the manual purge action.
