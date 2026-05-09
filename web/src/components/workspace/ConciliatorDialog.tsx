"use client";

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { MOCK_CONCILIATOR_RESPONSE, PLAYBOOKS } from '@/lib/mock-data';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Bot, Sparkles, AlertTriangle, FileText, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConciliatorDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { activeDocumentId, selectedClauseId, updateClauseStatus, updateClauseText, activeRole } = useStore();
  const [processing, setProcessing] = useState(true);
  const [accepted, setAccepted] = useState(false);
  
  useEffect(() => {
    if (open) {
      setProcessing(true);
      setAccepted(false);
      // Simulate AI thinking time
      const timer = setTimeout(() => {
        setProcessing(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleAccept = () => {
    if (selectedClauseId) {
      updateClauseStatus(activeDocumentId, selectedClauseId, 'resolved');
      updateClauseText(activeDocumentId, selectedClauseId, MOCK_CONCILIATOR_RESPONSE.proposedText);
      setAccepted(true);
      setTimeout(() => {
        onOpenChange(false);
      }, 1500);
    }
  };

  const handleReject = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] border-indigo-200 shadow-xl shadow-indigo-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-indigo-700">
            <Bot className="w-5 h-5" />
            AI Conciliator Proposal
          </DialogTitle>
          <DialogDescription>
            Analyzing playbooks and generating an industry-standard compromise.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-[300px] relative mt-4">
          <AnimatePresence mode="wait">
            {processing ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center space-y-4"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 rounded-full animate-pulse" />
                  <Bot className="w-16 h-16 text-indigo-600 animate-bounce" />
                </div>
                <div className="flex flex-col items-center gap-2 text-center text-indigo-600">
                  <p className="font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Cross-referencing {PLAYBOOKS.client.name} & {PLAYBOOKS.vendor.name} playbooks...
                  </p>
                  <p className="text-sm opacity-70">Synthesizing equitable resolution.</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-slate-50 p-4 rounded-lg border">
                  <h4 className="text-sm font-semibold mb-2 text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <FileText className="w-4 h-4" /> Proposed Compromise
                  </h4>
                  <div className="font-serif text-base leading-relaxed bg-white p-4 rounded border shadow-sm">
                    {/* Simplified diff view for the hackathon mock */}
                    The Parties acknowledge that a breach of this Agreement may cause irreparable harm for which monetary damages may be an inadequate remedy. Accordingly, in addition to any other remedies available at law or in equity, the Disclosing Party shall be entitled to seek equitable relief, including injunctive relief<span className="bg-red-100 text-red-800 line-through px-1 rounded mx-1">{MOCK_CONCILIATOR_RESPONSE.diff.deleted}</span><span className="bg-green-100 text-green-800 px-1 rounded mx-1">{MOCK_CONCILIATOR_RESPONSE.diff.added}</span>.
                  </div>
                </div>

                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                  <h4 className="text-sm font-semibold mb-2 text-indigo-700 uppercase tracking-wider flex items-center gap-1">
                    <Bot className="w-4 h-4" /> AI Rationale
                  </h4>
                  <p className="text-sm text-indigo-900 leading-relaxed">
                    {MOCK_CONCILIATOR_RESPONSE.rationale}
                  </p>
                </div>
                
                {accepted && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 bg-emerald-50 text-emerald-700 rounded border border-emerald-200 flex items-center gap-2 font-medium"
                  >
                    <Check className="w-5 h-5 text-emerald-600" />
                    Compromise accepted! Updating document...
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!processing && !accepted && (
          <DialogFooter className="mt-6 border-t pt-4">
            <Button variant="outline" onClick={handleReject}>Reject</Button>
            <Button onClick={handleAccept} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
              <Check className="w-4 h-4 mr-2" />
              Accept Compromise
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
