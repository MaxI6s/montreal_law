"use client";

import { useStore, Role } from '@/store/useStore';
import { Shield, Building2, Bell, BellRing, RefreshCcw, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function TopNav() {
  const { activeRole, activeTenant, setActiveRole, notifications, resetState } = useStore();
  const pathname = usePathname();
  const unreadCount = notifications.filter(n => !n.read).length;

  const roleLabel = (role: Role) => {
    switch (role) {
      case 'vendor': return 'Vendor Legal';
      case 'client': return 'Client Legal';
      case 'sales': return 'Vendor Sales';
    }
  };

  const roleColor = (role: Role) => {
    switch (role) {
      case 'vendor': return 'bg-emerald-600';
      case 'client': return 'bg-blue-600';
      case 'sales': return 'bg-amber-600';
    }
  };

  const accentStrip = (role: Role) => {
    switch (role) {
      case 'vendor': return 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500';
      case 'client': return 'bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500';
      case 'sales': return 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        {/* Left: Branding */}
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity group">
          <Shield className="h-6 w-6 text-indigo-600 group-hover:scale-110 transition-transform" />
          <span className="font-bold text-lg tracking-tight">Montreal Law</span>
        </Link>

        {/* Center: Navigation */}
        <div className="flex flex-1 items-center justify-center gap-6">
          <div className="flex items-center gap-6 text-sm font-medium">
            {activeRole === 'vendor' && (
              <>
                <Link href="/upload" className={cn("transition-colors hover:text-foreground flex items-center gap-1.5", pathname === '/upload' ? "text-foreground font-semibold" : "text-muted-foreground")}>
                  <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-bold mr-1">+ New</span>
                  Upload Contract
                </Link>
                <div className="w-px h-4 bg-border" />
              </>
            )}
            <Link href="/workspace" className={cn("transition-colors hover:text-foreground", pathname?.startsWith('/workspace') ? "text-foreground font-semibold" : "text-muted-foreground")}>
              Legal Workspace
            </Link>
            <Link href="/sales" className={cn("transition-colors hover:text-foreground flex items-center gap-1.5", pathname === '/sales' ? "text-foreground font-semibold" : "text-muted-foreground")}>
              Vendor Sales
              {unreadCount > 0 && activeRole !== 'sales' && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Right: Actions, Persona Switcher + Notifications */}
        <div className="flex items-center gap-3">
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-indigo-600"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Invite Link Copied", { description: "Share this link with the opposing counsel." });
            }}
            title="Copy Invite Link"
          >
            <UserPlus className="h-5 w-5" />
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-red-600"
            onClick={() => {
              resetState();
              toast.success("Demo Reset", { description: "All state has been restored to the initial mock data." });
            }}
            title="Reset Demo State"
          >
            <RefreshCcw className="h-5 w-5" />
          </Button>

          <Link href={activeRole === 'sales' ? '/sales' : '#'} onClick={(e) => {
            if (activeRole !== 'sales') {
              e.preventDefault();
              toast.info("Notifications", { description: "You have unread updates." });
            }
          }} className="relative p-2 rounded-lg hover:bg-muted transition-colors">
            {unreadCount > 0 ? (
              <BellRing className="h-5 w-5 text-amber-600 animate-bounce" />
            ) : (
              <Bell className="h-5 w-5 text-muted-foreground" />
            )}
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                {unreadCount}
              </span>
            )}
          </Link>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold">{activeTenant}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={cn("h-2.5 w-2.5 rounded-full shadow-sm", roleColor(activeRole))} />
            <select 
              value={activeRole} 
              onChange={(e) => setActiveRole(e.target.value as Role)}
              className="h-8 w-[150px] rounded-md border border-input bg-primary text-primary-foreground px-3 py-1 text-sm shadow-sm focus-visible:outline-none cursor-pointer"
            >
              <option value="vendor">Vendor Legal</option>
              <option value="client">Client Legal</option>
              <option value="sales">Vendor Sales</option>
            </select>
          </div>
        </div>
      </div>
      {/* Role accent strip */}
      <div className={cn("h-[2px] w-full transition-all duration-500", accentStrip(activeRole))} />
    </header>
  );
}
