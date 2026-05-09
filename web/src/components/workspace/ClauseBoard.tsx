"use client";

import { useStore } from '@/store/useStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageSquare, CheckCircle2, AlertCircle, Bot, Edit3, X, Check, 
  Bell, Trash2, Plus, ArrowRightLeft, Clock, ShieldAlert, Lock,
  FileDown, PartyPopper, ChevronDown, ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import ConciliatorDialog from './ConciliatorDialog';
import DiscussionThread from './DiscussionThread';
import { toast } from 'sonner';
import { Clause, ClauseStatus } from '@/lib/mock-data';

export default function ClauseBoard() {
  const { 
    activeDocumentId, clauses, selectedClauseId, setSelectedClause, 
    updateClauseText, updateClauseStatus, activeRole, addClause, removeClause,
    addNotification, signedOff, executeSignOff, comments
  } = useStore();
  
  const currentClauses = clauses[activeDocumentId] || [];
  
  const [conciliatorOpen, setConciliatorOpen] = useState(false);
  const [conciliatorClauseId, setConciliatorClauseId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [openDiscussions, setOpenDiscussions] = useState<Set<string>>(new Set());

  const isSales = activeRole === 'sales';
  const isVendor = activeRole === 'vendor';
  const isClient = activeRole === 'client';
  const allResolved = currentClauses.length > 0 && currentClauses.every(c => c.status === 'resolved');
  const isDocSignedOff = signedOff[activeDocumentId] || false;

  const toggleDiscussion = (clauseId: string) => {
    setOpenDiscussions(prev => {
      const next = new Set(prev);
      if (next.has(clauseId)) next.delete(clauseId);
      else next.add(clauseId);
      return next;
    });
  };

  const isMyTurn = (clause: Clause): boolean => {
    if (clause.status === 'backlog') return true;
    if (clause.status === 'vendor-modified') return isClient;
    if (clause.status === 'client-modified') return isVendor;
    if (clause.status === 'disputed') return true;
    return false;
  };

  const isWaiting = (clause: Clause): boolean => {
    if (clause.status === 'vendor-modified') return isVendor;
    if (clause.status === 'client-modified') return isClient;
    return false;
  };

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
    toast.success("Edit Recorded", { description: `${label} has proposed changes. Awaiting opposing counsel's response.` });
  };

  const handleAccept = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    updateClauseStatus(activeDocumentId, id, 'resolved');
    toast.success("Clause Accepted ✓", { description: `${isVendor ? 'Vendor' : 'Client'} Legal has accepted this clause language.` });
  };

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    removeClause(activeDocumentId, id);
    toast.success("Clause Removed", { description: "The clause has been stricken from the record." });
  };

  const handleNotifySales = (e: React.MouseEvent, clause: Clause) => {
    e.stopPropagation();
    addNotification({
      type: 'urgent', from: 'Sarah Chen (Vendor Legal)',
      message: `Clause "${clause.title}" requires attention — ${clause.status === 'disputed' ? 'actively disputed with opposing counsel' : 'under active negotiation'}.`,
      clauseTitle: clause.title, documentId: activeDocumentId,
    });
    toast.warning("Sales Team Notified", { description: "An urgent notification has been sent to the Vendor Sales dashboard." });
  };

  const handleCounterPropose = (e: React.MouseEvent, id: string, currentText: string) => {
    e.stopPropagation();
    startEdit(e, id, currentText);
    toast.info("Counter-Proposal Mode", { description: "Edit the clause text and save to send your counter-proposal." });
  };

  const handleRequestConciliation = (e: React.MouseEvent, clauseId: string) => {
    e.stopPropagation();
    setSelectedClause(clauseId);
    setConciliatorClauseId(clauseId);
    setConciliatorOpen(true);
  };

  const handleSignOff = () => {
    executeSignOff(activeDocumentId);
    toast.success("🎉 Mutual Sign-Off Executed!", { description: "Both parties have agreed. The document is now frozen for export.", duration: 5000 });
  };

  const actionRequired = currentClauses.filter(c => isMyTurn(c) && c.status !== 'backlog' && c.status !== 'resolved');
  const backlogClauses = currentClauses.filter(c => c.status === 'backlog');
  const waitingClauses = currentClauses.filter(c => isWaiting(c));
  const processingClauses = currentClauses.filter(c => c.status === 'pending-conciliation');
  const resolvedClauses = currentClauses.filter(c => c.status === 'resolved');

  const accentColor = isVendor ? 'emerald' : isClient ? 'blue' : 'amber';

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] bg-slate-50/50 overflow-hidden">
      <div className="p-4 border-b bg-background flex items-center justify-between shadow-sm z-10 shrink-0">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          Clause Analysis
          <Badge variant="secondary" className="font-mono text-xs">{currentClauses.length}</Badge>
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

          {/* Sign-Off Banner */}
          {allResolved && !isSales && (
            <div className={cn(
              "rounded-xl border-2 p-5 text-center space-y-3 transition-all",
              isDocSignedOff
                ? "bg-emerald-50 border-emerald-300"
                : "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200"
            )}>
              {isDocSignedOff ? (
                <>
                  <PartyPopper className="w-10 h-10 mx-auto text-emerald-600" />
                  <h3 className="text-lg font-bold text-emerald-800">Document Signed Off ✓</h3>
                  <p className="text-sm text-emerald-700">Both parties have agreed. The document state is frozen.</p>
                  <Button variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-100" onClick={(e) => { e.stopPropagation(); toast.info("Export Mock", { description: "In production, this would download the final .docx file." }); }}>
                    <FileDown className="w-4 h-4 mr-2" /> Download Final .docx
                  </Button>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-10 h-10 mx-auto text-indigo-600" />
                  <h3 className="text-lg font-bold text-indigo-800">All {currentClauses.length} Clauses Resolved</h3>
                  <p className="text-sm text-indigo-700">Ready for mutual sign-off and final export.</p>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg" onClick={handleSignOff}>
                    Execute Mutual Sign-Off
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Clause sections */}
          {[
            { items: actionRequired, label: 'ACTION REQUIRED', icon: AlertCircle, color: `text-${accentColor}-700`, show: !isSales },
            { items: waitingClauses, label: 'AWAITING RESPONSE', icon: Clock, color: 'text-slate-400', show: !isSales },
            { items: processingClauses, label: 'AI CONCILIATION', icon: Bot, color: 'text-indigo-600', show: true },
            { items: backlogClauses, label: 'BACKLOG', icon: null, color: 'text-slate-500', show: true },
            { items: resolvedClauses, label: 'RESOLVED', icon: CheckCircle2, color: 'text-emerald-600', show: true },
          ].map(({ items, label, icon: Icon, color, show }) => {
            if (!show || items.length === 0) return null;
            const highlight = label === 'ACTION REQUIRED' ? 'action' : label === 'AWAITING RESPONSE' ? 'waiting' : label === 'AI CONCILIATION' ? 'processing' : label === 'RESOLVED' ? 'resolved' : 'backlog';
            return (
              <div key={label} className="space-y-3">
                <div className={cn("flex items-center gap-2 text-sm font-semibold px-1", color)}>
                  {Icon && <Icon className={cn("w-4 h-4", label === 'AI CONCILIATION' && "animate-pulse")} />}
                  {label} ({items.length})
                </div>
                {items.map((clause) => (
                  <ClauseCard
                    key={clause.id} clause={clause}
                    isSelected={selectedClauseId === clause.id}
                    isEditing={editingId === clause.id}
                    editValue={editValue} setEditValue={setEditValue}
                    onSelect={() => setSelectedClause(clause.id)}
                    onStartEdit={(e) => startEdit(e, clause.id, clause.currentText)}
                    onSaveEdit={(e) => saveEdit(e, clause.id)}
                    onCancelEdit={() => setEditingId(null)}
                    onAccept={(e) => handleAccept(e, clause.id)}
                    onRemove={(e) => handleRemove(e, clause.id)}
                    onNotifySales={(e) => handleNotifySales(e, clause)}
                    onCounterPropose={(e) => handleCounterPropose(e, clause.id, clause.currentText)}
                    onRequestConciliation={(e) => handleRequestConciliation(e, clause.id)}
                    onToggleDiscussion={() => toggleDiscussion(clause.id)}
                    activeRole={activeRole} highlight={highlight}
                    isDiscussionOpen={openDiscussions.has(clause.id)}
                    commentCount={(comments[clause.id] || []).length}
                    accentColor={accentColor}
                  />
                ))}
              </div>
            );
          })}

          {!isSales && !isDocSignedOff && (
            <Button variant="outline" className="w-full border-dashed border-2 h-14 text-muted-foreground hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
              onClick={() => { addClause(activeDocumentId); toast.success("New Clause Added", { description: "A draft clause has been appended." }); }}>
              <Plus className="w-5 h-5 mr-2" /> Add New Clause
            </Button>
          )}
        </div>
      </ScrollArea>
      
      <ConciliatorDialog open={conciliatorOpen} onOpenChange={setConciliatorOpen} targetClauseId={conciliatorClauseId} />
    </div>
  );
}

// ── ClauseCard Component ──
interface ClauseCardProps {
  clause: Clause; isSelected: boolean; isEditing: boolean;
  editValue: string; setEditValue: (val: string) => void;
  onSelect: () => void; onStartEdit: (e: React.MouseEvent) => void;
  onSaveEdit: (e: React.MouseEvent) => void; onCancelEdit: () => void;
  onAccept: (e: React.MouseEvent) => void; onRemove: (e: React.MouseEvent) => void;
  onNotifySales: (e: React.MouseEvent) => void; onCounterPropose: (e: React.MouseEvent) => void;
  onRequestConciliation: (e: React.MouseEvent) => void; onToggleDiscussion: () => void;
  activeRole: string; highlight: 'action' | 'waiting' | 'processing' | 'backlog' | 'resolved';
  isDiscussionOpen: boolean; commentCount: number; accentColor: string;
}

function ClauseCard({
  clause, isSelected, isEditing, editValue, setEditValue,
  onSelect, onStartEdit, onSaveEdit, onCancelEdit, onAccept, onRemove,
  onNotifySales, onCounterPropose, onRequestConciliation, onToggleDiscussion,
  activeRole, highlight, isDiscussionOpen, commentCount, accentColor
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
      case 'action': return `border-${accentColor}-300 bg-${accentColor}-50/30 hover:border-${accentColor}-400`;
      case 'waiting': return 'border-slate-200 bg-slate-50/50 opacity-70';
      case 'processing': return 'border-indigo-300 bg-indigo-50/30 animate-pulse';
      case 'resolved': return 'border-emerald-200 bg-emerald-50/20 opacity-80';
      default: return 'border-border hover:border-primary/50';
    }
  };

  const canEdit = !isSales && !isResolved && !isProcessing && isActionable;
  const canAccept = !isSales && !isResolved && !isProcessing && clause.status !== 'backlog';
  const canRemove = !isSales && !isResolved && !isProcessing;
  const canCounterPropose = !isSales && !isResolved && !isProcessing && isActionable && (
    (isClient && clause.status === 'vendor-modified') ||
    (isVendor && clause.status === 'client-modified') ||
    clause.status === 'disputed'
  );
  const canConciliate = !isSales && !isResolved && !isProcessing && (
    clause.status === 'disputed' || clause.status === 'vendor-modified' || clause.status === 'client-modified'
  );
  const canNotifySales = isVendor && !isResolved;

  return (
    <Card id={`card-clause-${clause.id}`} onClick={onSelect}
      className={cn("cursor-pointer transition-all border-2 duration-200 group relative", borderColor(), isSelected ? "bg-card" : "bg-card/80 hover:bg-card")}>
      {canRemove && (
        <Button variant="ghost" size="icon"
          className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-red-100 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity border border-red-200 hover:bg-red-200 z-10"
          onClick={onRemove} title="Remove Clause">
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
        {highlight === 'action' && !isSales && (
          <div className={cn("mt-1.5 text-xs font-medium px-2 py-0.5 rounded-full w-fit flex items-center gap-1",
            isVendor ? "text-emerald-700 bg-emerald-100" : "text-blue-700 bg-blue-100"
          )}>
            <AlertCircle className="w-3 h-3" /> Your turn to respond
          </div>
        )}
        {highlight === 'waiting' && !isSales && (
          <div className="mt-1.5 text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full w-fit flex items-center gap-1">
            <Clock className="w-3 h-3" /> Awaiting {clause.lastModifiedBy === 'vendor' ? 'client' : 'vendor'} response
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        {isEditing ? (
          <div className="space-y-3" onClick={e => e.stopPropagation()}>
            <Textarea value={editValue} onChange={(e) => setEditValue(e.target.value)} className="min-h-[100px] font-serif text-sm" autoFocus />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={onCancelEdit}><X className="w-4 h-4 mr-2" /> Cancel</Button>
              <Button size="sm" onClick={onSaveEdit}><Check className="w-4 h-4 mr-2" /> Save Edit</Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground line-clamp-3 font-serif">{clause.currentText}</p>
        )}

        {/* Discussion Thread */}
        {isDiscussionOpen && <DiscussionThread clauseId={clause.id} />}
      </CardContent>

      {!isEditing && !isSales && (
        <CardFooter className="p-4 pt-0 flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-foreground" onClick={(e) => { e.stopPropagation(); onToggleDiscussion(); }}>
              <MessageSquare className="w-4 h-4 mr-1.5" />
              {commentCount > 0 ? `${commentCount}` : 'Discuss'}
              {isDiscussionOpen ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
            </Button>
            {canEdit && (
              <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-foreground" onClick={onStartEdit}>
                <Edit3 className="w-4 h-4 mr-1.5" /> {clause.status === 'backlog' ? 'Propose Edit' : 'Re-Edit'}
              </Button>
            )}
            {canNotifySales && (
              <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-amber-600" onClick={onNotifySales}>
                <Bell className="w-4 h-4 mr-1.5" /> Notify Sales
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {canAccept && (
              <Button size="sm" variant="outline" className="h-8 border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100" onClick={onAccept}>
                <CheckCircle2 className="w-4 h-4 mr-1" /> Accept
              </Button>
            )}
            {canCounterPropose && (
              <Button size="sm" variant="secondary" className={cn("h-8", isVendor ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-blue-100 text-blue-700 hover:bg-blue-200")} onClick={onCounterPropose}>
                <ArrowRightLeft className="w-4 h-4 mr-1" /> Counter-Propose
              </Button>
            )}
            {canConciliate && (
              <Button size="sm" className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all hover:scale-105" onClick={onRequestConciliation}>
                <Bot className="w-4 h-4 mr-1.5" /> AI Conciliate
              </Button>
            )}
          </div>
        </CardFooter>
      )}
      {isSales && (
        <CardFooter className="p-4 pt-0">
          <div className="w-full flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Read-only view</span>
            <StatusBadge status={clause.status} lastModifiedBy={clause.lastModifiedBy} activeRole={activeRole} />
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

function StatusBadge({ status, lastModifiedBy, activeRole }: { status: ClauseStatus; lastModifiedBy: 'vendor' | 'client' | null; activeRole: string; }) {
  switch (status) {
    case 'resolved': return <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm"><CheckCircle2 className="w-3 h-3 mr-1"/> Resolved</Badge>;
    case 'vendor-modified': return <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm"><Edit3 className="w-3 h-3 mr-1"/> {activeRole === 'vendor' ? 'You Proposed' : 'Vendor Proposed'}</Badge>;
    case 'client-modified': return <Badge variant="secondary" className="bg-blue-100 text-blue-700 border border-blue-200 shadow-sm"><Edit3 className="w-3 h-3 mr-1"/> {activeRole === 'client' ? 'You Proposed' : 'Client Proposed'}</Badge>;
    case 'disputed': return <Badge variant="secondary" className="bg-red-100 text-red-700 border border-red-200 shadow-sm animate-pulse"><ShieldAlert className="w-3 h-3 mr-1"/> Disputed</Badge>;
    case 'pending-conciliation': return <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 border border-indigo-200 shadow-sm animate-pulse"><Bot className="w-3 h-3 mr-1"/> Conciliating</Badge>;
    default: return <Badge variant="outline" className="text-slate-500 bg-slate-50">Backlog</Badge>;
  }
}
