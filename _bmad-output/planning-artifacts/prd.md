---
stepsCompleted: ["step-01-init", "step-02-discovery", "step-02b-vision", "step-02c-executive-summary", "step-03-success", "step-04-journeys", "step-05-domain", "step-06-innovation", "step-07-project-type", "step-08-scoping", "step-09-functional", "step-10-nonfunctional", "step-11-polish"]
inputDocuments: ["product-brief-montreal_law.md", "project_base.md", "chalenge.md"]
documentCounts:
  briefCount: 1
  researchCount: 0
  brainstormingCount: 0
  projectDocsCount: 2
classification:
  projectType: "saas_b2b"
  domain: "legaltech"
  complexity: "high"
  projectContext: "greenfield"
workflowType: 'prd'
---

# Product Requirements Document - NegoContract

**Author:** Maxime
**Date:** 2026-05-09

## Executive Summary

Contract negotiation today is an inefficient, fragmented exchange of redlines over email that stalls deals and frustrates both legal and business stakeholders. NegoContract is a centralized, dual-sided B2B SaaS platform that transforms this process by bringing both vendor and client lawyers into a shared collaborative workspace. The platform eliminates email back-and-forth by allowing users to negotiate natively on the same document with full `.docx` fidelity and strict cross-tenant security boundaries. Ultimately, NegoContract aims to evolve from a transactional tool into an intelligent Deal Desk ecosystem that advises organizations on optimizing their playbooks to accelerate sales cycles.

### What Makes This Special

While existing tools typically assist only one side of a negotiation against their private playbook, NegoContract is an active two-sided mediator. Its primary differentiator is the **AI Conciliator**. When the independent playbooks of the vendor and client conflict, the AI Conciliator acts as an impartial assistant—understanding the bounded flexibility, non-negotiables, and fallbacks of both parties. Utilizing the Spellbook ecosystem for industry-standard references, it automatically proposes optimal, pre-approved middle-ground clauses. Crucially, to minimize adoption friction for opposing counsel, the UI mirrors the familiar experience of traditional Word redlining, presenting AI mediation as seamless, non-intrusive suggestions rather than an aggressive automated override.

## Project Classification

- **Project Type:** SaaS B2B (multi-tenant, role-based access, document collaboration)
- **Domain:** LegalTech (contract negotiation, playbooks, redlines)
- **Complexity:** High (requires handling complex document states, AI mediation, and strict organizational boundaries)
- **Project Context:** Greenfield (new hackathon build)

## Success Criteria

### User Success
- **The "Aha!" Moment:** Users (lawyers) experience an immediate sense of relief and efficiency when the AI Conciliator instantly resolves a complex, multi-round clause dispute.
- **Intuitive Understanding:** Users can clearly and visually distinguish between the actions of their own AI, the opposing AI, and the Conciliator, making the automated resolution feel trustworthy and transparent.
- **Frictionless Adoption:** Opposing counsel can interact with the platform seamlessly without a steep learning curve, mirroring the traditional Word redlining experience they already trust.

### Business Success (Hackathon Focus)
- **Challenge Victory:** Deliver a compelling, flawless live interaction demo (utilizing two laptops side-by-side) that visually showcases the Conciliator bridging the gap between conflicting playbooks for the judges.
- **Concept Validation:** Successfully demonstrate that active, two-sided AI mediation is a viable, high-value solution to the Spellbook challenge of "Closing the Deal".

### Technical Success
- **Phase 1 Execution:** Deliver a clean, robust Next.js 15 / Prisma architecture with strict multi-tenant data isolation and role-based access control.
- **Quality Gates:** Successfully pass critical unit tests (auth, upload) and a **complete happy-path end-to-end Playwright test that simulates the Vendor and Client interacting with the Conciliator flow** to de-risk the live demo.
- **Extensibility:** Ensure the data model and architecture fully anticipate and support future phases (document viewer, playbook engine, and conciliator) even though only foundational CRUD is implemented in Phase 1 backend.

