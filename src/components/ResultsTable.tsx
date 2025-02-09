
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
    <Card className="p-4 sm:p-6 shadow-lg bg-white/90 backdrop-blur-sm border-amber-100 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Beer className="h-5 w-5 text-amber-600" />
        <h2 className="text-xl font-semibold text-amber-900">Resultados</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left py-2 px-4 text-amber-700 font-medium border-b border-amber-100">
                Cerveja
              </th>
              <th className="text-right py-2 px-4 text-amber-700 font-medium border-b border-amber-100">
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
                    ? "bg-green-50 text-green-900 hover:bg-green-100"
                    : "hover:bg-amber-50"
                }`}
              >
                <td className="py-3 px-4 border-b border-amber-50">
                  Cerveja {index + 1}
                </td>
                <td className="text-right py-3 px-4 border-b border-amber-50 font-medium">
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
