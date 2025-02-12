
import { Beer, Clock, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

interface ComparisonHistoryProps {
  history: ComparisonRecord[];
  onClearHistory: () => void;
}

export const ComparisonHistory = ({ history, onClearHistory }: ComparisonHistoryProps) => {
  return (
    <Card className="p-4 sm:p-6 shadow-lg bg-white/90 dark:bg-black/40 backdrop-blur-sm border-amber-100 dark:border-amber-800 animate-fade-in transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <h2 className="text-xl font-semibold text-amber-900 dark:text-amber-100">Histórico</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearHistory}
          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          <span className="text-xs sm:text-sm">Limpar Histórico</span>
        </Button>
      </div>

      <div className="space-y-4">
        {history.map((record) => (
          <div
            key={record.id}
            className="p-3 bg-amber-50/50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800/50 transition-all duration-300 hover:scale-[1.01] animate-fade-in"
          >
            <div className="flex items-center gap-2 mb-2 text-xs sm:text-sm text-amber-700 dark:text-amber-300">
              <Beer className="h-4 w-4" />
              <span>{record.date}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr>
                    <th className="text-left py-1 px-2 text-amber-700 dark:text-amber-300 font-medium">
                      Cerveja
                    </th>
                    <th className="text-right py-1 px-2 text-amber-700 dark:text-amber-300 font-medium">
                      Volume
                    </th>
                    <th className="text-right py-1 px-2 text-amber-700 dark:text-amber-300 font-medium">
                      Preço
                    </th>
                    <th className="text-right py-1 px-2 text-amber-700 dark:text-amber-300 font-medium">
                      Preço/L
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {record.results.map((result, index) => (
                    <tr
                      key={result.id}
                      className={`transition-colors ${
                        result.isLowestPrice
                          ? "text-green-700 dark:text-green-300 font-medium"
                          : "text-amber-800 dark:text-amber-200"
                      }`}
                    >
                      <td className="py-1 px-2">
                        Cerveja {index + 1}
                        {result.isLowestPrice && (
                          <span className="ml-1">🏆</span>
                        )}
                      </td>
                      <td className="text-right py-1 px-2">
                        {result.volume}ml
                      </td>
                      <td className="text-right py-1 px-2">
                        R$ {result.price}
                      </td>
                      <td className="text-right py-1 px-2">
                        R$ {result.pricePerLiter.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
