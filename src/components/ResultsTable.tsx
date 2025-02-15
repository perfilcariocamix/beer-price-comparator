
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Beer, Share2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface BeerResult {
  id: string;
  volume: string;
  price: string;
  pricePerLiter: number;
  isLowestPrice: boolean;
}

interface ResultsTableProps {
  results: BeerResult[];
}

export const ResultsTable = ({ results }: ResultsTableProps) => {
  if (results.length === 0) return null;

  const handleShare = async () => {
    // Criar texto para compartilhamento
    const bestOption = results.find(r => r.isLowestPrice);
    const shareText = `🍺 Comparação de Preços de Cerveja\n\n` +
      `Melhor opção: R$ ${bestOption?.pricePerLiter.toFixed(2)}/litro\n\n` +
      `Comparei ${results.length} cervejas diferentes usando o Comparador de Preços!\n` +
      `Confira também: ${window.location.origin}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Comparador de Preços de Cerveja',
          text: shareText,
          url: window.location.href
        });
      } else {
        // Fallback para copiar para área de transferência
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Link copiado!",
          description: "O texto foi copiado para sua área de transferência"
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao compartilhar",
        description: "Não foi possível compartilhar o conteúdo",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-4 sm:p-6 shadow-lg bg-white/90 dark:bg-black/40 backdrop-blur-sm border-amber-100 dark:border-amber-800 animate-fade-in transition-all duration-300">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Beer className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <h2 className="text-xl font-semibold text-amber-900 dark:text-amber-100">Resultados</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="flex items-center gap-2 border-amber-200 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/50"
        >
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Compartilhar</span>
        </Button>
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
            {results.map((result) => (
              <tr
                key={result.id}
                className={`transition-all duration-300 transform hover:scale-[1.02] ${
                  result.isLowestPrice
                    ? "bg-green-50 dark:bg-green-900/30 text-green-900 dark:text-green-100 hover:bg-green-100 dark:hover:bg-green-900/50"
                    : "hover:bg-amber-50 dark:hover:bg-amber-900/30"
                }`}
              >
                <td className="py-3 px-4 border-b border-amber-50 dark:border-amber-800/50">
                  Cerveja {result.id}
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
