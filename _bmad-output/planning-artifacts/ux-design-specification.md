---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments: ["prd.md", "product-brief-montreal_law.md", "prfaq-montreal_law.md", "chalenge.md", "project_base.md"]
---

# UX Design Specification montreal_law

**Author:** Maxime
**Date:** 2026-05-09

---

## Executive Summary

### Project Vision

Montreal Law is a centralized, dual-sided B2B SaaS platform that transforms contract negotiation. It eliminates the slow email ping-pong of redlines by bringing Vendor and Client lawyers into a shared workspace. Powered by a unique multi-agent AI system, its standout feature is the AI Conciliator—an intelligent mediator that actively resolves clause conflicts by finding optimal, pre-approved middle grounds between two opposing playbooks, drastically accelerating the path to a signed deal.

### Target Users

- **Lawyers (Vendor & Client):** The primary users who need a familiar, Word-like redlining experience combined with powerful AI assistance to speed up routine reviews.
- **Sales Reps & Deal Desk:** Secondary users who need clear, abstracted visibility into the negotiation pipeline without seeing raw legal text.
- **Admins / Managing Partners:** Users who configure and maintain the organization's private playbook rules, fallbacks, and non-negotiables.

### Key Design Challenges

- **Distinguishing AI Personas:** Visually differentiating the actions and suggestions of the Personal AI Copilot from the impartial AI Conciliator so users immediately understand who is proposing what.
- **Minimizing Adoption Friction:** Delivering a UI that feels as intuitive and reliable as traditional Word redlining, avoiding a steep learning curve for opposing counsel.
- **State Management & Locking:** Clearly communicating document states, such as when specific clauses are locked during active AI conciliation, without confusing the users.

### Design Opportunities

- **The Hackathon "Aha!" Moment:** Designing a highly visual and impactful dual-screen interaction flow for the AI Conciliation process that instantly proves the value of the platform.
- **Abstracted Pipeline Visibility:** Creating a clean, Kanban-style dashboard for Sales Reps that translates complex legal redlines into simple, actionable deal stages.

## Core User Experience

### Defining Experience

The core experience of Montreal Law revolves around the seamless transition from traditional document redlining to intelligent AI mediation. The defining interaction is the moment a negotiation stalls and the users invoke the AI Conciliator. This turns a complex, multi-round argument into a single-click resolution process, where the platform analyzes both playbooks and proposes an optimal middle ground natively within the document interface. 

To manage this complexity, the platform introduces a **Clause Extraction Panel**, allowing users to effortlessly toggle between viewing the "raw" traditional document and a Kanban-style board that visualizes the contract clause-by-clause (e.g., To Do, In Review, Conciliating, Resolved).

### Platform Strategy

- **Primary Platform:** Desktop Web Application. Contract negotiation requires high-fidelity document interaction, large screens for reviewing long texts, and precise track-changes controls. 
- **Interaction Model:** Mouse and keyboard heavy, mirroring the traditional Microsoft Word experience to minimize adoption friction.
- **Constraints:** Must support real-time concurrent editing and fast synchronization (<500ms latency) to prevent race conditions during live negotiations.

### Effortless Interactions

- **One-Click Conciliation:** Requesting AI mediation for a disputed clause should be as simple as moving a card in the Kanban view or leaving a comment in the raw view.
- **Approving AI Suggestions:** Whether it's the Personal AI Copilot or the impartial Conciliator, reviewing and accepting AI-generated redlines must be an instant, one-click action that immediately updates the document state.
- **State Transitions:** The system should automatically lock clauses during active conciliation and update presence indicators effortlessly across both the raw document and Kanban views without requiring page reloads.

### Critical Success Moments

- **The "Aha!" Resolution:** The exact moment the AI Conciliator proposes a compromise that perfectly satisfies both parties' hidden playbooks, instantly ending a tedious dispute.
- **First-Time User Trust:** When the opposing counsel (who may not be a paid subscriber) opens the platform for the first time and immediately understands how to review redlines and respond to Conciliator prompts without a tutorial.
- **The Sales Dashboard Glance:** When a Sales Rep checks their dashboard and instantly understands the deal's status without needing to interpret complex legal jargon.

### Experience Principles

- **Familiarity Over Novelty:** The core redlining interface must feel like traditional Word, augmented by the Kanban clause-by-clause view for structural management. The AI should feel like a powerful extension, not an alien interface.
- **Absolute Transparency:** Users must always know *who* is acting on the document: themselves, the opposing counsel, their Private Copilot, or the impartial Conciliator.
- **Frictionless Mediation:** Resolving a conflict through the Conciliator must always be faster and easier than drafting an email.
- **Strict Privacy Assurance:** The UI must constantly reinforce that the user's private playbook rules and Copilot suggestions are completely invisible to the opposing side.

## Desired Emotional Response

### Primary Emotional Goals

- **Relief & Empowerment:** Lawyers should feel an immediate sense of relief when the platform automatically resolves a complex multi-round clause dispute, replacing the dread of drafting another argumentative email.
- **Trust & Security:** Users must feel absolute confidence that their private playbook rules and the reasoning of their Personal Copilot are completely hidden from the opposing party.
- **Clarity & Control:** Sales Reps and stakeholders should feel a sense of control and clarity when they look at the pipeline dashboard, replacing the anxiety of the "black box" legal review process.