## Product Scope

### MVP - Minimum Viable Product (Phase 1 & Demo Scope)
- **Infrastructure:** Next.js 15 App Router, PostgreSQL, Auth.js multi-tenant setup.
- **Foundational Features:** Organization & User management, Negotiation CRUD, and Document upload/versioning.
- **Demo Capabilities:** The Playbook Engine (rules, non-negotiables, fallbacks), the Conciliator UI, and a **"Demo Viewer" component** (a simplified, hardcoded HTML representation of the challenge contract) to visually demonstrate the Conciliator highlighting conflicts and proposing middle grounds without requiring a full `.docx` parsing engine.
- **Explicitly Out of Scope:** High-fidelity Word/PDF parsing engine, complex e-signature integrations, external email notification loops (in-app only), and advanced analytics dashboards.

### Growth Features (Post-MVP)
- Integration of a high-fidelity Word/PDF viewer (e.g., OnlyOffice or Collabora) with native track-changes support in the browser.
- Fully automated external email notification loops bridging the platform directly to lawyers' inboxes.

### Vision (Future)
- **Intelligent Deal Desk Ecosystem:** The platform analyzes thousands of resolved conflicts to proactively advise organizations on how to optimize their playbooks, showing them exactly which clauses are slowing down their sales cycles with data-backed alternatives.

## User Journeys

### Journey 1: The Collaborative Negotiation (Vendor & Client Lawyer)
**Persona:** Sarah (Vendor Lawyer) and Marcus (Client Lawyer).
**Opening Scene:** Sarah uploads a SaaS MSA into NegoContract. It operates perfectly as a standalone negotiation platform. Marcus receives the link, reviews the document, and uses the native redlining and commenting tools to make changes. 
**Rising Action:** They go back and forth seamlessly. However, they reach a hard impasse on the "Limitation of Liability" clause. 
**Climax:** Rather than sending a fourth email arguing the point, Sarah clicks **"Request AI Conciliation"** for this specific clause. Marcus receives a prompt and clicks "Agree." Only then does the AI Conciliator step in, analyzing both playbooks simultaneously to propose a pre-approved middle ground.
**Resolution:** They both accept the Conciliator's suggestion. The platform facilitated the standard negotiation, but the AI saved the deal when it stalled.

### Journey 2: The Personal Playbook Copilot (Single-Sided Review)
**Persona:** Marcus (Client Lawyer).
**Opening Scene:** Marcus receives a complex, heavily-modified NDA from a vendor. Before he even starts manually redlining, he wants to know where it stands against his firm's rules.
**Rising Action:** Within NegoContract, he activates his **Personal AI Copilot**. He asks it to review the incoming document strictly against his private Client Playbook. 
**Climax:** The Copilot privately highlights three clauses that violate his "non-negotiables" and instantly drafts suggested redlines that align with his fallbacks. The vendor cannot see any of this happening.
**Resolution:** Marcus reviews the AI's suggestions, approves them with one click, and sends the counter-proposal back to the vendor. He utilized AI to supercharge his own review without ever invoking the shared Conciliator.

### Journey 3: The Deal Desk Observer (Sales Rep)
**Persona:** David (Sales Rep).
**Opening Scene:** David's commission depends on the MSA being signed today. Normally, he would email Sarah (Legal) repeatedly to ask for status updates.
**Rising Action:** Instead, David logs into his NegoContract Sales Dashboard. 
**Climax:** He sees a read-only Kanban board showing exactly where the contract is in the negotiation flow, noting that 14 out of 15 clauses are resolved natively, with the final clause currently in "Active AI Conciliation."
**Resolution:** David stays out of legal's way but remains in total control of his pipeline visibility.

### Journey 4: The Playbook Architect (Admin)
**Persona:** Elena (Managing Partner / Admin).
**Opening Scene:** Elena wants to speed up the firm's average deal cycle.
**Rising Action:** She logs into NegoContract's Admin panel to update the firm's playbooks. 
**Climax:** She uses the Playbook Editor to add a new "Fallback Level 2" for Indemnification, giving her junior lawyers and the AI Conciliator more bounded flexibility to reach agreements.
**Resolution:** Instantly, the new rule is deployed to all ongoing negotiations, optimizing the firm's negotiation velocity.

