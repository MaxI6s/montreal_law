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
  type: 'NDA' | 'MSA';
  parties: {
    client: string;
    vendor: string;
  };
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

export const MOCK_MSA_CLAUSES: Clause[] = [
  {
    id: 'clause-msa-1',
    documentId: 'doc-msa-1',
    order: 1,
    title: '1. SERVICES',
    originalText: "Dunder will provide the cloud-based contract review services (the \"Services\") as described in the applicable Order Form. Initech may access and use the Services solely for its internal business purposes during the Subscription Term.",
    currentText: "Dunder will provide the cloud-based contract review services (the \"Services\") as described in the applicable Order Form. Initech may access and use the Services solely for its internal business purposes during the Subscription Term.",
    status: 'resolved',
    lastModifiedBy: null
  },
  {
    id: 'clause-msa-2',
    documentId: 'doc-msa-1',
    order: 2,
    title: '2. FEES AND PAYMENT',
    originalText: "Initech will pay Dunder the fees specified in the Order Form. All fees are non-refundable and payable within 30 days of the invoice date.",
    currentText: "Initech will pay Dunder the fees specified in the Order Form. All fees are non-refundable and payable within 30 days of the invoice date.",
    status: 'backlog',
    lastModifiedBy: null
  },
  {
    id: 'clause-msa-3',
    documentId: 'doc-msa-1',
    order: 3,
    title: '3. INDEMNIFICATION',
    originalText: "Dunder will defend, indemnify, and hold harmless Initech from any claims alleging that the Services infringe any third-party intellectual property rights.",
    currentText: "Dunder will defend, indemnify, and hold harmless Initech from any claims alleging that the Services infringe any third-party intellectual property rights, subject to a liability cap equal to the total fees paid by Initech in the twelve (12) months preceding the claim.",
    status: 'vendor-modified',
    lastModifiedBy: 'vendor'
  }
];

// Playbook constraints for the AI Conciliator
export const PLAYBOOKS = {
  vendor: {
    name: "Dunder AI Inc. (Vendor)",
    rules: {
      "Remedies": "We strongly prefer mutual injunctive relief. We absolutely CANNOT accept a requirement to post a bond or security, as it ties up capital."
    }
  },
  client: {
    name: "Initech Financial (Client)",
    rules: {
      "Remedies": "We require the ability to seek injunctive relief. We strongly prefer that the disclosing party post a bond or security to prevent frivolous injunctions."
    }
  }
};

export const MOCK_CONCILIATOR_RESPONSE = {
  diff: {
    deleted: ", provided that the Disclosing Party shall be required to post a bond or other security in an amount determined by a court of competent jurisdiction",
    added: " without the necessity of posting a bond or other security"
  },
  proposedText: "The Parties acknowledge that a breach of this Agreement may cause irreparable harm for which monetary damages may be an inadequate remedy. Accordingly, in addition to any other remedies available at law or in equity, the Disclosing Party shall be entitled to seek equitable relief, including injunctive relief without the necessity of posting a bond or other security.",
  rationale: "Industry standard practice for commercial NDAs is mutual injunctive relief without a bond requirement. The Vendor strictly prohibits tying up capital in bonds, while the Client's requirement for a bond was a 'strong preference' rather than a hard constraint. This proposal removes the bond requirement, aligning with market standard while providing equitable relief to both parties."
};

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
  }
];
