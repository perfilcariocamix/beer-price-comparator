
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Beer, Calculator, BookOpen, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      icon: Beer,
      label: "Calculadora de Cerveja",
      description: "Compare preços de cervejas",
      path: "/",
    },
    {
      icon: Calculator,
      label: "Calculadora de Drinks",
      description: "Compare preços de drinks",
      path: "/drinks",
    },
    {
      icon: Calculator,
      label: "Calculadora de Vinhos",
      description: "Compare preços de vinhos",
      path: "/vinhos",
    },
    {
      icon: BookOpen,
      label: "Blog",
      description: "Dicas e novidades",
      path: "/blog",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950">
      {/* Menu móvel */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="bg-white/90 dark:bg-black/40 backdrop-blur-sm border-amber-100 dark:border-amber-800"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar para desktop */}
      <div className="hidden lg:flex">
        <Card className="fixed left-0 top-0 h-screen w-64 p-4 bg-white/90 dark:bg-black/40 backdrop-blur-sm border-r border-amber-100 dark:border-amber-800">
          <div className="space-y-6">
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
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
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

      {/* Menu móvel overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm">
          <Card className="fixed inset-y-0 left-0 w-64 p-4 bg-white/90 dark:bg-black/90 border-r border-amber-100 dark:border-amber-800 animate-in slide-in-from-left">
            <div className="space-y-6">
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
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
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

      {/* Conteúdo principal */}
      <main className="lg:pl-64 min-h-screen">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Index;
