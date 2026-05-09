"use client";

import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Send } from 'lucide-react';

interface DiscussionThreadProps {
  clauseId: string;
}

export default function DiscussionThread({ clauseId }: DiscussionThreadProps) {
  const { comments, addComment, activeRole } = useStore();
  const [newComment, setNewComment] = useState("");
  const clauseComments = comments[clauseId] || [];
  const isSales = activeRole === 'sales';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSales) return;
    addComment(clauseId, newComment.trim());
    setNewComment("");
  };

  const formatTime = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div 
      className="mt-3 border-t pt-3 space-y-3" 
      onClick={(e) => e.stopPropagation()}
    >
      {/* Thread */}
      {clauseComments.length > 0 ? (
        <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
          {clauseComments.map((comment) => (
            <div
              key={comment.id}
              className={cn(
                "rounded-lg p-2.5 text-sm border",
                comment.role === 'vendor' 
                  ? "bg-emerald-50/80 border-emerald-100" 
                  : "bg-blue-50/80 border-blue-100"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={cn(
                  "font-semibold text-xs",
                  comment.role === 'vendor' ? "text-emerald-700" : "text-blue-700"
                )}>
                  {comment.author}
                  <span className="font-normal text-[10px] ml-1.5 opacity-60">
                    ({comment.role === 'vendor' ? 'Vendor Legal' : 'Client Legal'})
                  </span>
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {formatTime(comment.timestamp)}
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed text-[13px]">
                {comment.text}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground text-center py-2">
          No discussion yet. Start the conversation.
        </p>
      )}

      {/* Input */}
      {!isSales && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 h-8 px-3 text-sm rounded-md border border-input bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400"
          />
          <Button 
            type="submit" 
            size="sm" 
            className="h-8 px-3 bg-indigo-600 hover:bg-indigo-700 text-white"
            disabled={!newComment.trim()}
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </form>
      )}
    </div>
  );
}
