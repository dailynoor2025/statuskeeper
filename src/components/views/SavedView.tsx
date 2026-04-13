
"use client";

import { StatusCard } from "@/components/ui/StatusCard";
import { MediaViewer } from "@/components/ui/MediaViewer";
import { NativeVideoAd } from "@/components/ads/AdComponents";
import { FolderHeart, Camera, PlayCircle, CheckSquare, X, Trash2, CheckSquare2, FileX } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect, useMemo } from "react";
import { toast } from "@/hooks/use-toast";
import { useAds } from "@/hooks/use-ads";
import { cn } from "@/lib/utils";

export function SavedView() {
  const [items, setItems] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedMedia, setSelectedMedia] = useState<{ id: string; imageUrl: string; type: 'image' | 'video' } | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { isPro } = useAds();

  const loadSaved = () => {
    const saved = localStorage.getItem('saved_statuses');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) { setItems([]); }
    }
    setTimeout(() => setIsInitialLoad(false), 300);
  };

  useEffect(() => {
    loadSaved();
    const handleStorage = (e: StorageEvent) => { if (e.key === 'saved_statuses') loadSaved(); };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const activeItems = useMemo(() => {
    if (activeTab === 'images') return items.filter(item => item.type === 'image');
    if (activeTab === 'videos') return items.filter(item => item.type === 'video');
    return items;
  }, [activeTab, items]);

  const isAllActiveSelected = useMemo(() => {
    const activeIds = activeItems.map(i => i.id);
    return activeIds.length > 0 && activeIds.every(id => selectedIds.includes(id));
  }, [activeItems, selectedIds]);

  const handleDelete = (id: string) => {
    const updated = items.filter(item => item.id !== id);
    setItems(updated);
    localStorage.setItem('saved_statuses', JSON.stringify(updated));
    toast({ title: "Deleted", description: "Removed from gallery", variant: "destructive" });
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    const activeIds = activeItems.map(i => i.id);
    if (isAllActiveSelected) {
      setSelectedIds(prev => prev.filter(id => !activeIds.includes(id)));
    } else {
      setSelectedIds(prev => Array.from(new Set([...prev, ...activeIds])));
    }
  };

  const exitSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    const updated = items.filter(item => !selectedIds.includes(item.id));
    setItems(updated);
    localStorage.setItem('saved_statuses', JSON.stringify(updated));
    toast({ title: "Bulk delete complete", description: `${selectedIds.length} items removed`, variant: "destructive" });
    exitSelectionMode();
  };

  const renderGridItems = (dataItems: any[]) => {
    const gridElements: React.ReactNode[] = [];
    if (!isPro) {
      gridElements.push(<div key="saved-ad-start" className="animate-staggered"><NativeVideoAd /></div>);
    }
    dataItems.forEach((item, index) => {
      gridElements.push(
        <div key={item.id} className="animate-staggered" style={{ animationDelay: `${(index + 1) * 0.04}s` }}>
          <StatusCard 
            id={item.id} imageUrl={item.imageUrl} type={item.type} mode="saved" 
            isSelectionMode={isSelectionMode} isSelected={selectedIds.includes(item.id)}
            onToggleSelect={toggleSelect} onDelete={handleDelete} onView={setSelectedMedia} 
          />
        </div>
      );
      if (!isPro && (index + 1) % 5 === 0) {
        gridElements.push(<div key={`saved-ad-mid-${index}`} className="animate-staggered"><NativeVideoAd /></div>);
      }
    });
    return gridElements;
  };

  if (isInitialLoad) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] w-full space-y-3">
        <div className="bg-primary/5 p-6 rounded-full animate-pulse border border-primary/10">
          <FolderHeart className="w-6 h-6 text-primary/30" />
        </div>
        <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Opening gallery...</p>
      </div>
    );
  }

  const isEmpty = activeItems.length === 0;

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto no-scrollbar pb-16 bg-gray-50/20 relative">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between px-2 sticky top-0 bg-white/95 backdrop-blur-xl z-20 py-1.5 border-b border-gray-100 shadow-sm transition-all duration-300">
          <TabsList className="flex-1 grid grid-cols-3 h-8 rounded-xl bg-gray-100 p-0.5 border-none shadow-inner mr-2">
            <TabsTrigger value="all" className="rounded-lg text-[clamp(7px, 1.8vw, 9px)] font-black uppercase tracking-wider h-full data-[state=active]:bg-white">All</TabsTrigger>
            <TabsTrigger value="images" className="rounded-lg flex gap-1 items-center justify-center h-full data-[state=active]:bg-white"><Camera className="w-3.5 h-3.5" /></TabsTrigger>
            <TabsTrigger value="videos" className="rounded-lg flex gap-1 items-center justify-center h-full data-[state=active]:bg-white"><PlayCircle className="w-3.5 h-3.5" /></TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-1">
            {isSelectionMode ? (
              <>
                <button onClick={handleSelectAll} className="h-7 px-2 rounded-lg border border-gray-100 bg-white shadow-sm active:scale-90 transition-transform flex items-center justify-center gap-1.5">
                  <CheckSquare2 className={cn("w-3 h-3", isAllActiveSelected ? "text-primary" : "text-gray-400")} />
                  <span className="text-[8px] font-black uppercase tracking-tight text-gray-600">{isAllActiveSelected ? 'Unmark' : 'Mark all'}</span>
                </button>
                <button onClick={exitSelectionMode} className="h-7 w-7 rounded-lg border border-red-100 bg-red-50 shadow-sm active:scale-90 transition-transform flex items-center justify-center"><X className="w-3 h-3 text-red-500" /></button>
              </>
            ) : (
              !isEmpty && <button onClick={() => setIsSelectionMode(true)} className="h-7 w-7 rounded-lg border border-gray-100 bg-white shadow-sm active:scale-90 transition-transform flex items-center justify-center"><CheckSquare className="w-3 h-3 text-gray-400" /></button>
            )}
          </div>
        </div>
        <div className="p-0.5 mt-1">
          {isEmpty ? (
            <div className="flex-1 flex flex-col items-center justify-center py-24 text-center space-y-4 px-8 animate-in fade-in zoom-in duration-700">
              <div className="relative group">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-gray-100"><FileX className="w-6 h-6 text-gray-200" /></div>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-gray-900 tracking-tight">No saved {activeTab === 'all' ? 'content' : activeTab}</h3>
                <p className="text-[9px] text-gray-400 font-bold max-w-[160px] mx-auto uppercase tracking-widest leading-relaxed">Your captured statuses will appear here after you save them from the main status screen.</p>
              </div>
            </div>
          ) : (
            <div className="status-grid-3">{renderGridItems(activeItems)}</div>
          )}
        </div>
      </Tabs>
      {isSelectionMode && selectedIds.length > 0 && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <button onClick={handleBulkDelete} className="h-8 px-4 rounded-full bg-destructive text-white shadow-2xl flex items-center gap-2 active:scale-95 transition-all text-[10px] font-black whitespace-nowrap">
            <Trash2 className="w-3.5 h-3.5" /> Delete {selectedIds.length} {selectedIds.length === 1 ? 'item' : 'items'}
          </button>
        </div>
      )}
      <MediaViewer isOpen={!!selectedMedia} onClose={() => setSelectedMedia(null)} media={selectedMedia} mode="saved" onDelete={handleDelete} />
    </div>
  );
}
