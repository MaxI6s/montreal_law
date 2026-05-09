"use client";

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { MOCK_CONCILIATOR_RESPONSE, MOCK_MSA_CONCILIATOR_RESPONSE, MOCK_IMPASSE_RESPONSE, MOCK_OVERRIDE_RESPONSE, MOCK_OBLIGATIONS_RESPONSE, MOCK_IP_RESPONSE, PLAYBOOKS } from '@/lib/mock-data';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Sparkles, AlertTriangle, FileText, Check, ShieldAlert, Unlock, Edit3, FileBarChart, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface ConciliatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetClauseId?: string | null;
}

export default function ConciliatorDialog({ open, onOpenChange, targetClauseId }: ConciliatorDialogProps) {
  const { activeDocumentId, selectedClauseId, updateClauseStatus, updateClauseText, clauses } = useStore();
  const [processing, setProcessing] = useState(true);
  const [accepted, setAccepted] = useState(false);
  const [isImpasse, setIsImpasse] = useState(false);
  const [overrideTriggered, setOverrideTriggered] = useState(false);
  const [overrideProcessing, setOverrideProcessing] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [customText, setCustomText] = useState("");
  const [showExecutiveSummary, setShowExecutiveSummary] = useState(false);
  
  const effectiveClauseId = targetClauseId || selectedClauseId;

  // Determine which clause we're conciliating to pick the right response
  const currentClauses = clauses[activeDocumentId] || [];
  const targetClause = currentClauses.find(c => c.id === effectiveClauseId);
  const titleLower = targetClause?.title?.toLowerCase() || '';
  const isTerminationClause = titleLower.includes('termination');
  const isMSALiability = titleLower.includes('liability');
  const isObligations = titleLower.includes('obligations') || titleLower.includes('confidential information');
  const isIP = titleLower.includes('intellectual property');
  
  useEffect(() => {
    if (open) {
      setProcessing(true);
      setAccepted(false);
      setIsImpasse(false);
      setOverrideTriggered(false);
      setOverrideProcessing(false);
      setEditMode(false);
      const timer = setTimeout(() => {
        setProcessing(false);
        // Termination clause triggers impasse
        if (isTerminationClause) setIsImpasse(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [open, isTerminationClause]);

  // Pick the right mock response
  let response = MOCK_CONCILIATOR_RESPONSE; // fallback (usually remedies)
  if (isMSALiability) response = MOCK_MSA_CONCILIATOR_RESPONSE;
  else if (isObligations) response = MOCK_OBLIGATIONS_RESPONSE;
  else if (isIP) response = MOCK_IP_RESPONSE;

  const overrideResponse = MOCK_OVERRIDE_RESPONSE;

  // Initialize custom text when response is determined
  useEffect(() => {
    if (!processing && !overrideProcessing) {
      setCustomText(overrideTriggered ? overrideResponse.proposedText : response.proposedText);
    }
  }, [processing, overrideProcessing, overrideTriggered, response, overrideResponse]);

  const handleAccept = () => {
    if (effectiveClauseId) {
      updateClauseStatus(activeDocumentId, effectiveClauseId, 'resolved');
      updateClauseText(activeDocumentId, effectiveClauseId, customText);
      setAccepted(true);
      setTimeout(() => onOpenChange(false), 1500);
    }
  };

  const handleOverride = () => {
    setOverrideProcessing(true);
    setTimeout(() => {
      setOverrideProcessing(false);
      setIsImpasse(false);
      setOverrideTriggered(true);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-[700px] shadow-xl ${isImpasse ? 'border-red-200 shadow-red-100' : 'border-indigo-200 shadow-indigo-100'}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${isImpasse ? 'text-red-700' : 'text-indigo-700'}`}>
            {isImpasse ? <ShieldAlert className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            {isImpasse ? 'AI Conciliator — Impasse Detected' : 'AI Conciliator Proposal'}
          </DialogTitle>
          <DialogDescription>
            {isImpasse ? 'The playbook constraints are irreconcilable. A manual override is required.' : 'Analyzing playbooks and generating an industry-standard compromise.'}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-[300px] relative mt-4">
          <AnimatePresence mode="wait">
            {(processing || overrideProcessing) ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <div className={`absolute inset-0 ${overrideProcessing ? 'bg-amber-500' : 'bg-indigo-500'} blur-xl opacity-20 rounded-full animate-pulse`} />
                  <Bot className={`w-16 h-16 ${overrideProcessing ? 'text-amber-600' : 'text-indigo-600'} animate-bounce`} />
                </div>
                <div className="flex flex-col items-center gap-2 text-center text-indigo-600">
                  <p className="font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    {overrideProcessing ? 'Re-analyzing with relaxed constraints...' : `Cross-referencing ${PLAYBOOKS.client.name} & ${PLAYBOOKS.vendor.name} playbooks...`}
                  </p>
                  <p className="text-sm opacity-70">{overrideProcessing ? 'Generating revised proposal.' : 'Synthesizing equitable resolution.'}</p>
                </div>
              </motion.div>
            ) : isImpasse ? (
              <motion.div key="impasse" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="text-sm font-semibold mb-2 text-red-800 uppercase tracking-wider flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" /> No Compromise Possible
                  </h4>
                  <p className="text-sm text-red-900 leading-relaxed mb-3">{MOCK_IMPASSE_RESPONSE.reason}</p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-emerald-50 p-3 rounded border border-emerald-200">
                      <p className="font-bold text-emerald-800 mb-1">Vendor Constraint</p>
                      <p className="text-emerald-700">{MOCK_IMPASSE_RESPONSE.vendorConstraint}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded border border-blue-200">
                      <p className="font-bold text-blue-800 mb-1">Client Constraint</p>
                      <p className="text-blue-700">{MOCK_IMPASSE_RESPONSE.clientConstraint}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h4 className="text-sm font-semibold mb-2 text-amber-800 flex items-center gap-1"><Bot className="w-4 h-4" /> AI Analysis</h4>
                  <p className="text-sm text-amber-900 leading-relaxed">{MOCK_IMPASSE_RESPONSE.analysis}</p>
                  <p className="text-sm text-amber-800 mt-2 font-medium italic">&ldquo;{MOCK_IMPASSE_RESPONSE.suggestion}&rdquo;</p>
                </div>
                {showExecutiveSummary && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 bg-white p-5 rounded-xl border-2 border-indigo-100 shadow-sm">
                    <h3 className="text-lg font-bold text-indigo-900 mb-3 flex items-center gap-2"><FileBarChart className="w-5 h-5 text-indigo-600" /> Executive Summary</h3>
                    <div className="space-y-3 text-sm text-slate-700">
                      <p><strong>Blocking Issue:</strong> Irreconcilable requirements regarding data breach liability caps.</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-red-50 p-3 rounded border border-red-100">
                          <p className="font-semibold text-red-800">Vendor Requirement</p>
                          <p>Hard cap at 12 months fees ($120k). No exceptions for data breach.</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded border border-blue-100">
                          <p className="font-semibold text-blue-800">Client Requirement</p>
                          <p>Uncapped liability for data breach required by OSFI regulations.</p>
                        </div>
                      </div>
                      <p><strong>Recommendation:</strong> A commercial override is required. Propose exploring a "Super Cap" (e.g., 5x fees) specifically for data breach to balance risk.</p>
                      <Button 
                        className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white" 
                        onClick={() => {
                          toast.success("Meeting Scheduled", { description: "Calendar invite sent to Legal VP and Sales Lead." });
                          onOpenChange(false);
                        }}
                      >
                        <Calendar className="w-4 h-4 mr-2" /> Schedule Escalation Meeting
                      </Button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-lg border">
                  <h4 className="text-sm font-semibold mb-2 text-slate-500 uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> {overrideTriggered ? 'Revised Proposal (Post-Override)' : 'Proposed Compromise'}</span>
                    {!accepted && (
                      <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setEditMode(!editMode)}>
                        <Edit3 className="w-3 h-3 mr-1" /> {editMode ? 'View Diff' : 'Edit Proposal'}
                      </Button>
                    )}
                  </h4>
                  <div className="font-serif text-base leading-relaxed bg-white p-4 rounded border shadow-sm">
                    {editMode ? (
                      <Textarea 
                        value={customText} 
                        onChange={(e) => setCustomText(e.target.value)}
                        className="min-h-[120px] font-serif text-base"
                      />
                    ) : (
                      (() => {
                        const r = overrideTriggered ? overrideResponse : response;
                        const parts = r.proposedText.split(r.diff.added);
                        return <>{parts[0]}<span className="bg-red-100 text-red-800 line-through px-1 rounded mx-1">{r.diff.deleted}</span><span className="bg-green-100 text-green-800 px-1 rounded mx-1">{r.diff.added}</span>{parts[1] || ''}</>;
                      })()
                    )}
                  </div>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                  <h4 className="text-sm font-semibold mb-2 text-indigo-700 uppercase tracking-wider flex items-center gap-1"><Bot className="w-4 h-4" /> AI Rationale</h4>
                  <p className="text-sm text-indigo-900 leading-relaxed">{overrideTriggered ? overrideResponse.rationale : response.rationale}</p>
                </div>
                {accepted && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="p-3 bg-emerald-50 text-emerald-700 rounded border border-emerald-200 flex items-center gap-2 font-medium">
                    <Check className="w-5 h-5 text-emerald-600" /> Compromise accepted! Updating document...
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!processing && !overrideProcessing && !accepted && (
          <DialogFooter className="mt-6 border-t pt-4">
            {isImpasse ? (
              <div className="flex w-full gap-2 flex-wrap sm:flex-nowrap">
                <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">Close</Button>
                {!showExecutiveSummary && (
                  <Button variant="secondary" onClick={() => setShowExecutiveSummary(true)} className="flex-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100">
                    <FileBarChart className="w-4 h-4 mr-2" /> Executive Summary
                  </Button>
                )}
                <Button onClick={handleOverride} className="flex-[2] bg-amber-600 hover:bg-amber-700 text-white shadow-md">
                  <Unlock className="w-4 h-4 mr-2" /> Override Constraint & Re-Run
                </Button>
              </div>
            ) : (
              <>
                <Button variant="outline" onClick={() => onOpenChange(false)}>Reject</Button>
                <Button onClick={handleAccept} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
                  <Check className="w-4 h-4 mr-2" /> Accept Compromise
                </Button>
              </>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
