"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Save, Terminal } from "lucide-react";

export default function IniEditorPage() {
  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState("config.ini");
  
  return (
    <div className="flex flex-col flex-1 p-8 md:p-12 pb-32 h-full bg-background">
      <div className="mb-8 flex items-center gap-3">
        <div className="w-1.5 h-8 bg-primary rounded-full"></div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">INI Editor</h1>
          <p className="text-muted-foreground max-w-2xl text-sm font-medium">
            Edit your configuration files directly from the browser. 
            Upload a file or paste your INI content below.
          </p>
        </div>
      </div>

      <div className="flex flex-col flex-1 gap-6">
        <Card className="flex-1 flex flex-col p-0 overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm shadow-md">
          {/* Toolbar */}
          <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/30">
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-background border border-border/50 px-3 py-1.5 rounded-md shadow-sm">
                <Terminal className="w-4 h-4 text-muted-foreground mr-2" />
                <Input 
                  type="text" 
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-48 bg-transparent border-0 h-6 px-0 focus-visible:ring-0 rounded-none text-sm font-mono font-medium shadow-none"
                />
              </div>
              <div className="h-6 w-px bg-border/50"></div>
              <Button variant="outline" size="sm" className="gap-2 font-semibold text-xs shadow-sm">
                <Upload className="w-4 h-4" />
                Upload File
              </Button>
            </div>
            <Button size="sm" className="gap-2 font-semibold text-xs shadow-sm">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
          
          {/* Editor Area */}
          <CardContent className="flex-1 p-0 flex flex-col bg-background relative group">
            <div className="absolute top-3 right-5 text-xs font-mono text-muted-foreground/60 select-none bg-muted/50 px-2 py-1 rounded">
              UTF-8 • LF
            </div>
            <Textarea
              className="flex-1 w-full bg-transparent resize-none outline-none font-mono text-[13px] leading-relaxed border-0 focus-visible:ring-0 rounded-none p-6 text-foreground placeholder:text-muted-foreground/40 shadow-none"
              placeholder="; Example Configuration&#10;[Section]&#10;Key=Value"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              spellCheck={false}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