## Functional Requirements

### Identity & Access
- **FR1:** User can authenticate into their Tenant workspace via email/password or Enterprise SSO.
- **FR2:** System Administrator can register a new tenant (organization) within the platform.
- **FR3:** System Administrator can invite users and assign them specific roles (Admin, Lawyer, Sales Rep).
- **FR4:** Admin or Lawyer can assign specific negotiation visibility rights to a Sales Rep.
- **FR5:** Sales Rep can view a read-only dashboard of negotiation status metrics without accessing document content.

### Playbook Engine
- **FR6:** Admin can bulk-import or ingest existing playbook rules from standard document formats (e.g., CSV, Word) into their Tenant workspace.
- **FR7:** Admin can manually create and store private playbook rules specific to their tenant.
- **FR8:** Admin can define a hierarchy of fallback positions for specific contract clauses.
- **FR9:** Admin can configure the "Concession Strategy" (e.g., incremental vs. immediate bottom-line) dictating how and when the AI deploys their playbook fallbacks.
- **FR10:** Admin can mark specific playbook rules as strictly "non-negotiable."
- **FR11:** The system must structurally prevent any user from viewing the playbook rules of an opposing tenant.

### Document & Negotiation Management
- **FR12:** Lawyer can initiate a new negotiation session with an opposing firm.
- **FR13:** Lawyer can upload a contract document (e.g., `.docx`) to begin a negotiation.
- **FR14:** The system can automatically parse an uploaded `.docx` file into discrete, addressable clauses to enable targeted redlining and AI Conciliation.
- **FR15:** Lawyer can invite opposing counsel to join an active negotiation session.
- **FR16:** The system can track document versions across multiple rounds of negotiation.
- **FR17:** Both Lawyers must execute a mutual "Sign-Off" action to freeze the document state before the final `.docx` export and data purge sequence is unlocked.
- **FR18:** The system can export the final agreed-upon contract in `.docx` format with full fidelity.

### Native Redlining & Collaboration
- **FR19:** Lawyer can view the contract document natively within the browser.
- **FR20:** Lawyer can edit the document text using native track-changes functionality.
- **FR21:** Lawyer can add, reply to, and resolve comments on specific document clauses.
- **FR22:** The system can trigger in-app notifications to users when their action is required (e.g., pending Conciliation request, new comment, turn change).
- **FR23:** The system must lock a specific document clause from manual user edits while an AI Conciliation request is pending or processing.
- **FR24:** The system must support concurrent editing and presence indicators for multiple users within the same Tenant.

### AI Conciliator (Dual-Sided Mediation)
- **FR25:** Lawyer can request AI Conciliation on a specific, disputed clause.
- **FR26:** Opposing Lawyer can approve or reject a request for AI Conciliation.
- **FR27:** Lawyer can withdraw or cancel a pending AI Conciliation request if the opposing party is unresponsive.
- **FR28:** The system can analyze both parties' private playbooks simultaneously ONLY when Conciliation is mutually approved.
- **FR29:** The AI Conciliator can propose a compromise clause that satisfies the fallback rules of both parties.
- **FR30:** The AI Conciliator can declare a formal "Impasse" if no mutually acceptable fallback exists within the strict constraints of both playbooks.
- **FR31:** Admin or Lead Lawyer can manually override a tenant playbook constraint for a specific negotiation to break a formal Impasse.
- **FR32:** Either Lawyer can independently accept or reject the Conciliator's proposed compromise.
- **FR33:** Lawyer can request a revised proposal from the AI Conciliator if the initial compromise is rejected by either party.
- **FR34:** Lawyer can partially accept, manually modify, or fully reject an AI-generated suggestion before committing it to the document.

