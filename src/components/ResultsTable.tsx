
import { Card } from "@/components/ui/card";
import { Beer } from "lucide-react";

interface BeerResult {
  id: string;
  pricePerLiter: number;
  isLowestPrice: boolean;
}

interface ResultsTableProps {
  results: BeerResult[];
}

export const ResultsTable = ({ results }: ResultsTableProps) => {
  if (results.length === 0) return null;

  return (
    <Card className="p-4 sm:p-6 shadow-lg bg-white/90 dark:bg-black/40 backdrop-blur-sm border-amber-100 dark:border-amber-800 animate-fade-in transition-all duration-300">
      <div className="flex items-center gap-2 mb-4">
        <Beer className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        <h2 className="text-xl font-semibold text-amber-900 dark:text-amber-100">Resultados</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left py-2 px-4 text-amber-700 dark:text-amber-300 font-medium border-b border-amber-100 dark:border-amber-800">
                Cerveja
              </th>
              <th className="text-right py-2 px-4 text-amber-700 dark:text-amber-300 font-medium border-b border-amber-100 dark:border-amber-800">
                Preço por Litro
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr
                key={result.id}
                className={`transition-all duration-300 transform hover:scale-[1.02] ${
                  result.isLowestPrice
                    ? "bg-green-50 dark:bg-green-900/30 text-green-900 dark:text-green-100 hover:bg-green-100 dark:hover:bg-green-900/50"
                    : "hover:bg-amber-50 dark:hover:bg-amber-900/30"
                }`}
              >
                <td className="py-3 px-4 border-b border-amber-50 dark:border-amber-800/50">
                  Cerveja {index + 1}
                  {result.isLowestPrice && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
                      Melhor Preço! 🎉
                    </span>
                  )}
                </td>
                <td className="text-right py-3 px-4 border-b border-amber-50 dark:border-amber-800/50 font-medium">
                  R$ {result.pricePerLiter.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
