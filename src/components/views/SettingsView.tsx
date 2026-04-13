"use client";

import { useState, useEffect } from 'react';
import { 
  Database, 
  ChevronRight, 
  Bell,
  FolderSearch,
  RefreshCcw,
  Trash2,
  ShieldCheck,
  DownloadCloud
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function SettingsView() {
  const [isClearing, setIsClearing] = useState(false);
  const [cacheSize, setCacheSize] = useState("4.8 mb");
  const [autoDownload, setAutoDownload] = useState(false);
  const [notifyNewStatus, setNotifyNewStatus] = useState(false);

  useEffect(() => {
    setAutoDownload(localStorage.getItem('auto_download') === 'true');
    setNotifyNewStatus(localStorage.getItem('notify_new_status') === 'true');
    setCacheSize(localStorage.getItem('sim_cache') || "4.8 mb");
  }, []);

  const handleClearCache = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (cacheSize === "0 kb") return;
    setIsClearing(true);
    setTimeout(() => {
      setCacheSize("0 kb");
      localStorage.setItem('sim_cache', "0 kb");
      setIsClearing(false);
      toast({ 
        title: "System optimized", 
        description: "Temporary junk files cleared.",
        variant: "success"
      });
    }, 1500);
  };

  const handleToggleNotify = (val: boolean) => {
    setNotifyNewStatus(val);
    localStorage.setItem('notify_new_status', val.toString());
  };

  const handleToggleAutoDownload = (val: boolean) => {
    setAutoDownload(val);
    localStorage.setItem('auto_download', val.toString());
  };

  return (
    <div className="px-3 py-4 animate-in slide-in-from-right-2 duration-500 w-full h-full pb-20 overflow-y-auto no-scrollbar bg-gray-50/10">
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm mb-4 w-full">
        <div className="p-4 border-b border-gray-50 bg-gray-50/50">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-[clamp(10px,2.5vw,11px)] font-black tracking-tight text-gray-900">Device storage</p>
              <p className="text-[clamp(8px,2vw,9px)] text-gray-400 font-bold tracking-tight leading-none uppercase">WhatsApp monitoring</p>
            </div>
            <p className="text-[clamp(10px,2.5vw,11px)] font-black text-primary">12% used</p>
          </div>
          <Progress value={12} className="h-1.5 bg-gray-200 rounded-full" />
        </div>

        <div className="divide-y divide-gray-50">
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 active:scale-[0.99] transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary shadow-sm">
                <FolderSearch className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[clamp(10px,2.5vw,11px)] font-black tracking-tight text-gray-900 truncate">Status directory</p>
                <p className="text-[clamp(7px,1.8vw,8px)] text-gray-400 font-bold tracking-tight leading-none mt-0.5 truncate uppercase">Android/media/com.whatsapp/WhatsApp/Media/.Statuses</p>
              </div>
            </div>
            <ChevronRight className="w-3 h-3 text-gray-300 flex-shrink-0" />
          </div>

          <div 
            className="flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 active:scale-[0.99] transition-all cursor-pointer group" 
            onClick={handleClearCache}
          >
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-xl bg-gray-100 text-gray-500 shadow-sm transition-all", isClearing && "animate-pulse bg-primary/10 text-primary")}>
                {isClearing ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
              </div>
              <div>
                <p className="text-[clamp(10px,2.5vw,11px)] font-black tracking-tight text-gray-900">Clear temp cache</p>
                <p className="text-[clamp(8px,2vw,9px)] text-primary font-black tracking-tight leading-none mt-0.5 uppercase">{cacheSize} identified</p>
              </div>
            </div>
            <Trash2 className="w-3 h-3 text-gray-300 group-hover:text-destructive transition-colors flex-shrink-0" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm mb-4 w-full">
        <div className="px-4 py-3 border-b border-gray-50">
          <p className="text-[clamp(9px,2.2vw,10px)] font-black text-gray-400 tracking-tight uppercase">Automation & logic</p>
        </div>
        <div className="divide-y divide-gray-50">
          <div 
            className="flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 active:scale-[0.99] transition-all cursor-pointer"
            onClick={() => handleToggleAutoDownload(!autoDownload)}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500 shadow-sm">
                <DownloadCloud className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[clamp(10px,2.5vw,11px)] font-black tracking-tight text-gray-900">Auto-download</p>
                <p className="text-[clamp(8px,2vw,9px)] text-gray-400 font-bold tracking-tight mt-0.5">Save viewed statuses instantly</p>
              </div>
            </div>
            <Switch className="scale-90 origin-right" checked={autoDownload} onCheckedChange={handleToggleAutoDownload} />
          </div>

          <div 
            className="flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 active:scale-[0.99] transition-all cursor-pointer"
            onClick={() => handleToggleNotify(!notifyNewStatus)}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 shadow-sm">
                <Bell className="w-4 h-4" />
              </div>
              <p className="text-[clamp(10px,2.5vw,11px)] font-black tracking-tight text-gray-900">New status alert</p>
            </div>
            <Switch className="scale-90 origin-right" checked={notifyNewStatus} onCheckedChange={handleToggleNotify} />
          </div>

          <div className="flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 active:scale-[0.99] transition-all cursor-pointer">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 shadow-sm">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="text-[clamp(10px,2.5vw,11px)] font-black tracking-tight truncate text-gray-900">App language</p>
              <span className="ml-auto text-[clamp(9px,2.2vw,10px)] font-black text-gray-400 whitespace-nowrap">English only</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 text-center space-y-1.5 opacity-30">
        <div className="flex items-center justify-center gap-1 text-gray-400 font-black tracking-tight text-[8px]">
          <ShieldCheck className="w-3 h-3" />
          <span>Secured status keeper network</span>
        </div>
        <p className="text-[7px] font-bold text-gray-300">Version 1.5.0 stable build</p>
      </div>
    </div>
  );
}