
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Beer } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BeerEntry {
  id: string;
  volume: string;
  customVolume?: string;
  price: string;
}

interface BeerEntryFormProps {
  entry: BeerEntry;
  index: number;
  showRemoveButton: boolean;
  onVolumeChange: (value: string, id: string) => void;
  onCustomVolumeChange: (value: string, id: string) => void;
  onPriceChange: (value: string, id: string) => void;
  onRemove: (id: string) => void;
}

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

export const BeerEntryForm = ({
  entry,
  index,
  showRemoveButton,
  onVolumeChange,
  onCustomVolumeChange,
  onPriceChange,
  onRemove,
}: BeerEntryFormProps) => {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <Beer className="h-5 w-5 text-amber-600" />
        <h3 className="text-lg font-medium text-amber-900">
          Cerveja {index + 1}
        </h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-[1fr,1fr,auto] gap-4 items-end relative group bg-amber-50/50 p-4 rounded-lg border border-amber-100">
        <div className="space-y-2">
          <label
            htmlFor={`volume-${entry.id}`}
            className="text-sm font-medium text-amber-700"
          >
            Volume (ml)
          </label>
          <Select
            value={entry.volume}
            onValueChange={(value) => onVolumeChange(value, entry.id)}
          >
            <SelectTrigger id={`volume-${entry.id}`} className="bg-white border-amber-200">
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
              onChange={(e) => onCustomVolumeChange(e.target.value, entry.id)}
              className="mt-2 bg-white border-amber-200"
            />
          )}
        </div>
        <div className="space-y-2">
          <label
            htmlFor={`price-${entry.id}`}
            className="text-sm font-medium text-amber-700"
          >
            Preço (R$)
          </label>
          <Input
            id={`price-${entry.id}`}
            type="number"
            step="0.01"
            placeholder="0.00"
            value={entry.price}
            onChange={(e) => onPriceChange(e.target.value, entry.id)}
            className="bg-white border-amber-200"
          />
        </div>
        {showRemoveButton && (
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
            onClick={() => onRemove(entry.id)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        )}
      </div>
    </div>
  );
};
