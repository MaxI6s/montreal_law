// ── Clause Status State Machine ──
// backlog → vendor-modified | client-modified (one side edits)
// vendor-modified → resolved (client accepts) | client-modified (client counter-proposes) | disputed (vendor re-edits) | pending-conciliation
// client-modified → resolved (vendor accepts) | vendor-modified (vendor counter-proposes) | disputed (client re-edits) | pending-conciliation
// disputed → resolved | pending-conciliation
// pending-conciliation → resolved (AI compromise accepted)

export type ClauseStatus = 'backlog' | 'vendor-modified' | 'client-modified' | 'disputed' | 'pending-conciliation' | 'resolved';

export interface Clause {
  id: string;
  documentId: string;
  order: number;
  title: string;
  originalText: string;
  currentText: string;
  status: ClauseStatus;
  lastModifiedBy: 'vendor' | 'client' | null;
}

export interface SalesNotification {
  id: string;
  type: 'urgent' | 'info';
  from: string;
  message: string;
  clauseTitle: string;
  documentId: string;
  timestamp: string;
  read: boolean;
}

export interface DocumentInfo {
  id: string;
  title: string;
  type: 'NDA' | 'MSA' | 'DPA';
  parties: {
    client: string;
    vendor: string;
  };
}

export interface Comment {
  id: string;
  clauseId: string;
  author: string;
  role: 'vendor' | 'client';
  text: string;
  timestamp: string;
}

export const MOCK_DOCUMENTS: DocumentInfo[] = [
  {
    id: 'doc-nda-1',
    title: 'Mutual Non-Disclosure Agreement',
    type: 'NDA',
    parties: {
      client: 'Initech Financial Group Inc.',
      vendor: 'Dunder AI Inc.'
    }
  },
  {
    id: 'doc-msa-1',
    title: 'Master Subscription Agreement',
    type: 'MSA',
    parties: {
      client: 'Initech Financial Group Inc.',
      vendor: 'Dunder AI Inc.'
    }
  },
  {
    id: 'doc-dpa-1',
    title: 'Data Processing Agreement',
    type: 'DPA',
    parties: {
      client: 'Acme Corp.',
      vendor: 'Dunder AI Inc.'
    }
  }
];

