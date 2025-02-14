
import { useState, useEffect, useRef } from "react";
import { Plus, ArrowUpCircle, Beer } from "lucide-react";
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
      <div ref={formRef} className="relative py-4 mb-4">
        {/* Fundo decorativo com gradiente suave */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-100/30 to-orange-100/30 dark:from-amber-900/20 dark:to-orange-900/20 transform -skew-y-1" />
        
        {/* Cabeçalho mais compacto e moderno */}
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
