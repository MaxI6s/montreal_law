"use client";

import { useStore, Role } from '@/store/useStore';
import { Shield, Building2, Bell, BellRing } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function TopNav() {
  const { activeRole, activeTenant, setActiveRole, notifications } = useStore();
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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        {/* Left: Branding — clickable to home */}
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity group">
          <Shield className="h-6 w-6 text-indigo-600 group-hover:scale-110 transition-transform" />
          <span className="font-bold text-lg tracking-tight">Montreal Law</span>
        </Link>

        {/* Center: Navigation */}
        <div className="flex flex-1 items-center justify-center gap-6">
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link 
              href="/workspace" 
              className={cn(
                "transition-colors hover:text-foreground",
                pathname?.startsWith('/workspace') ? "text-foreground font-semibold" : "text-muted-foreground"
              )}
            >
              Legal Workspace
            </Link>
            <Link 
              href="/sales" 
              className={cn(
                "transition-colors hover:text-foreground flex items-center gap-1.5",
                pathname === '/sales' ? "text-foreground font-semibold" : "text-muted-foreground"
              )}
            >
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

        {/* Right: Persona Switcher + Notifications */}
        <div className="flex items-center gap-3">
          {/* Notification Bell (visible for sales) */}
          {activeRole === 'sales' && (
            <Link href="/sales" className="relative p-2 rounded-lg hover:bg-muted transition-colors">
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
          )}

          {/* Tenant Badge */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold">{activeTenant}</span>
          </div>
          
          {/* Role Switcher */}
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
    </header>
  );
}
