"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileText, Cpu, CheckCircle2, Loader2, FileUp, Sparkles, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ProcessState = "idle" | "uploading" | "parsing" | "extracting" | "complete";

const PROJECTS = [
  { id: 'acme-dpa', name: 'Acme Corp - DPA', client: 'Acme Corp.', type: 'DPA' },
];

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [state, setState] = useState<ProcessState>("idle");
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile) {
      setFile(selectedFile);
      startProcessing();
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const startProcessing = () => {
    setState("uploading");
    setProgress(0);

    // Mock Uploading (0 -> 100 over 1.5s)
    let uploadProgress = 0;
    const uploadInterval = setInterval(() => {
      uploadProgress += 5;
      setProgress(uploadProgress);
      if (uploadProgress >= 100) {
        clearInterval(uploadInterval);
        setState("parsing");
        
        // Mock Parsing (2 seconds)
        setTimeout(() => {
          setState("extracting");
          
          // Mock Extracting (3 seconds)
          setTimeout(() => {
            setState("complete");
            
            // Redirect after brief pause
            setTimeout(() => {
              router.push("/workspace/doc-dpa-1?invite=true");
            }, 1500);
          }, 3000);
        }, 2000);
      }
    }, 50);
  };

  const steps = [
    { key: "uploading", label: "Uploading Document", icon: FileUp, activeColor: "text-blue-500", doneColor: "text-blue-500" },
    { key: "parsing", label: "Structural Parsing", icon: FileText, activeColor: "text-indigo-500", doneColor: "text-indigo-500" },
    { key: "extracting", label: "Intelligent Clause Extraction", icon: Sparkles, activeColor: "text-purple-500", doneColor: "text-purple-500" },
    { key: "complete", label: "Ready for Legal Review", icon: CheckCircle2, activeColor: "text-emerald-500", doneColor: "text-emerald-500" },
  ];

  const getStepStatus = (stepKey: string, currentIndex: number, stepIndex: number) => {
    if (currentIndex > stepIndex) return "done";
    if (currentIndex === stepIndex) return "active";
    return "pending";
  };

  const currentStateIndex = steps.findIndex(s => s.key === state);

  return (
    <div className="min-h-[calc(100vh-56px)] bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 mb-4 shadow-inner">
            <UploadCloud className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">New Contract Proposal</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Upload a document to extract clauses and analyze against your playbook.
          </p>
        </div>

        <Card className="border-2 shadow-sm overflow-hidden bg-white">
          <AnimatePresence mode="wait">
            {state === "idle" ? (
              <motion.div
                key="selection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-8"
              >
                {!selectedProject ? (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-semibold text-slate-900">Select Project</h3>
                      <p className="text-sm text-muted-foreground">Which deal is this contract for?</p>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {PROJECTS.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setSelectedProject(p.id)}
                          className="flex items-center justify-between p-4 rounded-xl border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all text-left group"
                        >
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-indigo-700">{p.name}</div>
                            <div className="text-sm text-slate-500">{p.type} proposal</div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-transform group-hover:translate-x-1" />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedProject(null)} className="text-slate-500">
                        <X className="w-4 h-4 mr-1.5" /> Back to Project Selection
                      </Button>
                      <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">
                        {PROJECTS.find(p => p.id === selectedProject)?.name}
                      </Badge>
                    </div>
                    <div
                      className="border-2 border-dashed border-slate-300 rounded-xl p-12 transition-colors hover:border-indigo-400 hover:bg-indigo-50/50 cursor-pointer group text-center"
                      onDragOver={onDragOver}
                      onDrop={onDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        accept=".docx,.pdf,.doc"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            handleFileSelect(e.target.files[0]);
                          }
                        }}
                      />
                      <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:bg-indigo-100 group-hover:text-indigo-600 text-slate-400">
                        <FileUp className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-700 mb-2 group-hover:text-indigo-700">Click to upload or drag and drop</h3>
                      <p className="text-sm text-slate-500">Word Documents (.docx) or PDFs (max 50MB)</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8"
              >
                <div className="flex items-center gap-4 mb-8 bg-slate-50 p-4 rounded-lg border">
                  <div className="w-12 h-12 bg-white rounded shadow-sm border flex items-center justify-center text-indigo-600">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{file?.name || "Contract_Draft_v2.docx"}</p>
                    <p className="text-sm text-slate-500">{(file?.size ? (file.size / 1024 / 1024).toFixed(2) : 2.4)} MB</p>
                  </div>
                  {state !== "complete" && (
                    <Button variant="ghost" size="icon" onClick={() => setState("idle")} className="text-slate-400 hover:text-red-500">
                      <X className="w-5 h-5" />
                    </Button>
                  )}
                </div>

                <div className="space-y-6">
                  {steps.map((step, index) => {
                    const status = getStepStatus(step.key, currentStateIndex, index);
                    const StepIcon = step.icon;
                    
                    return (
                      <div key={step.key} className={cn("flex items-center gap-4 transition-opacity duration-500", status === "pending" ? "opacity-30" : "opacity-100")}>
                        <div className="relative">
                          {status === "active" ? (
                            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shadow-sm relative z-10 bg-white border-2", step.activeColor.replace('text-', 'border-'))}>
                              <Loader2 className={cn("w-5 h-5 animate-spin", step.activeColor)} />
                            </div>
                          ) : status === "done" ? (
                            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shadow-sm relative z-10", step.doneColor.replace('text-', 'bg-'), "text-white")}>
                              <CheckCircle2 className="w-5 h-5" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center relative z-10 text-slate-400">
                              <StepIcon className="w-5 h-5" />
                            </div>
                          )}
                          {index < steps.length - 1 && (
                            <div className={cn("absolute top-10 left-1/2 -ml-0.5 w-1 h-8 -z-0", status === "done" ? step.doneColor.replace('text-', 'bg-') : "bg-slate-100")} />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className={cn("font-medium", status === "active" ? "text-slate-900" : status === "done" ? "text-slate-700" : "text-slate-400")}>
                            {step.label}
                          </h4>
                          {status === "active" && step.key === "uploading" && (
                            <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full bg-blue-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ ease: "linear" }}
                              />
                            </div>
                          )}
                          {status === "active" && step.key === "parsing" && (
                            <p className="text-xs text-indigo-500 mt-1 animate-pulse">Identifying deviation boundaries...</p>
                          )}
                          {status === "active" && step.key === "extracting" && (
                            <p className="text-xs text-purple-500 mt-1 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 animate-pulse" /> Mapping content to playbook standards...
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
}
