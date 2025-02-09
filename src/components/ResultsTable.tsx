
import { Card } from "@/components/ui/card";

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
    <Card className="p-6 shadow-lg bg-white/80 backdrop-blur-sm">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Resultados</h2>
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
  );
};
