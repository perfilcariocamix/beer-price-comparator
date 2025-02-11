
import { Beer, Clock, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

interface ComparisonHistoryProps {
  history: ComparisonRecord[];
  onClearHistory: () => void;
}

export const ComparisonHistory = ({ history, onClearHistory }: ComparisonHistoryProps) => {
  return (
    <Card className="p-4 sm:p-6 shadow-lg bg-white/90 backdrop-blur-sm border-amber-100 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-amber-600" />
          <h2 className="text-xl font-semibold text-amber-900">Histórico</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearHistory}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Limpar Histórico
        </Button>
      </div>

      <div className="space-y-4">
        {history.map((record) => (
          <div
            key={record.id}
            className="p-3 bg-amber-50/50 rounded-lg border border-amber-100"
          >
            <div className="flex items-center gap-2 mb-2 text-sm text-amber-700">
              <Beer className="h-4 w-4" />
              <span>{record.date}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left py-1 px-2 text-amber-700 font-medium">
                      Cerveja
                    </th>
                    <th className="text-right py-1 px-2 text-amber-700 font-medium">
                      Preço/L
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {record.results.map((result, index) => (
                    <tr
                      key={result.id}
                      className={result.isLowestPrice ? "text-green-700 font-medium" : ""}
                    >
                      <td className="py-1 px-2">Cerveja {index + 1}</td>
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
