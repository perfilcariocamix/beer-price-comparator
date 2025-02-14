
import { useState, useEffect, useRef } from "react";
import { Plus, ArrowUpCircle, Beer, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { BeerEntryForm } from "@/components/BeerEntryForm";
import { ResultsTable } from "@/components/ResultsTable";
import { ComparisonHistory } from "@/components/ComparisonHistory";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface BeerEntry {
  id: string;
  volume: string;
  customVolume?: string;
  price: string;
}

interface BeerResult {
  id: string;
  volume: string;
  price: string;
  pricePerLiter: number;
  isLowestPrice: boolean;
}

interface ComparisonRecord {
  id: string;
  date: string;
  results: BeerResult[];
}

const BeerCalculator = () => {
  const { toast } = useToast();
  const resultsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [beerEntries, setBeerEntries] = useState<BeerEntry[]>([
    { id: "1", volume: "", price: "" },
    { id: "2", volume: "", price: "" },
    { id: "3", volume: "", price: "" },
  ]);
  const [results, setResults] = useState<BeerResult[]>([]);
  const [history, setHistory] = useState<ComparisonRecord[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem("comparisonHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const saveToHistory = (results: BeerResult[]) => {
    const newRecord: ComparisonRecord = {
      id: new Date().getTime().toString(),
      date: new Date().toLocaleString('pt-BR'),
      results
    };

    const updatedHistory = [newRecord, ...history].slice(0, 10);
    setHistory(updatedHistory);
    localStorage.setItem("comparisonHistory", JSON.stringify(updatedHistory));
  };

  const handleVolumeChange = (value: string, id: string) => {
    setBeerEntries((prev) =>
      prev.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              volume: value,
              customVolume: value === "custom" ? "" : undefined,
            }
          : entry
      )
    );
  };

  const handleCustomVolumeChange = (value: string, id: string) => {
    setBeerEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, customVolume: value } : entry
      )
    );
  };

  const handlePriceChange = (value: string, id: string) => {
    setBeerEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, price: value } : entry
      )
    );
  };

  const addNewBeer = () => {
    setBeerEntries((prev) => [
      ...prev,
      { id: String(prev.length + 1), volume: "", price: "" },
    ]);
  };

  const removeBeer = (id: string) => {
    if (beerEntries.length <= 1) {
      toast({
        title: "Não é possível remover",
        description: "É necessário manter pelo menos 1 cerveja para comparação",
        variant: "destructive",
      });
      return;
    }
    setBeerEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const resetForm = () => {
    scrollToForm();
  };

  const calculateResults = () => {
    const validEntries = beerEntries.filter((entry) => {
      const volume =
        entry.volume === "custom"
          ? parseFloat(entry.customVolume || "0")
          : parseFloat(entry.volume);
      const price = parseFloat(entry.price);
      return volume > 0 && price > 0 && !isNaN(volume) && !isNaN(price);
    });

    if (validEntries.length === 0) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha os dados de pelo menos uma cerveja",
        variant: "destructive",
      });
      return;
    }

    const calculations = validEntries.map((entry) => {
      const volume =
        entry.volume === "custom"
          ? parseFloat(entry.customVolume || "0")
          : parseFloat(entry.volume);
      const price = parseFloat(entry.price);
      const pricePerLiter = price / (volume / 1000);
      return { 
        id: entry.id, 
        volume: entry.volume === "custom" ? entry.customVolume! : entry.volume,
        price: entry.price,
        pricePerLiter 
      };
    });

    const lowestPrice = Math.min(...calculations.map((c) => c.pricePerLiter));

    const newResults = calculations.map((calc) => ({
      ...calc,
      isLowestPrice: calc.pricePerLiter === lowestPrice,
    }));

    setResults(newResults);
    saveToHistory(newResults);

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("comparisonHistory");
    toast({
      title: "Histórico limpo",
      description: "O histórico de comparações foi apagado com sucesso",
    });
  };

  return (
    <div className="space-y-6">
      <div ref={formRef} className="relative py-3 mb-4">
        {/* Fundo decorativo mais sutil */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-100/30 to-orange-100/30 dark:from-amber-900/20 dark:to-orange-900/20 transform -skew-y-1" />
        
        {/* Cabeçalho mais compacto e moderno */}
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
      </div>

      <Card className="p-4 sm:p-6 shadow-lg bg-white/90 dark:bg-black/40 backdrop-blur-sm border-amber-100 dark:border-amber-800 animate-fade-in transition-all duration-300">
        <div className="space-y-4">
          {beerEntries.map((entry, index) => (
            <BeerEntryForm
              key={entry.id}
              entry={entry}
              index={index}
              showRemoveButton={beerEntries.length > 1}
              onVolumeChange={handleVolumeChange}
              onCustomVolumeChange={handleCustomVolumeChange}
              onPriceChange={handlePriceChange}
              onRemove={removeBeer}
            />
          ))}

          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-2">
            <Button
              variant="outline"
              onClick={addNewBeer}
              className="flex items-center gap-2 w-full sm:w-auto border-amber-200 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/50 dark:text-amber-100 transition-all duration-300"
            >
              <Plus className="h-4 w-4" />
              Adicionar Cerveja
            </Button>

            <Button 
              onClick={calculateResults} 
              className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600 text-white transition-all duration-300"
            >
              Calcular
            </Button>
          </div>
        </div>
      </Card>

      <div ref={resultsRef} className="space-y-4">
        <ResultsTable results={results} />
        {results.length > 0 && (
          <div className="flex justify-center animate-fade-in">
            <Button
              onClick={resetForm}
              variant="outline"
              className="group flex items-center gap-2 border-amber-200 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/50 dark:text-amber-100 transition-all duration-300 hover:scale-105"
            >
              <ArrowUpCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 group-hover:animate-bounce" />
              Nova Comparação
            </Button>
          </div>
        )}
      </div>
      
      {history.length > 0 && (
        <ComparisonHistory history={history} onClearHistory={clearHistory} />
      )}
    </div>
  );
};

export default BeerCalculator;
