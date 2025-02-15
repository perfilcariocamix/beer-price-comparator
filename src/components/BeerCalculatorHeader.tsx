
import { Beer, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export const BeerCalculatorHeader = () => {
  return (
    <div className="relative flex items-center justify-center gap-2">
      <Beer className="h-5 w-5 text-amber-600 dark:text-amber-400" />
      <h1 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400">
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
            <Info className="h-4 w-4 text-amber-600/70 hover:text-amber-600 dark:text-amber-400/70 dark:hover:text-amber-400 transition-colors" />
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80 p-4 space-y-3 bg-white/95 dark:bg-black/95 backdrop-blur-sm border-amber-100 dark:border-amber-800">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Compare os preços e encontre a melhor opção para o seu bolso. 
          </p>
          <div className="space-y-2 text-sm text-amber-700/90 dark:text-amber-300/90">
            <p>Como usar:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Selecione o volume da cerveja ou insira um volume personalizado</li>
              <li>Digite o preço de cada cerveja</li>
              <li>Adicione mais cervejas para comparar clicando em "Adicionar Cerveja"</li>
              <li>Clique em "Calcular" para ver qual é a opção mais econômica</li>
            </ul>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};
