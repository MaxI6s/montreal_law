"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_DOCUMENTS } from "@/lib/mock-data";
import { useStore } from "@/store/useStore";
import { FolderOpen, ArrowRight, Shield, FileText, AlertTriangle, CheckCircle2, Clock, Bot } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export default function WorkspaceDashboard() {
  const { clauses, activeTenant, activeRole } = useStore();
  const router = useRouter();

  // Redirect sales to their dashboard
  useEffect(() => {
    if (activeRole === 'sales') {
      router.push('/sales');
    }
  }, [activeRole, router]);

  const getDocSummary = (docId: string) => {
    const docClauses = clauses[docId] || [];
    const resolved = docClauses.filter(c => c.status === 'resolved').length;
    const disputed = docClauses.filter(c => c.status === 'disputed').length;
    const pending = docClauses.filter(c => c.status === 'pending-conciliation').length;
    const actionNeeded = docClauses.filter(c => {
      if (c.status === 'vendor-modified') return activeRole === 'client';
      if (c.status === 'client-modified') return activeRole === 'vendor';
      if (c.status === 'disputed') return true;
      if (c.status === 'backlog') return true;
      return false;
    }).length;

    return { 
      total: docClauses.length, resolved, disputed, pending, actionNeeded,
      progress: docClauses.length ? Math.round((resolved / docClauses.length) * 100) : 0
    };
  };

  const getStatusBadge = (docId: string) => {
    const summary = getDocSummary(docId);
    if (summary.disputed > 0) return { label: 'Disputes Active', variant: 'destructive' as const, icon: AlertTriangle };
    if (summary.pending > 0) return { label: 'AI Processing', variant: 'secondary' as const, icon: Bot };
    if (summary.actionNeeded > 0) return { label: 'Action Required', variant: 'secondary' as const, icon: Clock };
    if (summary.resolved === summary.total) return { label: 'All Resolved', variant: 'secondary' as const, icon: CheckCircle2 };
    return { label: 'In Progress', variant: 'secondary' as const, icon: Clock };
  };

  if (activeRole === 'sales') return null;

  const roleLabel = activeRole === 'vendor' ? 'Vendor' : 'Client';
  const roleColor = activeRole === 'vendor' ? 'text-emerald-600' : 'text-blue-600';

  return (
    <div className="container mx-auto p-8 h-[calc(100vh-56px)] overflow-auto bg-slate-50/50">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <Shield className={cn("w-8 h-8", roleColor)} />
            {activeTenant} <span className="text-lg font-normal text-muted-foreground ml-2">— {roleLabel} Legal Workspace</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Select a contract to enter the negotiation engine.
          </p>
        </div>
        <Badge variant="outline" className="text-sm px-4 py-1.5 bg-white">
          <div className={cn("h-2.5 w-2.5 rounded-full mr-2", activeRole === 'vendor' ? 'bg-emerald-500' : 'bg-blue-500')} />
          {roleLabel} Legal View
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MOCK_DOCUMENTS.map((doc) => {
          const summary = getDocSummary(doc.id);
          const statusBadge = getStatusBadge(doc.id);
          const StatusIcon = statusBadge.icon;
          
          return (
            <Card key={doc.id} className="hover:shadow-lg transition-all border-2 hover:border-indigo-200 relative overflow-hidden group">
              {/* Progress indicator bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100">
                <div 
                  className={cn("h-1 transition-all", summary.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500')}
                  style={{ width: `${summary.progress}%` }}
                />
              </div>

              <CardHeader className="pb-4 border-b bg-slate-50/50 pt-5">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-500" />
                    <CardTitle className="text-xl">{doc.title}</CardTitle>
                  </div>
                </div>
                <CardDescription className="mt-2 text-base">
                  <span className="font-semibold text-slate-700">{doc.parties.client}</span> & <span className="font-semibold text-slate-700">{doc.parties.vendor}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-500 text-sm font-medium">Type</span>
                  <Badge variant="outline" className="font-mono bg-white">{doc.type}</Badge>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-500 text-sm font-medium">Progress</span>
                  <span className="text-sm font-semibold">{summary.resolved}/{summary.total} resolved</span>
                </div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-slate-500 text-sm font-medium">Status</span>
                  <Badge variant={statusBadge.variant} className="font-medium">
                    <StatusIcon className="w-3 h-3 mr-1" /> {statusBadge.label}
                  </Badge>
                </div>
                
                {summary.actionNeeded > 0 && (
                  <div className="mb-4 p-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700 font-medium flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {summary.actionNeeded} clause{summary.actionNeeded > 1 ? 's' : ''} need your attention
                  </div>
                )}

                <Link href={`/workspace/${doc.id}`} className="w-full block">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white group/btn">
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Open Contract
                    <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
