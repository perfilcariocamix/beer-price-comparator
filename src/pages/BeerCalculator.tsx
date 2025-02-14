
import { useRef } from "react";
import { Plus, ArrowUpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BeerEntryForm } from "@/components/BeerEntryForm";
import { ResultsTable } from "@/components/ResultsTable";
import { ComparisonHistory } from "@/components/ComparisonHistory";
import { BeerHeader } from "@/components/BeerHeader";
import { useBeerCalculator } from "@/hooks/useBeerCalculator";

const BeerCalculator = () => {
  const resultsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  
  const {
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
  } = useBeerCalculator();

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const resetForm = () => {
    scrollToForm();
  };

  return (
    <div className="space-y-6">
      <div ref={formRef} className="relative py-4 mb-4">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-100/30 to-orange-100/30 dark:from-amber-900/20 dark:to-orange-900/20 transform -skew-y-1" />
        <BeerHeader />
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