export const MOCK_NDA_CLAUSES: Clause[] = [
  {
    id: 'clause-nda-1',
    documentId: 'doc-nda-1',
    order: 1,
    title: '1. PURPOSE',
    originalText: "The Parties wish to explore a potential business relationship involving Dunder's AI-powered contract review platform (the \"Purpose\"). In connection with the Purpose, each Party may disclose certain confidential information to the other.",
    currentText: "The Parties wish to explore a potential business relationship involving Dunder's AI-powered contract review platform (the \"Purpose\"). In connection with the Purpose, each Party may disclose certain confidential information to the other.",
    status: 'resolved',
    lastModifiedBy: null
  },
  {
    id: 'clause-nda-2',
    documentId: 'doc-nda-1',
    order: 2,
    title: '2. CONFIDENTIAL INFORMATION',
    originalText: "2.1 Definition. \"Confidential Information\" means any non-public information disclosed by one Party (the \"Disclosing Party\") to the other Party (the \"Receiving Party\"), whether disclosed orally, in writing, or by any other means, that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure. Confidential Information includes, without limitation, business plans, financial information, technical data, product roadmaps, pricing, customer lists, and trade secrets.\n\n2.2 Exclusions. Confidential Information does not include information that: (a) is or becomes publicly available through no fault of the Receiving Party; (b) was rightfully known to the Receiving Party prior to disclosure without restriction; (c) is rightfully received by the Receiving Party from a third party without restriction; or (d) is independently developed by the Receiving Party without use of the Disclosing Party's Confidential Information.",
    currentText: "2.1 Definition. \"Confidential Information\" means any non-public information disclosed by one Party (the \"Disclosing Party\") to the other Party (the \"Receiving Party\"), whether disclosed orally, in writing, or by any other means, that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure. Confidential Information includes, without limitation, business plans, financial information, technical data, product roadmaps, pricing, customer lists, and trade secrets.\n\n2.2 Exclusions. Confidential Information does not include information that: (a) is or becomes publicly available through no fault of the Receiving Party; (b) was rightfully known to the Receiving Party prior to disclosure without restriction; (c) is rightfully received by the Receiving Party from a third party without restriction; or (d) is independently developed by the Receiving Party without use of the Disclosing Party's Confidential Information.",
    status: 'resolved',
    lastModifiedBy: null
  },
  {
    id: 'clause-nda-3',
    documentId: 'doc-nda-1',
    order: 3,
    title: '3. OBLIGATIONS',
    originalText: "3.1 Non-Disclosure. Each Receiving Party agrees to: (a) hold the Disclosing Party's Confidential Information in strict confidence using at least the same degree of care it uses to protect its own confidential information, but no less than reasonable care; (b) not disclose Confidential Information to any third party without the prior written consent of the Disclosing Party; and (c) use the Confidential Information solely for the Purpose.\n\n3.2 Permitted Disclosures. A Receiving Party may disclose Confidential Information to its employees, officers, directors, advisors, and contractors (\"Representatives\") who: (a) have a need to know such information for the Purpose; and (b) are bound by confidentiality obligations at least as protective as those in this Agreement. Each Party is responsible for any breach of this Agreement by its Representatives.\n\n3.3 Required Disclosures. If a Receiving Party is required by law, regulation, or court order to disclose Confidential Information, it will: (a) promptly notify the Disclosing Party in writing to the extent permitted by law; (b) reasonably cooperate with the Disclosing Party's efforts to seek a protective order or other appropriate relief; and (c) disclose only the minimum amount of information required.",
    currentText: "3.1 Non-Disclosure. Each Receiving Party agrees to: (a) hold the Disclosing Party's Confidential Information in strict confidence using at least the same degree of care it uses to protect its own confidential information, but no less than reasonable care; (b) not disclose Confidential Information to any third party without the prior written consent of the Disclosing Party; and (c) use the Confidential Information solely for the Purpose.\n\n3.2 Permitted Disclosures. A Receiving Party may disclose Confidential Information only to its employees and officers (\"Authorized Personnel\") who: (a) have a direct need to know such information for the Purpose; and (b) are bound by confidentiality obligations at least as protective as those in this Agreement. Each Party is responsible for any breach of this Agreement by its Authorized Personnel.\n\n3.3 Required Disclosures. If a Receiving Party is required by law, regulation, or court order to disclose Confidential Information, it will: (a) promptly notify the Disclosing Party in writing to the extent permitted by law; (b) reasonably cooperate with the Disclosing Party's efforts to seek a protective order or other appropriate relief; and (c) disclose only the minimum amount of information required.",
    status: 'vendor-modified',
    lastModifiedBy: 'vendor'
  },
  {
    id: 'clause-nda-4',
    documentId: 'doc-nda-1',
    order: 4,
    title: '4. TERM',
    originalText: "4.1 This Agreement commences on the Effective Date and continues for a period of two (2) years, unless earlier terminated by either Party upon thirty (30) days' written notice.\n\n4.2 The confidentiality obligations in Section 3 survive termination of this Agreement for a further period of two (2) years.",
    currentText: "4.1 This Agreement commences on the Effective Date and continues for a period of two (2) years, unless earlier terminated by either Party upon thirty (30) days' written notice.\n\n4.2 The confidentiality obligations in Section 3 survive termination of this Agreement for a further period of two (2) years.",
    status: 'backlog',
    lastModifiedBy: null
  },
  {
    id: 'clause-nda-5',
    documentId: 'doc-nda-1',
    order: 5,
    title: '5. RETURN OR DESTRUCTION OF INFORMATION',
    originalText: "Upon the written request of the Disclosing Party or upon termination of this Agreement, the Receiving Party will promptly return or destroy all Confidential Information and any copies thereof, and certify such destruction in writing upon request. The Receiving Party may retain one archival copy solely for legal compliance purposes.",
    currentText: "Upon the written request of the Disclosing Party or upon termination of this Agreement, the Receiving Party will promptly return or destroy all Confidential Information and any copies thereof, and certify such destruction in writing upon request. The Receiving Party may retain one archival copy solely for legal compliance purposes.",
    status: 'backlog',
    lastModifiedBy: null
  },
  {
    id: 'clause-nda-6',
    documentId: 'doc-nda-1',
    order: 6,
    title: '6. NO LICENCE OR WARRANTY',
    originalText: "Nothing in this Agreement grants either Party any licence, right, title, or interest in the other Party's Confidential Information except as expressly set out herein. All Confidential Information is provided \"as is\" without any representation or warranty as to its accuracy or completeness.",
    currentText: "Nothing in this Agreement grants either Party any licence, right, title, or interest in the other Party's Confidential Information except as expressly set out herein. All Confidential Information is provided \"as is\" without any representation or warranty as to its accuracy or completeness.",
    status: 'resolved',
    lastModifiedBy: null
  },
  {
    id: 'clause-nda-7',
    documentId: 'doc-nda-1',
    order: 7,
    title: '7. REMEDIES',
    originalText: "The Parties acknowledge that a breach of this Agreement may cause irreparable harm for which monetary damages may be an inadequate remedy. Accordingly, in addition to any other remedies available at law or in equity, the Disclosing Party shall be entitled to seek equitable relief, including injunctive relief, provided that the Disclosing Party shall be required to post a bond or other security in an amount determined by a court of competent jurisdiction.",
    currentText: "The Parties acknowledge that a breach of this Agreement may cause irreparable harm for which monetary damages may be an inadequate remedy. Accordingly, in addition to any other remedies available at law or in equity, the Disclosing Party shall be entitled to seek equitable relief, including injunctive relief, and neither Party shall be required to post any bond or other security as a condition of obtaining such relief.",
    status: 'disputed',
    lastModifiedBy: 'client'
  },
  {
    id: 'clause-nda-8',
    documentId: 'doc-nda-1',
    order: 8,
    title: '8. GENERAL',
    originalText: "8.1 Governing Law. This Agreement is governed by the laws of the Province of Ontario and the federal laws of Canada applicable therein, without regard to conflict of law principles. Each Party irrevocably submits to the exclusive jurisdiction of the courts of Ontario.\n\n8.2 Entire Agreement. This Agreement constitutes the entire agreement between the Parties with respect to its subject matter and supersedes all prior negotiations, representations, and understandings.\n\n8.3 Amendments. This Agreement may only be amended by a written instrument signed by authorized representatives of both Parties.\n\n8.4 Severability. If any provision of this Agreement is held to be invalid or unenforceable, the remaining provisions continue in full force and effect.\n\n8.5 No Waiver. Failure to enforce any provision of this Agreement does not constitute a waiver of the right to enforce it in the future.\n\n8.6 Counterparts. This Agreement may be executed in counterparts, including by electronic signature, each of which will be deemed an original.",
    currentText: "8.1 Governing Law. This Agreement is governed by the laws of the Province of Ontario and the federal laws of Canada applicable therein, without regard to conflict of law principles. Each Party irrevocably submits to the exclusive jurisdiction of the courts of Ontario.\n\n8.2 Entire Agreement. This Agreement constitutes the entire agreement between the Parties with respect to its subject matter and supersedes all prior negotiations, representations, and understandings.\n\n8.3 Amendments. This Agreement may only be amended by a written instrument signed by authorized representatives of both Parties.\n\n8.4 Severability. If any provision of this Agreement is held to be invalid or unenforceable, the remaining provisions continue in full force and effect.\n\n8.5 No Waiver. Failure to enforce any provision of this Agreement does not constitute a waiver of the right to enforce it in the future.\n\n8.6 Counterparts. This Agreement may be executed in counterparts, including by electronic signature, each of which will be deemed an original.",
    status: 'resolved',
    lastModifiedBy: null
  }
];

