"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Package, Search, Filter, Upload, Download, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { DDSIcon } from "@/components/item-manager/dds-icon";

interface Item {
  id: string;
  name: string;
  code: string;
  type: string;
  image: string;
  level: string;
}

export default function ItemManagerPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const loadItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/items");
      const data = await res.json();
      if (data.items) {
        setItems(data.items);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(
    (item) => item.name.toLowerCase().includes(search.toLowerCase()) || item.id.includes(search)
  );

  return (
    <div className="flex flex-col flex-1 p-8 pb-32 h-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-border/50 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Package className="w-8 h-8 text-primary" />
            Item Manager
          </h1>
          <p className="text-muted-foreground mt-1">
            Browse, search, and edit Lost Saga item definitions.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="text-xs h-9 shadow-sm" onClick={loadItems} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
            {loading ? "Loading..." : "Load from Folder"}
          </Button>
          <Button className="text-xs h-9 font-semibold shadow-sm">
            <Download className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <Card className="border-border/50 bg-card/30 backdrop-blur-[2px] shadow-sm flex-1 flex flex-col min-h-[500px] overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-card/50 py-4 flex flex-row items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search items by ID or Name..."
                className="h-9 w-64 rounded-md border border-input bg-background pl-9 pr-3 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <Button variant="outline" className="h-9 text-xs px-3">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
          <Button className="h-9 text-xs px-3 bg-zinc-800 text-zinc-100 hover:bg-zinc-700">
            <Plus className="w-4 h-4 mr-2" />
            New Item
          </Button>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-auto bg-zinc-950/50">
          {items.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-muted-foreground">
              <Package className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-sm font-medium">No items loaded</p>
              <p className="text-xs mt-1">Click &quot;Load from Folder&quot; to read item definitions.</p>
            </div>
          ) : (
            <div className="w-full p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredItems.map((item) => (
                  <div key={item.id} className="flex flex-col bg-zinc-900/50 border border-border/50 rounded-lg p-4 hover:bg-zinc-800/50 transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer group relative overflow-hidden">
                    <div className="absolute top-2 right-2 text-[10px] font-mono text-zinc-600 group-hover:text-amber-500/50 transition-colors">#{item.id}</div>
                    
                    <div className="flex justify-center mb-4 mt-2">
                      {item.image ? (
                        <div className="transform group-hover:scale-110 transition-transform duration-300">
                          <DDSIcon imageRef={item.image} />
                        </div>
                      ) : (
                        <div className="w-12 h-12 flex items-center justify-center bg-zinc-950 rounded text-[10px] text-muted-foreground border border-border/50">N/A</div>
                      )}
                    </div>
                    
                    <div className="text-center flex flex-col flex-1">
                      <h3 className="font-bold text-sm text-zinc-200 truncate px-2" title={item.name}>{item.name}</h3>
                      <div className="text-[10px] text-zinc-500 font-mono mt-1 mb-3 truncate px-2">{item.code || "No Code"}</div>
                      
                      <div className="flex justify-between items-center text-xs mt-auto pt-3 border-t border-border/10">
                        <div className="flex flex-col items-center flex-1 border-r border-border/10">
                          <span className="text-[9px] uppercase tracking-wider text-muted-foreground mb-0.5">Type</span>
                          <span className="text-amber-500 font-medium">{item.type || "-"}</span>
                        </div>
                        <div className="flex flex-col items-center flex-1">
                          <span className="text-[9px] uppercase tracking-wider text-muted-foreground mb-0.5">Level</span>
                          <span className="text-emerald-500 font-medium">{item.level || "0"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
