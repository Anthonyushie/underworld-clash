import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { GameSidebar } from "./GameSidebar";
import { ResponsiveGameLayout } from "./ResponsiveGameLayout";
import { Menu } from "lucide-react";
import heroImage from "@/assets/mafia-cityscape.jpg";

interface GameLayoutProps {
  children: React.ReactNode;
}

export function GameLayout({ children }: GameLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-background">
        {/* Header */}
        <header 
          className="h-48 bg-cover bg-center bg-no-repeat border-b border-primary relative"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/90" />
          <div className="relative h-full flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="p-2 bg-primary/10 border border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded">
                <Menu className="h-4 w-4" />
              </SidebarTrigger>
              <div>
                <h1 className="text-4xl font-bold text-primary">YakuzHonne</h1>
                <p className="text-lg text-muted-foreground">Build Your Criminal Empire</p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex w-full">
          <GameSidebar />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}