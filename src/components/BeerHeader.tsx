
import { Beer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export const BeerHeader = () => {
  return (
    <div className="relative">
      <div className="flex items-center justify-center gap-2">
        <Beer className="h-6 w-6 text-amber-600 dark:text-amber-400" />
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400">
          Calculadora de Preço
        </h1>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 hover:bg-transparent"
            >
              <span className="sr-only">Informações</span>
              <div className="h-1.5 w-1.5 rounded-full bg-amber-600/70 hover:bg-amber-600 dark:bg-amber-400/70 dark:hover:bg-amber-400 transition-colors" />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 p-4 bg-white/95 dark:bg-black/95 backdrop-blur-sm border-amber-100 dark:border-amber-800">
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Compare os preços e encontre a melhor opção para o seu bolso. 
              Adicione as cervejas que deseja comparar, informando o volume e o preço de cada uma.
            </p>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  );
};
