
import { Link, useLocation } from "react-router-dom";
import { Beer, Calculator, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const menuItems = [
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

export const SidebarNav = () => {
  const location = useLocation();

  return (
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
  );
};
