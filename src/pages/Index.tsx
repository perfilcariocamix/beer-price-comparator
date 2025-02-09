
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

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

  const volumeOptions = [
    { value: "269", label: "269 ml" },
    { value: "300", label: "300 ml" },
    { value: "330", label: "330 ml" },
    { value: "350", label: "350 ml" },
    { value: "473", label: "473 ml" },
    { value: "600", label: "600 ml" },
    { value: "1000", label: "1000 ml" },
    { value: "custom", label: "Outro" },
  ];

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
    if (beerEntries.length <= 3) {
      toast({
        title: "Não é possível remover",
        description: "É necessário manter pelo menos 3 cervejas para comparação",
        variant: "destructive",
      });
      return;
    }
    setBeerEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const calculateResults = () => {
    // Validate inputs
    const invalidEntries = beerEntries.filter((entry) => {
      const volume =
        entry.volume === "custom"
          ? parseFloat(entry.customVolume || "0")
          : parseFloat(entry.volume);
      const price = parseFloat(entry.price);
      return !volume || !price || isNaN(volume) || isNaN(price);
    });

    if (invalidEntries.length > 0) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos corretamente",
        variant: "destructive",
      });
      return;
    }

    // Calculate price per liter for each entry
    const calculations = beerEntries.map((entry) => {
      const volume =
        entry.volume === "custom"
          ? parseFloat(entry.customVolume || "0")
          : parseFloat(entry.volume);
      const price = parseFloat(entry.price);
      const pricePerLiter = price / (volume / 1000);
      return { id: entry.id, pricePerLiter };
    });

    // Find lowest price
    const lowestPrice = Math.min(...calculations.map((c) => c.pricePerLiter));

    // Set results with highlighted lowest price
    setResults(
      calculations.map((calc) => ({
        ...calc,
        isLowestPrice: calc.pricePerLiter === lowestPrice,
      }))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Calculadora de Preço de Cerveja
          </h1>
          <p className="text-gray-600">
            Compare os preços e encontre a melhor opção
          </p>
        </div>

        <Card className="p-6 shadow-lg bg-white/80 backdrop-blur-sm">
          <div className="space-y-6">
            {beerEntries.map((entry, index) => (
              <div
                key={entry.id}
                className="grid grid-cols-1 sm:grid-cols-[1fr,1fr,auto] gap-4 items-end relative group"
              >
                <div className="space-y-2">
                  <label
                    htmlFor={`volume-${entry.id}`}
                    className="text-sm font-medium text-gray-700"
                  >
                    Cerveja {index + 1} (ml)
                  </label>
                  <Select
                    value={entry.volume}
                    onValueChange={(value) => handleVolumeChange(value, entry.id)}
                  >
                    <SelectTrigger id={`volume-${entry.id}`}>
                      <SelectValue placeholder="Selecione o volume" />
                    </SelectTrigger>
                    <SelectContent>
                      {volumeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {entry.volume === "custom" && (
                    <Input
                      type="number"
                      placeholder="Volume em ml"
                      value={entry.customVolume}
                      onChange={(e) =>
                        handleCustomVolumeChange(e.target.value, entry.id)
                      }
                      className="mt-2"
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor={`price-${entry.id}`}
                    className="text-sm font-medium text-gray-700"
                  >
                    Preço (R$)
                  </label>
                  <Input
                    id={`price-${entry.id}`}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={entry.price}
                    onChange={(e) => handlePriceChange(e.target.value, entry.id)}
                  />
                </div>
                {index >= 3 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeBeer(entry.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
            ))}

            <div className="flex justify-between items-center pt-4">
              <Button
                variant="outline"
                onClick={addNewBeer}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Adicionar Cerveja
              </Button>
              <Button onClick={calculateResults} className="bg-green-600 hover:bg-green-700">
                Calcular
              </Button>
            </div>
          </div>
        </Card>

        {results.length > 0 && (
          <Card className="p-6 shadow-lg bg-white/80 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Resultados
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left py-2 px-4 text-gray-600 font-medium">
                      Cerveja
                    </th>
                    <th className="text-right py-2 px-4 text-gray-600 font-medium">
                      Preço por Litro
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr
                      key={result.id}
                      className={`transition-colors ${
                        result.isLowestPrice
                          ? "bg-green-50 text-green-900"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="py-2 px-4">Cerveja {index + 1}</td>
                      <td className="text-right py-2 px-4">
                        R$ {result.pricePerLiter.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
