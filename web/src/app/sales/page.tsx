"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_DOCUMENTS } from "@/lib/mock-data";
import { useStore } from "@/store/useStore";
import { 
  BarChart3, Clock, CheckCircle2, ShieldAlert, Bell, BellRing, 
  X, TrendingUp, FileText, Lock, AlertTriangle, ArrowRight, Bot
} from "lucide-react";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function SalesDashboard() {
  const { clauses, notifications, markNotificationRead, dismissNotification, setActiveRole, activeRole } = useStore();

  // Auto-switch to sales role when viewing this page
  useEffect(() => {
    if (activeRole !== 'sales') {
      setActiveRole('sales');
    }
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getDocProgress = (docId: string) => {
    const docClauses = clauses[docId] || [];
    if (docClauses.length === 0) return 0;
    const resolved = docClauses.filter(c => c.status === 'resolved').length;
    return Math.round((resolved / docClauses.length) * 100);
  };

  const getClauseSummary = (docId: string) => {
    const docClauses = clauses[docId] || [];
    const resolved = docClauses.filter(c => c.status === 'resolved').length;
    const disputed = docClauses.filter(c => c.status === 'disputed').length;
    const pending = docClauses.filter(c => c.status === 'pending-conciliation').length;
    const active = docClauses.filter(c => ['vendor-modified', 'client-modified'].includes(c.status)).length;
    const backlog = docClauses.filter(c => c.status === 'backlog').length;
    return { total: docClauses.length, resolved, disputed, pending, active, backlog };
  };

  const getDealStage = (docId: string) => {
    const summary = getClauseSummary(docId);
    if (summary.resolved === summary.total) return 'ready-for-signoff';
    if (summary.disputed > 0 || summary.pending > 0) return 'at-risk';
    if (summary.active > 0) return 'active-negotiation';
    return 'early-stage';
  };

  const stageConfig = {
    'ready-for-signoff': { label: 'Ready for Sign-Off', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle2 },
    'at-risk': { label: 'At Risk — Disputes', color: 'bg-red-100 text-red-800 border-red-200', icon: AlertTriangle },
    'active-negotiation': { label: 'Active Negotiation', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: TrendingUp },
    'early-stage': { label: 'Early Stage', color: 'bg-slate-100 text-slate-800 border-slate-200', icon: Clock },
  };

  const formatTime = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ago`;
  };

  return (
    <div className="h-[calc(100vh-56px)] overflow-auto bg-slate-50/50">
      <div className="container mx-auto p-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-amber-600" />
              Vendor Sales Pipeline
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Read-only deal progress. Contact your legal team for clause-level details.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-sm px-4 py-1.5 bg-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              {MOCK_DOCUMENTS.length} Active Deals
            </Badge>
            <Badge variant="outline" className="text-sm px-4 py-1.5 bg-white">
              <Lock className="w-4 h-4 mr-2 text-slate-400" />
              Read-Only Access
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Left: Deal Cards (2 cols) ── */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
              <FileText className="w-5 h-5" /> Active Contracts
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {MOCK_DOCUMENTS.map((doc) => {
                const progress = getDocProgress(doc.id);
                const summary = getClauseSummary(doc.id);
                const stage = getDealStage(doc.id);
                const config = stageConfig[stage];
                const StageIcon = config.icon;

                return (
                  <Card key={doc.id} className="border-2 hover:shadow-lg transition-all relative overflow-hidden">
                    {/* Risk Indicator Bar */}
                    <div className={cn(
                      "absolute top-0 left-0 right-0 h-1",
                      stage === 'at-risk' ? 'bg-red-500' : stage === 'ready-for-signoff' ? 'bg-emerald-500' : 'bg-blue-500'
                    )} />

                    <CardHeader className="pb-4 pt-5">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl mb-1">{doc.parties.client}</CardTitle>
                          <CardDescription className="text-sm">{doc.title} ({doc.type})</CardDescription>
                        </div>
                        <StageIcon className={cn("w-6 h-6", stage === 'at-risk' ? 'text-red-500' : stage === 'ready-for-signoff' ? 'text-emerald-500' : 'text-blue-500')} />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between text-sm mb-2 font-medium">
                          <span>Clause Resolution</span>
                          <span className="font-mono">{summary.resolved}/{summary.total}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                          <motion.div 
                            className={cn("h-3 rounded-full", progress === 100 ? 'bg-emerald-500' : 'bg-blue-600')}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>
                      </div>

                      {/* Clause Breakdown */}
                      <div className="grid grid-cols-3 gap-2 text-center">
                        {summary.disputed > 0 && (
                          <div className="p-2 rounded-lg bg-red-50 border border-red-100">
                            <div className="text-lg font-bold text-red-700">{summary.disputed}</div>
                            <div className="text-[10px] font-medium text-red-600 uppercase">Disputed</div>
                          </div>
                        )}
                        {summary.active > 0 && (
                          <div className="p-2 rounded-lg bg-blue-50 border border-blue-100">
                            <div className="text-lg font-bold text-blue-700">{summary.active}</div>
                            <div className="text-[10px] font-medium text-blue-600 uppercase">In Review</div>
                          </div>
                        )}
                        {summary.pending > 0 && (
                          <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100">
                            <div className="text-lg font-bold text-indigo-700">{summary.pending}</div>
                            <div className="text-[10px] font-medium text-indigo-600 uppercase">AI Active</div>
                          </div>
                        )}
                        {summary.backlog > 0 && (
                          <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                            <div className="text-lg font-bold text-slate-600">{summary.backlog}</div>
                            <div className="text-[10px] font-medium text-slate-500 uppercase">Backlog</div>
                          </div>
                        )}
                        <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                          <div className="text-lg font-bold text-emerald-700">{summary.resolved}</div>
                          <div className="text-[10px] font-medium text-emerald-600 uppercase">Resolved</div>
                        </div>
                      </div>

                      {/* Stage Badge */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-sm text-muted-foreground">Deal Stage</span>
                        <Badge className={cn("font-medium border", config.color)}>
                          <StageIcon className="w-3 h-3 mr-1" /> {config.label}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* ── Right: Notification Inbox ── */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
              {unreadCount > 0 ? (
                <BellRing className="w-5 h-5 text-amber-600 animate-bounce" />
              ) : (
                <Bell className="w-5 h-5 text-slate-400" />
              )}
              Legal Team Updates
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white text-xs px-2 py-0.5">{unreadCount} new</Badge>
              )}
            </h2>

            <AnimatePresence>
              {notifications.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <Bell className="w-8 h-8 mx-auto mb-3 text-slate-300" />
                    <p className="text-sm">No notifications yet.</p>
                    <p className="text-xs mt-1">Your legal team will ping you here.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      layout
                    >
                      <Card className={cn(
                        "border-2 transition-all cursor-pointer hover:shadow-md",
                        !notif.read ? "border-amber-200 bg-amber-50/50" : "border-slate-200 bg-white"
                      )}
                        onClick={() => markNotificationRead(notif.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-3 flex-1">
                              <div className={cn(
                                "mt-0.5 shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                                notif.type === 'urgent' ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                              )}>
                                {notif.type === 'urgent' ? (
                                  <ShieldAlert className="w-4 h-4" />
                                ) : (
                                  <FileText className="w-4 h-4" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-semibold text-slate-700">{notif.from}</span>
                                  {!notif.read && <span className="h-2 w-2 rounded-full bg-amber-500" />}
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed">{notif.message}</p>
                                <div className="flex items-center gap-3 mt-2">
                                  <Badge variant="outline" className="text-[10px] px-2 py-0">{notif.clauseTitle}</Badge>
                                  <span className="text-[10px] text-muted-foreground">{formatTime(notif.timestamp)}</span>
                                </div>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
                              onClick={(e) => {
                                e.stopPropagation();
                                dismissNotification(notif.id);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
