"use client";

import { useStore } from '@/store/useStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { Edit3, CheckCircle2, Lock } from 'lucide-react';
import { ClauseStatus, MOCK_DOCUMENTS } from '@/lib/mock-data';

export default function DocumentViewer() {
  const { activeDocumentId, clauses, selectedClauseId, setSelectedClause, activeRole } = useStore();
  const currentClauses = clauses[activeDocumentId] || [];
  const activeDoc = MOCK_DOCUMENTS.find(d => d.id === activeDocumentId);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  
  // Auto-scroll when selectedClauseId changes + trigger highlight pulse
  useEffect(() => {
    if (selectedClauseId) {
      const el = document.getElementById(`doc-clause-${selectedClauseId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightId(selectedClauseId);
        // Clear the pulse after animation completes
        const timer = setTimeout(() => setHighlightId(null), 1800);
        return () => clearTimeout(timer);
      }
    }
  }, [selectedClauseId]);

  const getStatusIndicator = (status: ClauseStatus, lastModifiedBy: 'vendor' | 'client' | null) => {
    switch (status) {
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> AGREED
          </span>
        );
      case 'vendor-modified':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <Edit3 className="w-3 h-3" /> VENDOR EDIT
          </span>
        );
      case 'client-modified':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            <Edit3 className="w-3 h-3" /> CLIENT EDIT
          </span>
        );
      case 'disputed':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200 animate-pulse">
            ⚡ DISPUTED
          </span>
        );
      case 'pending-conciliation':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200 animate-pulse">
            <Lock className="w-3 h-3" /> AI PROCESSING
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollArea className="h-full w-full p-8" ref={scrollAreaRef}>
      <div className="max-w-2xl mx-auto font-serif space-y-6 pb-32">
        {/* Document Header — data-driven */}
        <div className="text-center mb-8 pb-6 border-b border-slate-200">
          <h1 className="text-2xl font-bold font-sans text-slate-900 tracking-tight">
            {activeDoc?.title?.toUpperCase() || 'CONTRACT DOCUMENT'}
          </h1>
          <p className="text-sm text-muted-foreground mt-2 font-sans">
            Between <strong>{activeDoc?.parties.vendor || 'Party A'}</strong> and <strong>{activeDoc?.parties.client || 'Party B'}</strong>
          </p>
          <p className="text-xs text-muted-foreground mt-1 font-sans">
            Effective Date: May 9, 2026
          </p>
        </div>

        {currentClauses.map((clause) => {
          const hasChanges = clause.originalText !== clause.currentText;
          const isSelected = selectedClauseId === clause.id;
          const isPulsing = highlightId === clause.id;
          const diffColor = clause.lastModifiedBy === 'vendor' 
            ? { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700', label: 'Vendor Legal Edit' }
            : { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-700', label: 'Client Legal Edit' };

          return (
            <div 
              key={clause.id}
              id={`doc-clause-${clause.id}`}
              onClick={() => setSelectedClause(clause.id)}
              className={cn(
                "p-4 -mx-4 rounded-lg cursor-pointer transition-all border-2 duration-200",
                isSelected 
                  ? "bg-primary/5 border-primary/20 shadow-sm" 
                  : "border-transparent hover:bg-muted/50 hover:border-muted",
                clause.status === 'pending-conciliation' && "opacity-60 pointer-events-none",
                isPulsing && "ring-2 ring-indigo-400/60 ring-offset-2 animate-[highlight-pulse_1.8s_ease-out_forwards]"
              )}
            >
              {/* Clause Header */}
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-lg font-sans text-primary">{clause.title}</h3>
                {getStatusIndicator(clause.status, clause.lastModifiedBy)}
              </div>

              {/* Clause Body */}
              <div className="whitespace-pre-wrap text-base leading-relaxed">
                {hasChanges ? (
                  <div className="space-y-3">
                    {/* Original (struck through) */}
                    <div className="line-through text-red-500/70 bg-red-50 p-3 rounded border border-red-100 text-sm">
                      {clause.originalText}
                    </div>

                    {/* Proposed Edit with authorship */}
                    <div className={cn(
                      "p-3 rounded border shadow-sm relative",
                      diffColor.bg, diffColor.border, diffColor.text
                    )}>
                      <span className={cn(
                        "absolute -top-3 -right-2 text-[10px] font-bold px-2 py-0.5 rounded-full border",
                        diffColor.bg, diffColor.border, diffColor.text
                      )}>
                        {diffColor.label}
                      </span>
                      <div className="text-sm">{clause.currentText}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-foreground/90">
                    {clause.currentText}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Document Signature Block */}
        <div className="mt-16 pt-8 border-t border-slate-300">
          <div className="grid grid-cols-2 gap-8 font-sans text-sm text-muted-foreground">
            <div>
              <p className="font-semibold text-foreground mb-4">{activeDoc?.parties.vendor?.toUpperCase() || 'PARTY A'}</p>
              <div className="border-b border-slate-300 mb-1 h-8" />
              <p>Authorized Signatory</p>
              <p className="mt-2">Date: _______________</p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-4">{activeDoc?.parties.client?.toUpperCase() || 'PARTY B'}</p>
              <div className="border-b border-slate-300 mb-1 h-8" />
              <p>Authorized Signatory</p>
              <p className="mt-2">Date: _______________</p>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
