
"use client";

import { useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PermissionBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="mx-4 mt-4 bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-start gap-4">
      <div className="bg-primary/10 p-2 rounded-xl">
        <ShieldAlert className="w-6 h-6 text-primary" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-sm">Storage Access Needed</h3>
        <p className="text-xs text-muted-foreground mt-1">
          To display WhatsApp statuses, we need permission to access your device's media folders.
        </p>
        <div className="mt-3 flex gap-2">
          <Button size="sm" className="rounded-lg h-8 text-xs font-bold">Grant Permission</Button>
          <Button variant="ghost" size="sm" className="rounded-lg h-8 text-xs" onClick={() => setIsVisible(false)}>Later</Button>
        </div>
      </div>
      <button onClick={() => setIsVisible(false)} className="text-muted-foreground hover:text-foreground">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
