import { create } from 'zustand';
import { Clause, ClauseStatus, SalesNotification, Comment, MOCK_NDA_CLAUSES, MOCK_MSA_CLAUSES, MOCK_INITIAL_NOTIFICATIONS, MOCK_INITIAL_COMMENTS } from '@/lib/mock-data';

export type Role = 'vendor' | 'client' | 'sales';

interface AppState {
  // Identity State
  activeRole: Role;
  activeTenant: string;
  setActiveRole: (role: Role) => void;
  
  // Document State
  activeDocumentId: string;
  setActiveDocument: (id: string) => void;
  
  // Clause State
  clauses: Record<string, Clause[]>;
  selectedClauseId: string | null;
  setSelectedClause: (id: string | null) => void;
  updateClauseStatus: (documentId: string, clauseId: string, status: ClauseStatus) => void;
  updateClauseText: (documentId: string, clauseId: string, newText: string) => void;
  addClause: (documentId: string) => void;
  removeClause: (documentId: string, clauseId: string) => void;
  
  // Comment / Discussion State
  comments: Record<string, Comment[]>;
  addComment: (clauseId: string, text: string) => void;
  
  // Notification State (for Sales)
  notifications: SalesNotification[];
  addNotification: (notification: Omit<SalesNotification, 'id' | 'timestamp' | 'read'>) => void;
  dismissNotification: (id: string) => void;
  markNotificationRead: (id: string) => void;
  unreadCount: () => number;

  // Sign-off State
  signedOff: Record<string, boolean>;
  executeSignOff: (documentId: string) => void;
}

// Group initial comments by clauseId
const groupedComments: Record<string, Comment[]> = {};
MOCK_INITIAL_COMMENTS.forEach((c) => {
  if (!groupedComments[c.clauseId]) groupedComments[c.clauseId] = [];
  groupedComments[c.clauseId].push(c);
});

export const useStore = create<AppState>((set, get) => ({
  activeRole: 'vendor',
  activeTenant: 'Dunder AI Inc.',
  
  setActiveRole: (role) => set(() => {
    const tenant = role === 'vendor' 
      ? 'Dunder AI Inc.' 
      : (role === 'client' ? 'Initech Financial Group Inc.' : 'Dunder AI Inc.');
    return { activeRole: role, activeTenant: tenant };
  }),
  
  activeDocumentId: 'doc-nda-1',
  setActiveDocument: (id) => set({ activeDocumentId: id, selectedClauseId: null }),
  
  clauses: {
    'doc-nda-1': MOCK_NDA_CLAUSES,
    'doc-msa-1': MOCK_MSA_CLAUSES,
  },
  
  selectedClauseId: null,
  setSelectedClause: (id) => set({ selectedClauseId: id }),
  
  updateClauseStatus: (documentId, clauseId, status) => set((state) => ({
    clauses: {
      ...state.clauses,
      [documentId]: state.clauses[documentId].map((c) => 
        c.id === clauseId ? { ...c, status } : c
      )
    }
  })),

  // Role-aware text update — automatically sets proper ping-pong status
  updateClauseText: (documentId, clauseId, newText) => set((state) => {
    const role = state.activeRole as 'vendor' | 'client';
    
    return {
      clauses: {
        ...state.clauses,
        [documentId]: state.clauses[documentId].map((c) => {
          if (c.id !== clauseId) return c;
          
          // Determine the new status based on who is editing and current state
          let newStatus: ClauseStatus;
          if (c.status === 'backlog') {
            // First edit on a fresh clause
            newStatus = role === 'vendor' ? 'vendor-modified' : 'client-modified';
          } else if (c.status === 'vendor-modified' && role === 'client') {
            // Client counter-proposes to vendor's edit
            newStatus = 'client-modified';
          } else if (c.status === 'client-modified' && role === 'vendor') {
            // Vendor counter-proposes to client's edit
            newStatus = 'vendor-modified';
          } else if (
            (c.status === 'vendor-modified' && role === 'vendor') ||
            (c.status === 'client-modified' && role === 'client')
          ) {
            // Same party re-editing their own proposal — stays same status
            newStatus = c.status;
          } else if (c.status === 'disputed') {
            // Editing a disputed clause — becomes their modification
            newStatus = role === 'vendor' ? 'vendor-modified' : 'client-modified';
          } else {
            // Fallback: mark as role-modified
            newStatus = role === 'vendor' ? 'vendor-modified' : 'client-modified';
          }
          
          return { 
            ...c, 
            currentText: newText, 
            status: newStatus,
            lastModifiedBy: role
          };
        })
      }
    };
  }),

  addClause: (documentId) => set((state) => {
    const docClauses = state.clauses[documentId] || [];
    const newOrder = docClauses.length > 0 ? Math.max(...docClauses.map(c => c.order)) + 1 : 1;
    const role = state.activeRole as 'vendor' | 'client';
    const newClause: Clause = {
      id: `clause-new-${Date.now()}`,
      documentId,
      order: newOrder,
      title: `${newOrder}. NEW CLAUSE`,
      originalText: "",
      currentText: "Draft new clause content here...",
      status: role === 'vendor' ? 'vendor-modified' : 'client-modified',
      lastModifiedBy: role
    };
    return {
      clauses: {
        ...state.clauses,
        [documentId]: [...docClauses, newClause]
      }
    };
  }),

  removeClause: (documentId, clauseId) => set((state) => ({
    clauses: {
      ...state.clauses,
      [documentId]: state.clauses[documentId]?.filter(c => c.id !== clauseId) || []
    },
    selectedClauseId: state.selectedClauseId === clauseId ? null : state.selectedClauseId
  })),

  // ── Comments / Discussion ──
  comments: groupedComments,

  addComment: (clauseId, text) => set((state) => {
    const role = state.activeRole as 'vendor' | 'client';
    const authorName = role === 'vendor' ? 'Sarah Chen' : 'James Whitfield';
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      clauseId,
      author: authorName,
      role,
      text,
      timestamp: new Date().toISOString(),
    };
    const existing = state.comments[clauseId] || [];
    return {
      comments: {
        ...state.comments,
        [clauseId]: [...existing, newComment],
      }
    };
  }),

  // ── Notifications ──
  notifications: MOCK_INITIAL_NOTIFICATIONS,
  
  addNotification: (notification) => set((state) => ({
    notifications: [
      {
        ...notification,
        id: `notif-${Date.now()}`,
        timestamp: new Date().toISOString(),
        read: false,
      },
      ...state.notifications
    ]
  })),
  
  dismissNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
  
  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    )
  })),
  
  unreadCount: () => get().notifications.filter(n => !n.read).length,

  // ── Sign-Off ──
  signedOff: {},
  
  executeSignOff: (documentId) => set((state) => ({
    signedOff: { ...state.signedOff, [documentId]: true }
  })),
}));
