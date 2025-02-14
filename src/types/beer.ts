
export interface BeerEntry {
  id: string;
  volume: string;
  customVolume?: string;
  price: string;
}

export interface BeerResult {
  id: string;
  volume: string;
  price: string;
  pricePerLiter: number;
  isLowestPrice: boolean;
}

export interface ComparisonRecord {
  id: string;
  date: string;
  results: BeerResult[];
}