### Personal AI Copilot (Single-Sided Review)
- **FR35:** Lawyer can invoke their Personal Copilot to review an incoming third-party document.
- **FR36:** The Personal Copilot can identify and highlight clauses that violate the tenant's playbook.
- **FR37:** The Personal Copilot can generate suggested redlines based on the tenant's fallback rules.
- **FR38:** Lawyer can approve a Copilot suggestion to apply it to the document as a standard redline.
- **FR39:** The system must hide all Personal Copilot activities, prompts, and drafts from the opposing counsel.

### Security & Compliance
- **FR40:** The system can generate an unalterable metadata audit log of clause approvals.
- **FR41:** The system can verify the successful export of a finalized document by the user.
- **FR42:** The system must permanently purge all proprietary document text and PII after a negotiation is finalized and exported.
- **FR43:** The system can decouple and retain anonymized metadata (e.g., rule success rates) independently of the purged contract text.
- **FR44:** Admin can trigger an immediate, manual purge override of all data related to a specific negotiation.

## Non-Functional Requirements

### Security & Compliance
- **NFR-SEC1 (Data Incineration):** All proprietary contract text and PII must be permanently and irretrievably purged from the database within 5 minutes of a verified final `.docx` export.
- **NFR-SEC2 (Encryption):** All data must be encrypted at rest (AES-256) and in transit (TLS 1.3) to meet law firm vendor compliance standards.
- **NFR-SEC3 (Isolation Assurance):** Any backend query attempting a cross-tenant read outside of a formally linked "Negotiation" entity must immediately fail, be logged as a critical security event, and alert system administrators.

### Performance
- **NFR-PER1 (Native Editing Speed):** Manual document typing, scrolling, and redlining in the integrated Document Viewer must maintain 60fps with zero perceptible input lag (<50ms).
- **NFR-PER2 (Conciliator Speed):** The AI Conciliator must analyze both playbooks and return a proposed compromise clause within **15 seconds** of the dual-consent trigger to maintain negotiation momentum.
- **NFR-PER3 (Copilot Speed):** The Personal AI Copilot must complete its initial scan and highlight playbook violations for an uploaded 50-page document within **30 seconds**.

### Integration & Reliability
- **NFR-INT1 (Demo Resilience):** The LLM API integration must support an automatic fallback provider (e.g., instantly switching from Anthropic to OpenAI) if the primary API times out after 5 seconds, ensuring the live Hackathon demo never visibly fails.
- **NFR-INT2 (Sync Latency):** The document state must synchronize between the Next.js backend and the WOPI Document Server with less than 500ms latency to prevent redline race conditions when multiple users are editing.

## Domain Architecture & Risk Mitigation

### Compliance & Ephemerality Architecture
- **Zero-Leakage Tenant Isolation:** Information for both entities must be safely guarded in separate data silos. The system rigorously enforces that only explicitly shared insights and mutually agreed-upon clauses are exchanged between the two entities.
- **LLM Zero-Retention Boundary:** Any third-party AI provider used for the Conciliator or Copilot must be under a strict Zero-Data Retention (ZDR) enterprise agreement. The system must attempt to sanitize/mask PII before sending clause text to the LLM.
- **DMS Integration & Cryptographic Receipts:** The system should push the final document directly to legal Document Management Systems (DMS) (like iManage or NetDocuments), or at minimum, email a secure, encrypted link with a verifiable download receipt before initiating the automated purge.
- **Soft-Delete Grace Period:** The architecture implements a brief, secure recovery window (e.g., 72 hours) before the hard purge executes to protect against accidental closures or briefly revived deals.

### Risk Management
- **Risk: AI Hallucination & Legal Malpractice.** *Mitigation:* AI actions are strictly limited to *suggestions* requiring deliberate human approval. The AI cannot execute bindings.
- **Risk: Unauthorized Commercial Access.** *Mitigation:* Strict Role-Based Access Control (RBAC) preventing Sales/Business users from accessing raw legal text, exposing only pipeline metadata.
