
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { menuItems } from "./SidebarNav";

interface MobileNavProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const MobileNav = ({ isOpen, onToggle }: MobileNavProps) => {
  const location = useLocation();

  return (
    <>
      {/* Botão do menu */}
      <div className="lg:hidden fixed top-safe-top right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={onToggle}
          className="bg-white/90 dark:bg-black/40 backdrop-blur-md border-amber-100 dark:border-amber-800 shadow-lg"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Menu móvel */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onToggle}
          />
          <Card className="fixed inset-y-0 left-0 w-[85%] max-w-[320px] p-4 bg-white/90 dark:bg-black/90 border-r border-amber-100 dark:border-amber-800 animate-in slide-in-from-left">
            <div className="space-y-6 safe-area-inset-top">
              <div className="px-3 py-2">
                <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-100">
                  Comparador de Preços
                </h2>
              </div>
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onToggle}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all active:scale-95",
                      location.pathname === item.path
                        ? "bg-amber-100 dark:bg-amber-900 text-amber-900 dark:text-amber-100"
                        : "hover:bg-amber-50 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-200"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-amber-600 dark:text-amber-400">
                        {item.description}
                      </div>
                    </div>
                  </Link>
                ))}
              </nav>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};