// ── MSA Clauses — Expanded from real scenario data ──
export const MOCK_MSA_CLAUSES: Clause[] = [
  {
    id: 'clause-msa-1',
    documentId: 'doc-msa-1',
    order: 1,
    title: '1. SERVICES & UPTIME SLA',
    originalText: "Vendor will make the Services available to Client in accordance with this Agreement and the applicable Order Form. Vendor will use commercially reasonable efforts to ensure the Services are available 99.5% of the time in any given calendar month, excluding scheduled maintenance windows communicated at least 48 hours in advance.",
    currentText: "Vendor will make the Services available to Client in accordance with this Agreement and the applicable Order Form. Vendor will use commercially reasonable efforts to ensure the Services are available 99.9% of the time in any given calendar month, excluding scheduled maintenance windows communicated at least ten (10) business days in advance and performed outside of Client's normal business hours (Monday–Friday 7:00 AM–7:00 PM ET).",
    status: 'client-modified',
    lastModifiedBy: 'client'
  },
  {
    id: 'clause-msa-2',
    documentId: 'doc-msa-1',
    order: 2,
    title: '2. FEES AND PAYMENT',
    originalText: "Invoices are due within thirty (30) days of the invoice date. Overdue amounts bear interest at 1.5% per month (18% per annum). Vendor may increase fees upon renewal by no more than five percent (5%) over the prior term's fees, provided Vendor gives Client at least sixty (60) days' written notice.",
    currentText: "Invoices are due within sixty (60) days of the invoice date. Overdue amounts bear interest at 0.5% per month (6% per annum). Vendor may increase fees upon renewal by no more than three percent (3%) over the prior term's fees, provided Vendor gives Client at least ninety (90) days' written notice. Client may withhold payment of any disputed invoice in full pending resolution.",
    status: 'client-modified',
    lastModifiedBy: 'client'
  },
  {
    id: 'clause-msa-3',
    documentId: 'doc-msa-1',
    order: 3,
    title: '3. TERM AND TERMINATION',
    originalText: "Either party may terminate this Agreement upon written notice if the other party materially breaches this Agreement and fails to cure such breach within thirty (30) days of written notice describing the breach in reasonable detail.",
    currentText: "Client may terminate this Agreement for convenience upon thirty (30) days' written notice. Either party may terminate for cause if the other party materially breaches and fails to cure within fifteen (15) days of written notice.",
    status: 'disputed',
    lastModifiedBy: 'client'
  },
  {
    id: 'clause-msa-4',
    documentId: 'doc-msa-1',
    order: 4,
    title: '4. INTELLECTUAL PROPERTY',
    originalText: "Vendor retains all Intellectual Property Rights in and to the Services, platform, Documentation, and any improvements, modifications, or derivative works thereof, including any custom features or configurations developed for Client. If Client provides suggestions or feedback regarding the Services, Vendor may use such feedback without restriction.",
    currentText: "Vendor retains all Intellectual Property Rights in the Services and platform. However, Client shall own all rights to any custom features, integrations, or configurations developed specifically for Client and funded by Client. Vendor shall not use Client feedback to develop features for Vendor's other customers without Client's prior written consent.",
    status: 'disputed',
    lastModifiedBy: 'client'
  },
  {
    id: 'clause-msa-5',
    documentId: 'doc-msa-1',
    order: 5,
    title: '5. LIABILITY CAP',
    originalText: "Each party's total aggregate liability arising out of or related to this Agreement shall not exceed the total fees paid or payable by Client in the twelve (12) months immediately preceding the event giving rise to the claim. Neither party shall be liable for any indirect, incidental, special, punitive, or consequential damages.",
    currentText: "Each party's total aggregate liability for commercial disputes shall not exceed the total fees paid in the twelve (12) months preceding the claim. The liability cap shall not apply to breaches involving Client Data, data security incidents, or gross negligence, for which Vendor's liability shall be uncapped. The exclusion of consequential damages shall not apply to data breach or gross negligence.",
    status: 'disputed',
    lastModifiedBy: 'client'
  },
  {
    id: 'clause-msa-6',
    documentId: 'doc-msa-1',
    order: 6,
    title: '6. DATA PROTECTION & LOCATION',
    originalText: "Client Data will be stored and processed in Canada. Vendor will implement appropriate technical and organizational security measures and notify Client promptly upon becoming aware of any unauthorized access to Client Data.",
    currentText: "Client Data will be stored and processed exclusively within the Province of Ontario. Vendor will implement appropriate technical and organizational security measures and notify Client within twenty-four (24) hours of becoming aware of any unauthorized access to Client Data.",
    status: 'vendor-modified',
    lastModifiedBy: 'vendor'
  },
  {
    id: 'clause-msa-7',
    documentId: 'doc-msa-1',
    order: 7,
    title: '7. AUDIT RIGHTS & INSURANCE',
    originalText: "This section intentionally left blank in original draft.",
    currentText: "Client may audit Vendor's compliance with this Agreement up to twice per year upon forty-eight (48) hours' written notice. Vendor shall maintain cyber liability insurance of not less than $10,000,000 CAD, errors and omissions insurance of not less than $5,000,000 CAD, and commercial general liability insurance of not less than $5,000,000 CAD.",
    status: 'client-modified',
    lastModifiedBy: 'client'
  },
  {
    id: 'clause-msa-8',
    documentId: 'doc-msa-1',
    order: 8,
    title: '8. GENERAL PROVISIONS',
    originalText: "This Agreement is governed by the laws of the Province of Ontario. Neither party may assign this Agreement without prior written consent, except in connection with a merger, acquisition, or sale of substantially all assets. This Agreement constitutes the entire agreement between the parties.",
    currentText: "This Agreement is governed by the laws of the Province of Ontario. Neither party may assign this Agreement without prior written consent, except in connection with a merger, acquisition, or sale of substantially all assets. This Agreement constitutes the entire agreement between the parties.",
    status: 'resolved',
    lastModifiedBy: null
  }
];

