
import { useState } from 'react';
import { BeerEntry } from '@/types/beer';

export const useBeerEntries = () => {
  const [beerEntries, setBeerEntries] = useState<BeerEntry[]>([
    { id: "1", volume: "", price: "" },
    { id: "2", volume: "", price: "" },
    { id: "3", volume: "", price: "" },
  ]);

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
    setBeerEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  return {
    beerEntries,
    handleVolumeChange,
    handleCustomVolumeChange,
    handlePriceChange,
    addNewBeer,
    removeBeer
  };
};
