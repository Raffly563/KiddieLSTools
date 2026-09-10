"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, Grid, Environment } from "@react-three/drei";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Layers, Settings2, Box, Image as ImageIcon } from "lucide-react";

export default function ModelViewerPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* 3D Canvas Area */}
      <div className="flex-1 relative bg-black/90">
        <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
          <color attach="background" args={["#000000"]} />
          <fog attach="fog" args={["#000000", 10, 50]} />
          
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          
          <OrbitControls makeDefault />
          <Grid infiniteGrid fadeDistance={40} fadeStrength={5} sectionColor="#f59e0b" cellColor="#333333" />
          
          <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.2} metalness={0.8} />
          </mesh>

          <Environment preset="city" />
        </Canvas>
        
        {/* Overlay Controls */}
        <div className="absolute top-6 left-6 flex gap-2">
          <Button variant="outline" className="bg-background/50 backdrop-blur-md shadow-sm h-9 text-xs">
            <Box className="w-4 h-4 mr-2" /> Load Model
          </Button>
          <Button variant="outline" className="bg-background/50 backdrop-blur-md shadow-sm h-9 text-xs">
            <ImageIcon className="w-4 h-4 mr-2" /> Load Texture
          </Button>
        </div>
      </div>

      {/* Right Properties Panel */}
      <div className="w-80 shrink-0 border-l border-border/50 bg-card/30 backdrop-blur-sm flex flex-col z-10 shadow-xl relative">
        <div className="h-[73px] border-b border-border/50 flex items-center px-6">
          <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-primary" />
            Properties
          </h2>
        </div>
        
        <div className="p-6 flex-1 overflow-auto flex flex-col gap-6">
          {/* Scene Hierarchy */}
          <Card className="bg-card/50 border-border/50 shadow-none">
            <CardHeader className="py-3 px-4 border-b border-border/50">
              <CardTitle className="text-xs uppercase tracking-wider font-bold flex items-center gap-2 text-muted-foreground">
                <Layers className="w-3.5 h-3.5" /> Scene Hierarchy
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 text-sm text-zinc-400">
              <div className="flex items-center gap-2 py-1">
                <Box className="w-4 h-4 text-primary" /> Default_Cube
              </div>
            </CardContent>
          </Card>

          {/* Transform */}
          <Card className="bg-card/50 border-border/50 shadow-none">
            <CardHeader className="py-3 px-4 border-b border-border/50">
              <CardTitle className="text-xs uppercase tracking-wider font-bold flex items-center gap-2 text-muted-foreground">
                Transform
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex flex-col gap-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground w-16">Position</span>
                <div className="flex gap-2">
                  <div className="bg-zinc-900 rounded px-2 py-1 text-xs text-zinc-300 w-12 text-center border border-border/50">X: 0</div>
                  <div className="bg-zinc-900 rounded px-2 py-1 text-xs text-zinc-300 w-12 text-center border border-border/50">Y: 0.5</div>
                  <div className="bg-zinc-900 rounded px-2 py-1 text-xs text-zinc-300 w-12 text-center border border-border/50">Z: 0</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