// ── Playbook constraints for the AI Conciliator ──
export const PLAYBOOKS = {
  vendor: {
    name: "Dunder AI Inc. (Vendor)",
    rules: {
      "Remedies": "We strongly prefer mutual injunctive relief. We absolutely CANNOT accept a requirement to post a bond or security, as it ties up capital.",
      "Liability Cap": "We CANNOT accept uncapped liability under any circumstances — this is existential for a startup. Our maximum acceptable exposure is 2x annual fees. We can accept a higher cap for data breach (e.g., 3x fees) but never uncapped.",
      "Termination": "We CANNOT accept convenience termination by the client. Our minimum acceptable position is termination for cause with a 30-day cure period.",
      "IP Ownership": "We retain all IP including custom features — this is core to our product roadmap. We can consider a perpetual licence for custom work but not ownership transfer."
    }
  },
  client: {
    name: "Initech Financial (Client)",
    rules: {
      "Remedies": "We require the ability to seek injunctive relief. We strongly prefer that the disclosing party post a bond or security to prevent frivolous injunctions.",
      "Liability Cap": "As a regulated financial institution, we REQUIRE uncapped liability for data breaches and security incidents. This is non-negotiable per OSFI guidance. Standard commercial cap for everything else is acceptable.",
      "Termination": "We strongly prefer convenience termination with 30-day notice. Our fallback position is convenience termination with 60-day notice and a termination fee equal to 3 months of fees.",
      "IP Ownership": "We strongly prefer ownership of custom features funded by us. Our fallback is a perpetual, irrevocable licence to use and modify custom features, with Vendor restricted from using our custom work for competitors."
    }
  }
};

