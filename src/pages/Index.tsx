
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarNav } from "@/components/navigation/SidebarNav";
import { MobileNav } from "@/components/navigation/MobileNav";
import { TooltipProvider } from "@/components/ui/tooltip";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 overflow-x-hidden">
      {/* Menu móvel */}
      <MobileNav isOpen={isMenuOpen} onToggle={() => setIsMenuOpen(!isMenuOpen)} />

      {/* Sidebar para desktop */}
      <div className="hidden lg:flex">
        <SidebarNav />
      </div>

      {/* Conteúdo principal */}
      <main className="lg:pl-64 min-h-[100dvh]">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 pb-24">
          <TooltipProvider>
            <Outlet />
          </TooltipProvider>
        </div>
      </main>
    </div>
  );
};

export default Index;
