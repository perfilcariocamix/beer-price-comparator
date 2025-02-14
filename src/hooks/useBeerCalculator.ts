
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { BeerEntry, BeerResult, ComparisonRecord } from "@/types/beer";

export const useBeerCalculator = () => {
  const { toast } = useToast();
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
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("comparisonHistory");
    toast({
      title: "Histórico limpo",
      description: "O histórico de comparações foi apagado com sucesso",
    });
  };

  return {
    beerEntries,
    results,
    history,
    handleVolumeChange,
    handleCustomVolumeChange,
    handlePriceChange,
    addNewBeer,
    removeBeer,
    calculateResults,
    clearHistory,
  };
};
