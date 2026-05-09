"use client";

import { useStore } from '@/store/useStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageSquare, CheckCircle2, AlertCircle, Bot, Edit3, X, Check, 
  Bell, Trash2, Plus, ArrowRightLeft, Clock, ShieldAlert, Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import ConciliatorDialog from './ConciliatorDialog';
import { toast } from 'sonner';
import { Clause, ClauseStatus } from '@/lib/mock-data';

export default function ClauseBoard() {
  const { 
    activeDocumentId, clauses, selectedClauseId, setSelectedClause, 
    updateClauseText, updateClauseStatus, activeRole, addClause, removeClause,
    addNotification
  } = useStore();
  
  const currentClauses = clauses[activeDocumentId] || [];
  
  const [conciliatorOpen, setConciliatorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const isSales = activeRole === 'sales';
  const isVendor = activeRole === 'vendor';
  const isClient = activeRole === 'client';

  // ── Determine if it's "my turn" to act on a clause ──
  const isMyTurn = (clause: Clause): boolean => {
    if (clause.status === 'backlog') return true; // Anyone can pick up backlog
    if (clause.status === 'vendor-modified') return isClient; // Client's turn to respond
    if (clause.status === 'client-modified') return isVendor; // Vendor's turn to respond
    if (clause.status === 'disputed') return true; // Either side can act
    return false;
  };

  const isWaiting = (clause: Clause): boolean => {
    if (clause.status === 'vendor-modified') return isVendor; // Vendor is waiting for client
    if (clause.status === 'client-modified') return isClient; // Client is waiting for vendor
    return false;
  };

  // ── Actions ──
  const startEdit = (e: React.MouseEvent, id: string, currentText: string) => {
    e.stopPropagation();
    setEditingId(id);
    setEditValue(currentText);
    setSelectedClause(id);
  };

  const saveEdit = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    updateClauseText(activeDocumentId, id, editValue);
    setEditingId(null);
    const label = isVendor ? 'Vendor Legal' : 'Client Legal';
    toast.success("Edit Recorded", { 
      description: `${label} has proposed changes. Awaiting opposing counsel's response.`
    });
  };

  const handleAccept = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    updateClauseStatus(activeDocumentId, id, 'resolved');
    const label = isVendor ? 'Vendor Legal' : 'Client Legal';
    toast.success("Clause Accepted ✓", { 
      description: `${label} has accepted this clause language.` 
    });
  };

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    removeClause(activeDocumentId, id);
    toast.success("Clause Removed", { description: "The clause has been stricken from the record." });
  };

  const handleNotifySales = (e: React.MouseEvent, clause: Clause) => {
    e.stopPropagation();
    addNotification({
      type: 'urgent',
      from: 'Sarah Chen (Vendor Legal)',
      message: `Clause "${clause.title}" requires attention — ${clause.status === 'disputed' ? 'actively disputed with opposing counsel' : 'under active negotiation'}.`,
      clauseTitle: clause.title,
      documentId: activeDocumentId,
    });
    toast.warning("Sales Team Notified", { 
      description: "An urgent notification has been sent to the Vendor Sales dashboard." 
    });
  };

  const handleCounterPropose = (e: React.MouseEvent, id: string, currentText: string) => {
    e.stopPropagation();
    startEdit(e, id, currentText);
    toast.info("Counter-Proposal Mode", { 
      description: "Edit the clause text and save to send your counter-proposal." 
    });
  };

  const handleRequestConciliation = (e: React.MouseEvent, clauseId: string) => {
    e.stopPropagation();
    setSelectedClause(clauseId);
    setConciliatorOpen(true);
  };

  // ── Group clauses by status for visual organization ──
  const actionRequired = currentClauses.filter(c => isMyTurn(c) && c.status !== 'backlog' && c.status !== 'resolved');
  const backlogClauses = currentClauses.filter(c => c.status === 'backlog');
  const waitingClauses = currentClauses.filter(c => isWaiting(c));
  const processingClauses = currentClauses.filter(c => c.status === 'pending-conciliation');
  const resolvedClauses = currentClauses.filter(c => c.status === 'resolved');

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] bg-slate-50/50 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-background flex items-center justify-between shadow-sm z-10 shrink-0">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          Clause Analysis
          <Badge variant="secondary" className="font-mono text-xs">
            {currentClauses.length}
          </Badge>
        </h2>
        {!isSales && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className={cn("h-2 w-2 rounded-full", isVendor ? "bg-emerald-500" : "bg-blue-500")} />
            {isVendor ? 'Vendor Legal View' : 'Client Legal View'}
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 p-4 h-full">
        <div className="space-y-6 pb-32 max-w-3xl mx-auto">

          {/* ── ACTION REQUIRED Section ── */}
          {actionRequired.length > 0 && !isSales && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-amber-700 px-1">
                <AlertCircle className="w-4 h-4" />
                ACTION REQUIRED ({actionRequired.length})
              </div>
              {actionRequired.map((clause) => (
                <ClauseCard
                  key={clause.id}
                  clause={clause}
                  isSelected={selectedClauseId === clause.id}
                  isEditing={editingId === clause.id}
                  editValue={editValue}
                  setEditValue={setEditValue}
                  onSelect={() => setSelectedClause(clause.id)}
                  onStartEdit={(e) => startEdit(e, clause.id, clause.currentText)}
                  onSaveEdit={(e) => saveEdit(e, clause.id)}
                  onCancelEdit={() => setEditingId(null)}
                  onAccept={(e) => handleAccept(e, clause.id)}
                  onRemove={(e) => handleRemove(e, clause.id)}
                  onNotifySales={(e) => handleNotifySales(e, clause)}
                  onCounterPropose={(e) => handleCounterPropose(e, clause.id, clause.currentText)}
                  onRequestConciliation={(e) => handleRequestConciliation(e, clause.id)}
                  activeRole={activeRole}
                  highlight="action"
                />
              ))}
            </div>
          )}

          {/* ── WAITING FOR RESPONSE Section ── */}
          {waitingClauses.length > 0 && !isSales && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-400 px-1">
                <Clock className="w-4 h-4" />
                AWAITING RESPONSE ({waitingClauses.length})
              </div>
              {waitingClauses.map((clause) => (
                <ClauseCard
                  key={clause.id}
                  clause={clause}
                  isSelected={selectedClauseId === clause.id}
                  isEditing={editingId === clause.id}
                  editValue={editValue}
                  setEditValue={setEditValue}
                  onSelect={() => setSelectedClause(clause.id)}
                  onStartEdit={(e) => startEdit(e, clause.id, clause.currentText)}
                  onSaveEdit={(e) => saveEdit(e, clause.id)}
                  onCancelEdit={() => setEditingId(null)}
                  onAccept={(e) => handleAccept(e, clause.id)}
                  onRemove={(e) => handleRemove(e, clause.id)}
                  onNotifySales={(e) => handleNotifySales(e, clause)}
                  onCounterPropose={(e) => handleCounterPropose(e, clause.id, clause.currentText)}
                  onRequestConciliation={(e) => handleRequestConciliation(e, clause.id)}
                  activeRole={activeRole}
                  highlight="waiting"
                />
              ))}
            </div>
          )}

          {/* ── AI PROCESSING Section ── */}
          {processingClauses.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600 px-1">
                <Bot className="w-4 h-4 animate-pulse" />
                AI CONCILIATION ({processingClauses.length})
              </div>
              {processingClauses.map((clause) => (
                <ClauseCard
                  key={clause.id}
                  clause={clause}
                  isSelected={selectedClauseId === clause.id}
                  isEditing={false}
                  editValue=""
                  setEditValue={() => {}}
                  onSelect={() => setSelectedClause(clause.id)}
                  onStartEdit={() => {}}
                  onSaveEdit={() => {}}
                  onCancelEdit={() => {}}
                  onAccept={() => {}}
                  onRemove={() => {}}
                  onNotifySales={() => {}}
                  onCounterPropose={() => {}}
                  onRequestConciliation={() => {}}
                  activeRole={activeRole}
                  highlight="processing"
                />
              ))}
            </div>
          )}

          {/* ── BACKLOG Section ── */}
          {backlogClauses.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 px-1">
                BACKLOG ({backlogClauses.length})
              </div>
              {backlogClauses.map((clause) => (
                <ClauseCard
                  key={clause.id}
                  clause={clause}
                  isSelected={selectedClauseId === clause.id}
                  isEditing={editingId === clause.id}
                  editValue={editValue}
                  setEditValue={setEditValue}
                  onSelect={() => setSelectedClause(clause.id)}
                  onStartEdit={(e) => startEdit(e, clause.id, clause.currentText)}
                  onSaveEdit={(e) => saveEdit(e, clause.id)}
                  onCancelEdit={() => setEditingId(null)}
                  onAccept={(e) => handleAccept(e, clause.id)}
                  onRemove={(e) => handleRemove(e, clause.id)}
                  onNotifySales={(e) => handleNotifySales(e, clause)}
                  onCounterPropose={(e) => handleCounterPropose(e, clause.id, clause.currentText)}
                  onRequestConciliation={(e) => handleRequestConciliation(e, clause.id)}
                  activeRole={activeRole}
                  highlight="backlog"
                />
              ))}
            </div>
          )}

          {/* ── RESOLVED Section ── */}
          {resolvedClauses.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 px-1">
                <CheckCircle2 className="w-4 h-4" />
                RESOLVED ({resolvedClauses.length})
              </div>
              {resolvedClauses.map((clause) => (
                <ClauseCard
                  key={clause.id}
                  clause={clause}
                  isSelected={selectedClauseId === clause.id}
                  isEditing={false}
                  editValue=""
                  setEditValue={() => {}}
                  onSelect={() => setSelectedClause(clause.id)}
                  onStartEdit={() => {}}
                  onSaveEdit={() => {}}
                  onCancelEdit={() => {}}
                  onAccept={() => {}}
                  onRemove={() => {}}
                  onNotifySales={() => {}}
                  onCounterPropose={() => {}}
                  onRequestConciliation={() => {}}
                  activeRole={activeRole}
                  highlight="resolved"
                />
              ))}
            </div>
          )}

          {/* ── Add New Clause ── */}
          {!isSales && (
            <Button 
              variant="outline" 
              className="w-full border-dashed border-2 h-14 text-muted-foreground hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
              onClick={() => {
                addClause(activeDocumentId);
                toast.success("New Clause Added", { description: "A draft clause has been appended." });
              }}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Clause
            </Button>
          )}
        </div>
      </ScrollArea>
      
      <ConciliatorDialog open={conciliatorOpen} onOpenChange={setConciliatorOpen} />
    </div>
  );
}

