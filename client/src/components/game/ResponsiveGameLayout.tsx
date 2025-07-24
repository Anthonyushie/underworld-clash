import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { GameSidebar } from "./GameSidebar";
import { Menu } from "lucide-react";
import heroImage from "@/assets/mafia-cityscape.jpg";
import { cn } from "@/lib/utils";

interface ResponsiveGameLayoutProps {
  children: React.ReactNode;
}

export function ResponsiveGameLayout({ children }: ResponsiveGameLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-background">
        {/* Responsive Header */}
        <header 
          className={cn(
            "bg-cover bg-center bg-no-repeat border-b border-primary relative",
            // Responsive height
            "h-32 sm:h-40 md:h-48"
          )}
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/90" />
          <div className="relative h-full flex items-center justify-between px-3 sm:px-4 md:px-6">
            <div className="flex items-center gap-2 sm:gap-4">
              <SidebarTrigger className={cn(
                "p-2 bg-primary/10 border border-primary text-primary",
                "hover:bg-primary hover:text-primary-foreground rounded",
                // Responsive trigger size
                "h-8 w-8 sm:h-10 sm:w-10"
              )}>
                <Menu className="h-3 w-3 sm:h-4 sm:w-4" />
              </SidebarTrigger>
              <div>
                <h1 className={cn(
                  "font-bold text-primary",
                  // Responsive title size
                  "text-2xl sm:text-3xl md:text-4xl"
                )}>
                  YakuzHonne
                </h1>
                <p className={cn(
                  "text-muted-foreground",
                  // Responsive subtitle size
                  "text-sm sm:text-base md:text-lg"
                )}>
                  Build Your Criminal Empire
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex w-full">
          <GameSidebar />
          <main className={cn(
            "flex-1",
            // Responsive padding
            "p-3 sm:p-4 md:p-6",
            // Ensure proper overflow handling on mobile
            "overflow-x-hidden"
          )}>
            <div className={cn(
              // Responsive container
              "w-full max-w-7xl mx-auto",
              // Responsive spacing
              "space-y-3 sm:space-y-4 md:space-y-6"
            )}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}