// ── NDA Conciliator Response ──
export const MOCK_CONCILIATOR_RESPONSE = {
  diff: {
    deleted: ", provided that the Disclosing Party shall be required to post a bond or other security in an amount determined by a court of competent jurisdiction",
    added: " without the necessity of posting a bond or other security"
  },
  proposedText: "The Parties acknowledge that a breach of this Agreement may cause irreparable harm for which monetary damages may be an inadequate remedy. Accordingly, in addition to any other remedies available at law or in equity, the Disclosing Party shall be entitled to seek equitable relief, including injunctive relief without the necessity of posting a bond or other security.",
  rationale: "Industry standard practice for commercial NDAs is mutual injunctive relief without a bond requirement. The Vendor strictly prohibits tying up capital in bonds, while the Client's requirement for a bond was a 'strong preference' rather than a hard constraint. This proposal removes the bond requirement, aligning with market standard while providing equitable relief to both parties."
};

// ── MSA Conciliator Response (for liability cap) ──
export const MOCK_MSA_CONCILIATOR_RESPONSE = {
  diff: {
    deleted: "for which Vendor's liability shall be uncapped",
    added: "for which Vendor's liability shall be capped at three (3) times the total fees paid in the twelve (12) months preceding the claim"
  },
  proposedText: "Each party's total aggregate liability for commercial disputes shall not exceed the total fees paid in the twelve (12) months preceding the claim. For breaches involving Client Data or data security incidents, Vendor's liability shall be capped at three (3) times the total fees paid in the twelve (12) months preceding the claim. The exclusion of consequential damages shall not apply to data breach or gross negligence.",
  rationale: "Market standard for SaaS MSAs involving regulated financial institutions is a tiered liability structure. An uncapped liability is existential for Vendor (an 18-month-old startup), while Client has regulatory obligations requiring heightened vendor accountability for data incidents. The 3x multiplier for data breaches is the most common market compromise — it provides Client meaningful recourse while keeping Vendor's exposure bounded. This aligns with standard practice in the Canadian financial services technology sector."
};

