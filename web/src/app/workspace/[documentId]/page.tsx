"use client";

import DocumentViewer from '@/components/workspace/DocumentViewer';
import ClauseBoard from '@/components/workspace/ClauseBoard';
import { useStore } from '@/store/useStore';
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function WorkspaceEditorPage() {
  const params = useParams();
  const router = useRouter();
  const { setActiveDocument, activeRole } = useStore();
  
  useEffect(() => {
    if (activeRole === 'sales') {
      router.push('/sales');
    }
  }, [activeRole, router]);

  useEffect(() => {
    if (params.documentId && typeof params.documentId === 'string') {
      setActiveDocument(params.documentId);
    }
  }, [params.documentId, setActiveDocument]);

  return (
    <div className="flex h-full w-full bg-background">
      {/* Left Pane */}
      <div className="w-1/2 h-full border-r bg-slate-50">
        <DocumentViewer />
      </div>
      
      {/* Right Pane */}
      <div className="w-1/2 h-full bg-slate-100">
        <ClauseBoard />
      </div>
    </div>
  );
}
