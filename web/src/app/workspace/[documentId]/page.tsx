"use client";

import OnlyOfficeViewer from '@/components/workspace/OnlyOfficeViewer';
import ClauseBoard from '@/components/workspace/ClauseBoard';
import { useStore } from '@/store/useStore';
import { useEffect, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function WorkspaceEditorPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setActiveDocument, activeRole } = useStore();
  const hasPromptedInvite = useRef(false);
  
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

  useEffect(() => {
    if (searchParams?.get('invite') === 'true' && !hasPromptedInvite.current) {
      hasPromptedInvite.current = true;
      toast("Contract Processed", {
        description: "The DPA is ready. Copy the invite link to share with Client Legal.",
        action: {
          label: "Copy Link",
          onClick: () => {
            navigator.clipboard.writeText(window.location.origin + "/workspace/" + params.documentId);
            toast.success("Link copied to clipboard!");
          }
        },
        duration: 10000,
      });
    }
  }, [searchParams, params.documentId]);

  return (
    <div className="flex h-full w-full bg-background">
      {/* Left Pane */}
      <div className="w-1/2 h-full border-r bg-slate-50">
        <OnlyOfficeViewer />
      </div>
      
      {/* Right Pane */}
      <div className="w-1/2 h-full bg-slate-100">
        <ClauseBoard />
      </div>
    </div>
  );
}