// ── Generic/Obligations Conciliator Response ──
export const MOCK_OBLIGATIONS_RESPONSE = {
  diff: {
    deleted: "no less than reasonable care",
    added: "a commercially reasonable degree of care"
  },
  proposedText: "Each Receiving Party agrees to: (a) hold the Disclosing Party's Confidential Information in strict confidence using at least the same degree of care it uses to protect its own confidential information, but a commercially reasonable degree of care; (b) not disclose Confidential Information to any third party without the prior written consent of the Disclosing Party.",
  rationale: "Aligning the standard of care with 'commercially reasonable' creates a more objective, easily measurable threshold compared to 'reasonable care', satisfying both parties' desire for predictability."
};

// ── Intellectual Property Conciliator Response ──
export const MOCK_IP_RESPONSE = {
  diff: {
    deleted: "Client shall own all rights to any custom features",
    added: "Vendor grants Client a perpetual, irrevocable, royalty-free license to use and modify the custom features"
  },
  proposedText: "Vendor retains all Intellectual Property Rights in the Services and platform. However, Vendor grants Client a perpetual, irrevocable, royalty-free license to use and modify the custom features, integrations, or configurations developed specifically for Client and funded by Client.",
  rationale: "Transferring IP ownership is fundamentally incompatible with the Vendor's SaaS model. Providing the Client with a perpetual, irrevocable license achieves the Client's business need of unhindered use of the custom work they funded, without fracturing the Vendor's codebase."
};

