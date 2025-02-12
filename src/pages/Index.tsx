import { useState, useEffect, useRef } from "react";
import { Plus, ArrowUpCircle, Beer, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { BeerEntryForm } from "@/components/BeerEntryForm";
import { ResultsTable } from "@/components/ResultsTable";
import { ComparisonHistory } from "@/components/ComparisonHistory";
import { useTheme } from "next-themes";

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

const Index = () => {
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
  const { theme, setTheme } = useTheme();

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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 py-4 px-4 sm:py-8 sm:px-6 lg:px-8 animate-fade-in transition-colors duration-300">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full w-10 h-10 bg-white/90 dark:bg-black/40 backdrop-blur-sm border border-amber-100 dark:border-amber-800 transition-all duration-300 hover:scale-110"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-600" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-amber-400" />
            <span className="sr-only">Alternar tema</span>
          </Button>
        </div>

        <div ref={formRef} className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-amber-900 dark:text-amber-100 mb-2 transition-colors">
            🍺 Calculadora de Preço
          </h1>
          <p className="text-amber-700 dark:text-amber-300 text-sm sm:text-base transition-colors">
            Compare os preços e encontre a melhor opção
          </p>
        </div>

        <Card className="p-4 sm:p-6 shadow-lg bg-white/90 dark:bg-black/40 backdrop-blur-sm border-amber-100 dark:border-amber-800 transition-all duration-300">
          <div className="space-y-6">
            {beerEntries.map((entry, index) => (
              <div
                key={entry.id}
                className="animate-fade-in transform transition-all duration-300 hover:scale-[1.01]"
              >
                <BeerEntryForm
                  entry={entry}
                  index={index}
                  showRemoveButton={beerEntries.length > 1}
                  onVolumeChange={handleVolumeChange}
                  onCustomVolumeChange={handleCustomVolumeChange}
                  onPriceChange={handlePriceChange}
                  onRemove={removeBeer}
                />
              </div>
            ))}

            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-4">
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
    </div>
  );
};

export default Index;
