
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { BeerEntryForm } from "@/components/BeerEntryForm";
import { ResultsTable } from "@/components/ResultsTable";

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

const Index = () => {
  const { toast } = useToast();
  const [beerEntries, setBeerEntries] = useState<BeerEntry[]>([
    { id: "1", volume: "", price: "" },
    { id: "2", volume: "", price: "" },
    { id: "3", volume: "", price: "" },
  ]);
  const [results, setResults] = useState<BeerResult[]>([]);

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

    setResults(
      calculations.map((calc) => ({
        ...calc,
        isLowestPrice: calc.pricePerLiter === lowestPrice,
      }))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 py-4 px-4 sm:py-8 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
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

        <ResultsTable results={results} />
      </div>
    </div>
  );
};

export default Index;