### Emotional Journey Mapping

- **Discovery/Onboarding:** A feeling of *familiarity*. Opposing counsel opening the app for the first time should feel comfortable because the interface mirrors the standard Word track-changes they already know.
- **Core Action (Redlining):** A feeling of *flow and focus*. The tool gets out of the way, allowing them to edit the document rapidly without lag or distraction.
- **The AI Conciliation:** A moment of *delight and "Aha!"*. The transition from a stubborn impasse to a mutually agreed-upon compromise should feel magical and deeply satisfying.
- **Post-Completion:** A feeling of *accomplishment and speed*, realizing the contract was signed in a fraction of the usual time.

### Micro-Emotions

- **Trust > Skepticism:** AI suggestions (both Copilot and Conciliator) must be presented neutrally and transparently to avoid triggering lawyer skepticism.
- **Clarity > Confusion:** The distinction between human redlines, Private Copilot suggestions, and impartial Conciliator proposals must be instantly clear to avoid any confusion about who is saying what.
- **Accomplishment > Frustration:** Navigating between the raw document and the Kanban clause panel should feel fluid, giving a small dopamine hit as clauses are dragged into "Resolved."

### Design Implications

- **Trust-Building UI:** Use clear color coding and distinct iconography to separate "Your AI" from "Neutral AI." Never take automated action without explicit human approval.
- **Familiarity UI:** Maintain standard legal document conventions (e.g., standard red strikethrough for deletions, blue/green underline for additions, right-hand margin for comments).
- **Delightful Transitions:** Use smooth micro-animations when a clause is resolved via the Conciliator or dragged across the Kanban board to emphasize the feeling of progress.

### Emotional Design Principles

- **Predictability Fosters Trust:** The AI should never surprise the user with unexpected document modifications; it should only ever *propose* and wait for consent.
- **Calmness over Clutter:** The interface should remain clean and minimalist, suppressing non-essential information (like complex playbook rules) until the user explicitly needs it.

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis

**Microsoft Word / Google Docs:**
- **Core Problem Solved:** Familiar text editing and track-changes for legal documents.
- **Why it Works:** The mental model for document redlining is universally understood (strikethroughs for deletions, underlines for additions, right-margin comments).
- **Inspiration:** We must adopt this visual language for the "raw" document view so lawyers feel instantly at home.

**Linear / Trello:**
- **Core Problem Solved:** Visualizing the state of discrete tasks or components.
- **Why it Works:** Kanban boards provide immediate, high-level clarity on project bottlenecks. Drag-and-drop state changes feel satisfying and effortless.
- **Inspiration:** We will adapt this for the **Clause Extraction Panel**. By treating individual contract clauses as "cards" that move through states (e.g., Unresolved, Conciliating, Agreed), we give Sales and Legal instant pipeline visibility.

**Notion:**
- **Core Problem Solved:** Seamlessly integrating AI (Notion AI) into a minimalist writing environment.
- **Why it Works:** The AI is invoked only when needed via subtle inline menus (e.g., highlighting text and clicking "Ask AI") rather than cluttering the screen with permanent chat windows.
- **Inspiration:** The AI Conciliator and Copilot should be invoked contextually, attached to specific clauses or comments, preserving a calm, uncluttered reading experience.

### Transferable UX Patterns

**Navigation Patterns:**
- **Dual-Pane Layout:** Splitting the screen between the raw document (left) and the Kanban clause panel (right) allows users to maintain context while structurally managing the negotiation.

**Interaction Patterns:**
- **Inline AI Invocation:** Triggering the Conciliator directly from a disputed clause's comment thread, rather than a separate "AI Chat" tab.
- **Kanban Drag-and-Drop:** Allowing users to manually approve an AI suggestion by dragging the clause card from "In Review" to "Resolved."

**Visual Patterns:**
- **Semantic Color Coding:** Using distinct, subdued colors (e.g., blue for Client AI, green for Vendor AI, purple for impartial Conciliator) to clearly delineate the source of automated suggestions without overwhelming the document's primary black-and-white text.

### Anti-Patterns to Avoid

- **The Persistent Chatbot Window:** Having a floating chat widget that obscures document text. This breaks focus and is annoying for deep reading tasks.
- **"Black Box" Auto-Corrections:** Automatically changing text without explicit human approval. In legal tech, the user must always execute the final "Accept" click to maintain trust and liability boundaries.
- **Overwhelming UI Clutter:** Showing all playbook rules, fallbacks, and AI reasoning at all times. This information should be progressively disclosed only when a user clicks to investigate *why* the AI proposed a specific change.

### Design Inspiration Strategy

**What to Adopt:**
- The standard visual language of Word track-changes for the raw document view to ensure zero adoption friction for opposing counsel.
- The Kanban board visualization for managing clause states and providing an abstracted view for Sales Reps.

**What to Adapt:**
- Notion's contextual AI invocation, modified specifically for dual-sided conflict resolution (the Conciliator) requiring two-party consent.

**What to Avoid:**
- Autonomous AI actions that bypass human review, and cluttered, persistent AI chat interfaces that distract from the contract text.

<!-- UX design content will be appended sequentially through collaborative workflow steps -->