// ── Impasse Response (for termination clause — irreconcilable) ──
export const MOCK_IMPASSE_RESPONSE = {
  reason: "The playbook constraints are mathematically irreconcilable as stated.",
  vendorConstraint: "Vendor CANNOT accept convenience termination under any circumstances — classified as a hard constraint.",
  clientConstraint: "Client requires convenience termination capability — minimum fallback position is 60-day notice with a termination fee.",
  analysis: "Vendor's playbook treats the prohibition on convenience termination as a non-negotiable 'red line.' Client's playbook treats convenience termination as a requirement with fallback positions, but all fallback positions still include some form of at-will exit. No middle ground exists within the current constraint boundaries. A Lead Lawyer override is required to relax one party's constraint.",
  suggestion: "Consider overriding Vendor's constraint to allow convenience termination with: (a) 90-day notice period, (b) a termination fee equal to 6 months of fees, and (c) a minimum 12-month commitment before the convenience exit becomes available."
};

// ── Override Response (post-impasse, after vendor relaxes constraint) ──
export const MOCK_OVERRIDE_RESPONSE = {
  diff: {
    deleted: "Client may terminate this Agreement for convenience upon thirty (30) days' written notice.",
    added: "After the initial twelve (12) month commitment period, Client may terminate this Agreement for convenience upon ninety (90) days' written notice, subject to payment of an early termination fee equal to six (6) months of fees."
  },
  proposedText: "After the initial twelve (12) month commitment period, Client may terminate this Agreement for convenience upon ninety (90) days' written notice, subject to payment of an early termination fee equal to six (6) months of fees. Either party may terminate for cause if the other party materially breaches and fails to cure within thirty (30) days of written notice.",
  rationale: "With the Vendor's constraint overridden, a standard SaaS enterprise compromise emerges: a minimum commitment period protects the Vendor's initial investment in onboarding, while the 90-day notice period and 6-month termination fee provide predictable revenue runway. The 30-day cure period (restored from Vendor's original) is market standard. This structure is common in Canadian enterprise SaaS agreements where the client has regulatory needs for exit flexibility."
};

// ── Pre-seeded discussion comments ──
export const MOCK_INITIAL_COMMENTS: Comment[] = [
  {
    id: 'comment-1',
    clauseId: 'clause-nda-7',
    author: 'Sarah Chen',
    role: 'vendor',
    text: 'The bond requirement is a dealbreaker for us — tying up capital in security deposits is not viable at our stage. Industry standard for commercial NDAs is mutual injunctive relief without bonds.',
    timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
  },
  {
    id: 'comment-2',
    clauseId: 'clause-nda-7',
    author: 'James Whitfield',
    role: 'client',
    text: 'We understand the capital concern, but our compliance team wants protection against frivolous injunctions. Can we explore a middle ground — perhaps a reduced bond amount or a court-determined threshold?',
    timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
  },
  {
    id: 'comment-3',
    clauseId: 'clause-nda-7',
    author: 'Sarah Chen',
    role: 'vendor',
    text: 'Our counsel advises that the "irreparable harm" standard itself provides adequate protection. We could add language requiring good faith before seeking injunctive relief. Would that satisfy compliance?',
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: 'comment-4',
    clauseId: 'clause-msa-5',
    author: 'James Whitfield',
    role: 'client',
    text: 'OSFI third-party risk guidance is clear — we cannot accept a capped liability for data breaches involving customer PII. This is a regulatory requirement, not a preference.',
    timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    id: 'comment-5',
    clauseId: 'clause-msa-5',
    author: 'Sarah Chen',
    role: 'vendor',
    text: 'Uncapped liability is existential for a startup our size. Our insurance covers $10M — can we cap at our insurance limit as a compromise?',
    timestamp: new Date(Date.now() - 4.5 * 3600000).toISOString(),
  },
  {
    id: 'comment-6',
    clauseId: 'clause-msa-4',
    author: 'Sarah Chen',
    role: 'vendor',
    text: 'We cannot transfer IP ownership of custom features — these become part of our core platform. We can offer a perpetual, irrevocable licence to use and modify the custom work.',
    timestamp: new Date(Date.now() - 6 * 3600000).toISOString(),
  },
];

