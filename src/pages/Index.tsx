
import { useState, useEffect, useRef } from "react";
import { Plus, ArrowUpCircle, Beer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { BeerEntryForm } from "@/components/BeerEntryForm";
import { ResultsTable } from "@/components/ResultsTable";
import { ComparisonHistory } from "@/components/ComparisonHistory";

interface BeerEntry {
  id: string;
  volume: string;
  customVolume?: string;
  price: string;
}

interface BeerResult {
  id: string;
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
    setBeerEntries([
      { id: "1", volume: "", price: "" },
      { id: "2", volume: "", price: "" },
      { id: "3", volume: "", price: "" },
    ]);
    scrollToForm();
    toast({
      title: "Nova comparação",
      description: "Os campos foram limpos para uma nova comparação",
    });
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
      return { id: entry.id, pricePerLiter };
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

    toast({
      title: "Cálculo realizado!",
      description: "Confira os resultados abaixo",
    });
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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 py-4 px-4 sm:py-8 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-3xl mx-auto space-y-6">
        <div ref={formRef} className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-amber-900 mb-2">
            🍺 Calculadora de Preço
          </h1>
          <p className="text-amber-700 text-sm sm:text-base">
            Compare os preços e encontre a melhor opção
          </p>
        </div>

        <Card className="p-4 sm:p-6 shadow-lg bg-white/90 backdrop-blur-sm border-amber-100">
          <div className="space-y-6">
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

            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-4">
              <Button
                variant="outline"
                onClick={addNewBeer}
                className="flex items-center gap-2 w-full sm:w-auto border-amber-200 hover:bg-amber-50"
              >
                <Plus className="h-4 w-4" />
                Adicionar Cerveja
              </Button>
              <Button 
                onClick={calculateResults} 
                className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white"
              >
                Calcular
              </Button>
            </div>
          </div>
        </Card>

        <div ref={resultsRef} className="space-y-4">
          <ResultsTable results={results} />
          {results.length > 0 && (
            <div className="flex justify-center">
              <Button
                onClick={resetForm}
                variant="outline"
                className="group flex items-center gap-2 border-amber-200 hover:bg-amber-50 transition-all duration-300 hover:scale-105"
              >
                <ArrowUpCircle className="h-5 w-5 text-amber-600 group-hover:animate-bounce" />
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

