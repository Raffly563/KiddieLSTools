"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Search, Store, Save, RefreshCw, ChevronRight, CheckCircle2, Download } from "lucide-react";

interface ShopItemMeta {
  id: string;
  name: string;
  type?: string;
  resolvedName?: string;
}

export default function ShopEditorPage() {
  const [items, setItems] = useState<ShopItemMeta[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeItem, setActiveItem] = useState<string | null>(null);
  
  const [itemData, setItemData] = useState<Record<string, string> | null>(null);
  const [originalData, setOriginalData] = useState<Record<string, string> | null>(null);
  const [resolvedTexts, setResolvedTexts] = useState<Record<string, string>>({});
  
  // Store all edits across multiple items
  const [globalUpdates, setGlobalUpdates] = useState<Record<string, Record<string, string>>>({});

  const [loadingList, setLoadingList] = useState(true);
  const [loadingItem, setLoadingItem] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Load list on mount
  useEffect(() => {
    fetch('/api/shop?action=list')
      .then(res => res.json())
      .then(data => {
        if (data.items) {
          setItems(data.items);
        }
        setLoadingList(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingList(false);
      });
  }, []);

  // Filter items
  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    const lowerQ = searchQuery.toLowerCase();
    return items.filter(it => 
      it.id.toLowerCase().includes(lowerQ) || it.name.toLowerCase().includes(lowerQ)
    );
  }, [items, searchQuery]);

  // Load specific item
  useEffect(() => {
    if (!activeItem) return;
    setLoadingItem(true);
    setSaveSuccess(false);
    fetch(`/api/shop?action=get&id=${activeItem}`)
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          // Merge with any pending local updates
          const pending = globalUpdates[activeItem] || {};
          const merged = { ...data.data, ...pending };
          setItemData(merged);
          setOriginalData(data.data);
        }
        if (data.resolvedTexts) {
          setResolvedTexts(data.resolvedTexts);
        } else {
          setResolvedTexts({});
        }
        setLoadingItem(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingItem(false);
      });
  }, [activeItem]);

  const updateField = (key: string, value: string) => {
    setItemData(prev => prev ? { ...prev, [key]: value } : prev);
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    if (!activeItem || !itemData || !originalData) return;
    setSaving(true);
    
    // Find what changed
    const updates: Record<string, string> = {};
    for (const key of Object.keys(itemData)) {
      if (itemData[key] !== originalData[key]) {
        updates[key] = itemData[key];
      }
    }
    
    if (Object.keys(updates).length === 0) {
      setSaving(false);
      setSaveSuccess(true);
      return;
    }

    // Save to global updates instead of directly to file
    setGlobalUpdates(prev => ({
      ...prev,
      [activeItem]: updates
    }));
    
    setSaveSuccess(true);
    setSaving(false);
  };

  const handleDownloadINI = async () => {
    if (Object.keys(globalUpdates).length === 0) return;
    setDownloading(true);
    try {
      const res = await fetch('/api/shop?action=download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(globalUpdates)
      });
      if (!res.ok) throw new Error("Failed to download");
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sp2_etcitem_info.ini';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to download the modified INI.");
    } finally {
      setDownloading(false);
    }
  };

  const isDirty = useMemo(() => {
    if (!itemData || !originalData) return false;
    return Object.keys(itemData).some(key => itemData[key] !== originalData[key]);
  }, [itemData, originalData]);

  // Keys we definitely want to show prominently
  const prominentKeys = ['name', 'type', 'sell_peso', 'cash1', 'peso1', 'bonus_peso1', 'limit_class_num', 'max_soldier'];

  return (
    <div className="flex flex-col flex-1 p-8 h-full bg-background overflow-hidden">
      <div className="mb-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-emerald-500 rounded-full"></div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Shop Manager</h1>
            <p className="text-muted-foreground text-sm font-medium">
              Live edit and export <span className="font-mono text-emerald-500/80">sp2_etcitem_info.ini</span> locally.
            </p>
          </div>
        </div>
        <Button 
          onClick={handleDownloadINI}
          disabled={Object.keys(globalUpdates).length === 0 || downloading}
          className="gap-2 font-bold shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {downloading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {downloading ? "Generating..." : `Download INI (${Object.keys(globalUpdates).length} changes)`}
        </Button>
      </div>

      <div className="flex flex-1 min-h-0 gap-6">
        
        {/* Left Panel: Search & List */}
        <Card className="w-80 flex flex-col min-h-0 border-border/50 bg-card/50 backdrop-blur-sm shadow-sm shrink-0">
          <CardHeader className="p-4 border-b border-border/50 shrink-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search etcitem or name..."
                className="pl-9 bg-background/50 text-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-4 flex justify-between items-center">
              <span>{loadingList ? "Loading..." : `${filteredItems.length} Items`}</span>
            </div>
          </CardHeader>
          <div className="flex-1 overflow-y-auto p-2">
            {loadingList ? (
              <div className="flex justify-center p-8 text-muted-foreground">
                <RefreshCw className="w-5 h-5 animate-spin opacity-50" />
              </div>
            ) : (
              <div className="space-y-1">
                {filteredItems.map((item, index) => (
                  <button
                    key={`${item.id}-${index}`}
                    onClick={() => setActiveItem(item.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-md transition-all flex flex-col group ${
                      activeItem === item.id 
                      ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-500" 
                      : "text-muted-foreground hover:bg-muted/50 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] font-mono font-bold uppercase flex items-center gap-2">
                        {item.id}
                        {globalUpdates[item.id] && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                      </span>
                      {activeItem === item.id && <ChevronRight className="w-4 h-4 opacity-70" />}
                    </div>
                    <span className="text-xs font-semibold truncate w-full text-foreground mt-0.5" title={item.resolvedName || item.name}>
                      {item.resolvedName || item.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground truncate w-full block mt-0.5" title={item.type}>Type: {item.type || 'Unknown'}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Right Panel: Form Editor */}
        <Card className="flex-1 flex flex-col min-h-0 border-border/50 bg-card/50 backdrop-blur-sm shadow-sm relative overflow-hidden">
          {!activeItem ? (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground/50">
              <Store className="w-16 h-16 mb-4 opacity-20" />
              <h2 className="text-xl font-bold tracking-tight text-foreground/50">No Item Selected</h2>
              <p className="text-sm">Select an item from the sidebar to edit.</p>
            </div>
          ) : loadingItem ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <RefreshCw className="w-8 h-8 animate-spin opacity-50" />
            </div>
          ) : itemData ? (
            <>
              <CardHeader className="p-6 border-b border-border/50 flex flex-row items-center justify-between shrink-0 bg-background/50">
                <div>
                  <CardTitle className="text-2xl font-bold font-mono tracking-tight text-emerald-500">{activeItem}</CardTitle>
                  <CardDescription className="text-sm font-semibold text-foreground mt-1 flex flex-col">
                    <span>{itemData.name || 'Unnamed Item'}</span>
                    {resolvedTexts['name'] && <span className="text-xs text-muted-foreground">Original: {resolvedTexts['name']}</span>}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  {saveSuccess && (
                    <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Saved
                    </span>
                  )}
                  <Button 
                    onClick={handleSave} 
                    disabled={!isDirty || saving}
                    className={`gap-2 font-bold shadow-sm transition-all ${isDirty ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}`}
                  >
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? "Queueing..." : "Queue Changes"}
                  </Button>
                </div>
              </CardHeader>
              
              <div className="flex-1 overflow-y-auto p-6">
                
                {/* Highlighted fields */}
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Primary Configuration</h3>
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-6 mb-8 p-5 rounded-xl border border-border/50 bg-background/50">
                  {prominentKeys.map(key => itemData[key] !== undefined && (
                    <div key={key} className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">{key}</label>
                      <Input 
                        value={itemData[key]} 
                        onChange={(e) => updateField(key, e.target.value)} 
                        className={`font-mono text-xs ${itemData[key] !== originalData?.[key] ? 'border-emerald-500/50 bg-emerald-500/5' : 'bg-background'}`}
                      />
                      {resolvedTexts[key] && (
                        <p className="text-[10px] text-emerald-500/80 truncate">L: {resolvedTexts[key]}</p>
                      )}
                    </div>
                  ))}
                </div>

                {/* All other fields */}
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 mt-6">Advanced Data</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {Object.keys(itemData).filter(k => !prominentKeys.includes(k)).map(key => (
                    <div key={key} className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase truncate block" title={key}>{key}</label>
                      <Input 
                        value={itemData[key]} 
                        onChange={(e) => updateField(key, e.target.value)} 
                        className={`font-mono text-xs h-8 px-2 ${itemData[key] !== originalData?.[key] ? 'border-emerald-500/50 bg-emerald-500/5' : 'bg-background'}`}
                      />
                      {resolvedTexts[key] && (
                        <p className="text-[9px] text-emerald-500/80 truncate mt-0.5">L: {resolvedTexts[key]}</p>
                      )}
                    </div>
                  ))}
                </div>

              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-red-500">
              Error loading item data.
            </div>
          )}
        </Card>

      </div>
    </div>
  );
}