// Pre-seeded notifications for the demo
export const MOCK_INITIAL_NOTIFICATIONS: SalesNotification[] = [
  {
    id: 'notif-1',
    type: 'urgent',
    from: 'Sarah Chen (Vendor Legal)',
    message: 'Clause 7 (Remedies) is under active dispute with Client. Bond requirement is a dealbreaker — may need your input on commercial flexibility.',
    clauseTitle: '7. REMEDIES',
    documentId: 'doc-nda-1',
    timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
    read: false
  },
  {
    id: 'notif-2',
    type: 'info',
    from: 'Sarah Chen (Vendor Legal)',
    message: 'Narrowed permitted disclosures in Section 3 — removed external contractors per our security policy. Awaiting client response.',
    clauseTitle: '3. OBLIGATIONS',
    documentId: 'doc-nda-1',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    read: true
  },
  {
    id: 'notif-3',
    type: 'urgent',
    from: 'Sarah Chen (Vendor Legal)',
    message: 'MSA liability cap is at an impasse — Client demands uncapped data breach liability (OSFI requirement). This could be a deal-stopper. Need commercial guidance on acceptable risk exposure.',
    clauseTitle: '5. LIABILITY CAP',
    documentId: 'doc-msa-1',
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    read: false
  }
];

export const MOCK_DPA_CLAUSES: Clause[] = [
  {
    id: 'c-dpa-1', documentId: 'doc-dpa-1', order: 1, title: '1. DEFINITIONS',
    originalText: 'For the purposes of this Data Processing Agreement ("DPA"), "Personal Data", "Processing", "Controller", and "Processor" shall have the meanings given to them in the General Data Protection Regulation (EU) 2016/679 ("GDPR").',
    currentText: 'For the purposes of this Data Processing Agreement ("DPA"), "Personal Data", "Processing", "Controller", and "Processor" shall have the meanings given to them in the General Data Protection Regulation (EU) 2016/679 ("GDPR").',
    status: 'backlog', lastModifiedBy: null
  },
  {
    id: 'c-dpa-2', documentId: 'doc-dpa-1', order: 2, title: '2. DATA PROCESSING OBLIGATIONS',
    originalText: 'The Processor shall only process Personal Data on behalf of the Controller and in accordance with the documented instructions of the Controller, unless required to do so by applicable law.',
    currentText: 'The Processor shall only process Personal Data on behalf of the Controller and in accordance with the documented instructions of the Controller, unless required to do so by applicable law.',
    status: 'backlog', lastModifiedBy: null
  },
  {
    id: 'c-dpa-3', documentId: 'doc-dpa-1', order: 3, title: '3. SUB-PROCESSORS',
    originalText: 'The Processor shall not engage any sub-processor without the prior specific or general written authorization of the Controller. In the case of general written authorization, the Processor shall inform the Controller of any intended changes concerning the addition or replacement of other sub-processors.',
    currentText: 'The Processor shall not engage any sub-processor without the prior specific or general written authorization of the Controller. In the case of general written authorization, the Processor shall inform the Controller of any intended changes concerning the addition or replacement of other sub-processors.',
    status: 'backlog', lastModifiedBy: null
  },
  {
    id: 'c-dpa-4', documentId: 'doc-dpa-1', order: 4, title: '4. SECURITY MEASURES',
    originalText: 'The Processor shall implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk, including encryption of Personal Data and the ability to ensure the ongoing confidentiality, integrity, availability, and resilience of processing systems.',
    currentText: 'The Processor shall implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk, including encryption of Personal Data and the ability to ensure the ongoing confidentiality, integrity, availability, and resilience of processing systems.',
    status: 'backlog', lastModifiedBy: null
  }
];
