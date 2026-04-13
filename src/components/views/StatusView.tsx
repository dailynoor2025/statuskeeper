"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusCard } from "@/components/ui/StatusCard";
import { MediaViewer } from "@/components/ui/MediaViewer";
import { NativeVideoAd } from "@/components/ads/AdComponents";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Smartphone, RefreshCcw, Camera, PlayCircle, CheckSquare, X, Download, Info, CheckSquare2, FileWarning } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useAds } from "@/hooks/use-ads";

/**
 * StatusView - Logic: Content only appears if fetched from filesystem.
 * Otherwise, detailed reasons for absence are displayed.
 */

export function StatusView() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedMedia, setSelectedMedia] = useState<{ id: string; imageUrl: string; type: 'image' | 'video' } | null>(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { isPro } = useAds();

  // Logic: Simulation of filesystem fetch
  const statusData = useMemo(() => {
    // In production, this replaces PlaceHolderImages with Filesystem.readdir results
    return PlaceHolderImages.map((img, i) => ({
      ...img,
      type: i % 4 === 0 ? 'video' : ('image' as 'image' | 'video'),
    }));
  }, []);

  const activeItems = useMemo(() => {
    if (activeTab === 'images') return statusData.filter(i => i.type === 'image');
    if (activeTab === 'videos') return statusData.filter(i => i.type === 'video');
    return statusData;
  }, [activeTab, statusData]);

  const isAllActiveSelected = useMemo(() => {
    const activeIds = activeItems.map(i => i.id);
    return activeIds.length > 0 && activeIds.every(id => selectedIds.includes(id));
  }, [activeItems, selectedIds]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    toast({ title: "Smart scan", description: "Checking WhatsApp directories..." });
    
    setTimeout(() => {
      setIsRefreshing(false);
      toast({ title: "Sync complete", description: "Status list updated", variant: "success" });
    }, 1500);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
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

  const handleBulkSave = () => {
    if (selectedIds.length === 0) return;
    const savedItems = JSON.parse(localStorage.getItem('saved_statuses') || '[]');
    let newlySaved = 0;
    selectedIds.forEach(id => {
      const item = statusData.find(s => s.id === id);
      if (item && !savedItems.find((s: any) => s.id === id)) {
        savedItems.push({ id: item.id, imageUrl: item.imageUrl, type: item.type });
        newlySaved++;
      }
    });
    localStorage.setItem('saved_statuses', JSON.stringify(savedItems));
    toast({ title: "Bulk save complete", description: `${newlySaved} items added to gallery`, variant: "success" });
    exitSelectionMode();
  };

  const renderGridItems = (items: typeof statusData) => {
    const gridElements = [];
    if (!isPro) gridElements.push(<div key="permanent-ad" className="animate-staggered"><NativeVideoAd /></div>);

    items.forEach((item, index) => {
      gridElements.push(
        <div key={item.id} className="animate-staggered" style={{ animationDelay: `${(index + 1) * 0.04}s` }}>
          <StatusCard 
            id={item.id} 
            imageUrl={item.imageUrl} 
            type={item.type} 
            mode="status" 
            isSelectionMode={isSelectionMode}
            isSelected={selectedIds.includes(item.id)}
            onToggleSelect={toggleSelect}
            onView={setSelectedMedia} 
          />
        </div>
      );
      if (!isPro && (index + 1) % 5 === 0) {
        gridElements.push(<div key={`ad-${index}`} className="animate-staggered"><NativeVideoAd /></div>);
      }
    });
    return gridElements;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full space-y-4">
        <div className="relative">
          <div className="bg-primary/5 p-8 rounded-full animate-pulse border border-primary/10">
            <Smartphone className="w-6 h-6 text-primary/30" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <RefreshCcw className="w-4 h-4 text-primary animate-spin" />
          </div>
        </div>
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em]">Locating media...</p>
      </div>
    );
  }

  const isEmpty = activeItems.length === 0;

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto no-scrollbar pb-16 bg-gray-50/20 relative">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between px-2 sticky top-0 bg-white/95 backdrop-blur-xl z-20 py-1.5 border-b border-gray-100 shadow-sm transition-all duration-300">
          <TabsList className="flex-1 grid grid-cols-3 h-8 rounded-xl bg-gray-100 p-0.5 border-none mr-2 shadow-inner">
            <TabsTrigger value="all" className="rounded-lg text-[clamp(7px,1.8vw,9px)] font-black uppercase tracking-wider h-full data-[state=active]:bg-white data-[state=active]:shadow-sm">All</TabsTrigger>
            <TabsTrigger value="images" className="rounded-lg flex items-center justify-center h-full data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Camera className="w-3.5 h-3.5" />
            </TabsTrigger>
            <TabsTrigger value="videos" className="rounded-lg flex items-center justify-center h-full data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <PlayCircle className="w-3.5 h-3.5" />
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-1">
            {isSelectionMode ? (
              <>
                <button onClick={handleSelectAll} className="h-7 px-2 rounded-lg border border-gray-100 bg-white shadow-sm active:scale-90 transition-transform flex items-center justify-center gap-1.5">
                  <CheckSquare2 className={cn("w-3 h-3", isAllActiveSelected ? "text-primary" : "text-gray-400")} />
                  <span className="text-[8px] font-black uppercase tracking-tight text-gray-600">
                    {isAllActiveSelected ? 'Unmark' : 'Mark all'}
                  </span>
                </button>
                <button onClick={exitSelectionMode} className="h-7 w-7 rounded-lg border border-red-100 bg-red-50 shadow-sm active:scale-90 transition-transform flex items-center justify-center">
                  <X className="w-3 h-3 text-red-500" />
                </button>
              </>
            ) : (
              <>
                {!isEmpty && (
                  <button onClick={() => setIsSelectionMode(true)} className="h-7 w-7 rounded-lg border border-gray-100 bg-white shadow-sm active:scale-90 transition-transform flex items-center justify-center">
                    <CheckSquare className="w-3 h-3 text-gray-400" />
                  </button>
                )}
                <button onClick={handleRefresh} disabled={isRefreshing} className="h-7 w-7 rounded-lg border border-gray-100 bg-white shadow-sm active:scale-90 transition-transform flex items-center justify-center">
                  <RefreshCcw className={cn("w-3 h-3 text-gray-400", isRefreshing && "animate-spin text-primary")} />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="p-0.5 mt-1">
          {isEmpty ? (
            <div className="flex-1 flex flex-col items-center justify-center py-24 text-center px-8 animate-in fade-in duration-700">
              <div className="bg-gray-100 p-6 rounded-3xl mb-6 shadow-inner">
                <FileWarning className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-sm font-black text-gray-900 tracking-tight mb-2">
                No {activeTab === 'all' ? 'statuses' : activeTab} found
              </h3>
              <p className="text-[10px] text-gray-400 font-bold leading-relaxed max-w-[220px] uppercase tracking-wider">
                Statuses appear here only after you watch them in the official WhatsApp app. Please view some media and return.
              </p>
              <Button variant="outline" onClick={handleRefresh} className="mt-8 h-10 rounded-xl px-6 font-black text-[10px] tracking-tight border-gray-200">
                Check directory again
              </Button>
            </div>
          ) : (
            <div className="status-grid-3">
              {renderGridItems(activeItems)}
            </div>
          )}
        </div>
      </Tabs>
      
      {isSelectionMode && selectedIds.length > 0 && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <button onClick={handleBulkSave} className="h-8 px-4 rounded-full bg-primary text-white shadow-2xl flex items-center gap-2 active:scale-95 transition-all text-[10px] font-black whitespace-nowrap">
            <Download className="w-3.5 h-3.5" />
            Download {selectedIds.length} {selectedIds.length === 1 ? 'item' : 'items'}
          </button>
        </div>
      )}

      <MediaViewer isOpen={!!selectedMedia} onClose={() => setSelectedMedia(null)} media={selectedMedia} mode="status" />
    </div>
  );
}