// ── ClauseCard Component ──
interface ClauseCardProps {
  clause: Clause;
  isSelected: boolean;
  isEditing: boolean;
  editValue: string;
  setEditValue: (val: string) => void;
  onSelect: () => void;
  onStartEdit: (e: React.MouseEvent) => void;
  onSaveEdit: (e: React.MouseEvent) => void;
  onCancelEdit: () => void;
  onAccept: (e: React.MouseEvent) => void;
  onRemove: (e: React.MouseEvent) => void;
  onNotifySales: (e: React.MouseEvent) => void;
  onCounterPropose: (e: React.MouseEvent) => void;
  onRequestConciliation: (e: React.MouseEvent) => void;
  activeRole: string;
  highlight: 'action' | 'waiting' | 'processing' | 'backlog' | 'resolved';
}

function ClauseCard({
  clause, isSelected, isEditing, editValue, setEditValue,
  onSelect, onStartEdit, onSaveEdit, onCancelEdit, onAccept, onRemove,
  onNotifySales, onCounterPropose, onRequestConciliation,
  activeRole, highlight
}: ClauseCardProps) {
  const isSales = activeRole === 'sales';
  const isVendor = activeRole === 'vendor';
  const isClient = activeRole === 'client';
  const isResolved = clause.status === 'resolved';
  const isProcessing = clause.status === 'pending-conciliation';
  const isActionable = highlight === 'action' || highlight === 'backlog';

  const borderColor = () => {
    if (isSelected) return 'border-primary shadow-md scale-[1.01]';
    switch (highlight) {
      case 'action': return 'border-amber-300 bg-amber-50/30 hover:border-amber-400';
      case 'waiting': return 'border-slate-200 bg-slate-50/50 opacity-70';
      case 'processing': return 'border-indigo-300 bg-indigo-50/30 animate-pulse';
      case 'resolved': return 'border-emerald-200 bg-emerald-50/20 opacity-80';
      default: return 'border-border hover:border-primary/50';
    }
  };

  // Can this role edit this clause?
  const canEdit = !isSales && !isResolved && !isProcessing && isActionable;
  const canAccept = !isSales && !isResolved && !isProcessing && clause.status !== 'backlog';
  const canRemove = !isSales && !isResolved && !isProcessing;
  const canCounterPropose = !isSales && !isResolved && !isProcessing && isActionable && (
    (isClient && clause.status === 'vendor-modified') ||
    (isVendor && clause.status === 'client-modified') ||
    clause.status === 'disputed'
  );
  const canConciliate = !isSales && !isResolved && !isProcessing && (
    clause.status === 'disputed' ||
    clause.status === 'vendor-modified' ||
    clause.status === 'client-modified'
  );
  const canNotifySales = isVendor && !isResolved;

  return (
    <Card 
      id={`card-clause-${clause.id}`}
      onClick={onSelect}
      className={cn(
        "cursor-pointer transition-all border-2 duration-200 group relative",
        borderColor(),
        isSelected ? "bg-card" : "bg-card/80 hover:bg-card"
      )}
    >
      {/* Remove button */}
      {canRemove && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-red-100 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity border border-red-200 hover:bg-red-200 z-10"
          onClick={onRemove}
          title="Remove Clause"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}

      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-md font-bold flex items-center gap-2">
            {isProcessing && <Lock className="w-4 h-4 text-indigo-500" />}
            {clause.title}
          </CardTitle>
          <div className="flex items-center gap-1.5 shrink-0">
            <StatusBadge status={clause.status} lastModifiedBy={clause.lastModifiedBy} activeRole={activeRole} />
          </div>
        </div>

        {/* Turn Indicator */}
        {highlight === 'action' && !isSales && (
          <div className="mt-1.5 text-xs font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full w-fit flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Your turn to respond
          </div>
        )}
        {highlight === 'waiting' && !isSales && (
          <div className="mt-1.5 text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full w-fit flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Awaiting {clause.lastModifiedBy === 'vendor' ? 'client' : 'vendor'} response
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        {isEditing ? (
          <div className="space-y-3" onClick={e => e.stopPropagation()}>
            <Textarea 
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="min-h-[100px] font-serif text-sm"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={onCancelEdit}>
                <X className="w-4 h-4 mr-2" /> Cancel
              </Button>
              <Button size="sm" onClick={onSaveEdit}>
                <Check className="w-4 h-4 mr-2" /> Save Edit
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground line-clamp-3 font-serif">
            {clause.currentText}
          </p>
        )}
      </CardContent>

      {/* Footer Actions — only for non-editing, non-sales */}
      {!isEditing && !isSales && (
        <CardFooter className="p-4 pt-0 flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {/* Discuss */}
            <Button 
              variant="ghost" size="sm" 
              className="h-8 px-2 text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                toast.info(`Discussion: ${clause.title}`, { description: "Thread opened. (Mock)" });
              }}
            >
              <MessageSquare className="w-4 h-4 mr-1.5" /> Discuss
            </Button>

            {/* Edit (when it's my turn or backlog) */}
            {canEdit && (
              <Button 
                variant="ghost" size="sm" 
                className="h-8 px-2 text-muted-foreground hover:text-foreground"
                onClick={onStartEdit}
              >
                <Edit3 className="w-4 h-4 mr-1.5" /> 
                {clause.status === 'backlog' ? 'Propose Edit' : 'Re-Edit'}
              </Button>
            )}

            {/* Notify Sales (Vendor only) */}
            {canNotifySales && (
              <Button 
                variant="ghost" size="sm" 
                className="h-8 px-2 text-muted-foreground hover:text-amber-600"
                onClick={onNotifySales}
              >
                <Bell className="w-4 h-4 mr-1.5" /> Notify Sales
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Accept */}
            {canAccept && (
              <Button 
                size="sm" variant="outline"
                className="h-8 border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                onClick={onAccept}
              >
                <CheckCircle2 className="w-4 h-4 mr-1" /> Accept
              </Button>
            )}

            {/* Counter-Propose */}
            {canCounterPropose && (
              <Button 
                size="sm" variant="secondary"
                className="h-8 bg-blue-100 text-blue-700 hover:bg-blue-200"
                onClick={onCounterPropose}
              >
                <ArrowRightLeft className="w-4 h-4 mr-1" /> Counter-Propose
              </Button>
            )}

            {/* AI Conciliate */}
            {canConciliate && (
              <Button 
                size="sm"
                className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all hover:scale-105"
                onClick={onRequestConciliation}
              >
                <Bot className="w-4 h-4 mr-1.5" /> AI Conciliate
              </Button>
            )}
          </div>
        </CardFooter>
      )}

      {/* Sales read-only footer */}
      {isSales && (
        <CardFooter className="p-4 pt-0">
          <div className="w-full flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3" /> Read-only view
            </span>
            <StatusBadge status={clause.status} lastModifiedBy={clause.lastModifiedBy} activeRole={activeRole} />
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

// ── Status Badge with context-aware labels ──
function StatusBadge({ status, lastModifiedBy, activeRole }: { 
  status: ClauseStatus; 
  lastModifiedBy: 'vendor' | 'client' | null;
  activeRole: string;
}) {
  switch (status) {
    case 'resolved':
      return (
        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm">
          <CheckCircle2 className="w-3 h-3 mr-1"/> Resolved
        </Badge>
      );
    case 'vendor-modified':
      return (
        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm">
          <Edit3 className="w-3 h-3 mr-1"/> 
          {activeRole === 'vendor' ? 'You Proposed' : 'Vendor Proposed'}
        </Badge>
      );
    case 'client-modified':
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-700 border border-blue-200 shadow-sm">
          <Edit3 className="w-3 h-3 mr-1"/> 
          {activeRole === 'client' ? 'You Proposed' : 'Client Proposed'}
        </Badge>
      );
    case 'disputed':
      return (
        <Badge variant="secondary" className="bg-red-100 text-red-700 border border-red-200 shadow-sm animate-pulse">
          <ShieldAlert className="w-3 h-3 mr-1"/> Disputed
        </Badge>
      );
    case 'pending-conciliation':
      return (
        <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 border border-indigo-200 shadow-sm animate-pulse">
          <Bot className="w-3 h-3 mr-1"/> Conciliating
        </Badge>
      );
    default:
      return <Badge variant="outline" className="text-slate-500 bg-slate-50">Backlog</Badge>;
  }
}
