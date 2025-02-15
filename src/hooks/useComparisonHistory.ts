
import { useState, useEffect } from 'react';
import { BeerResult, ComparisonRecord } from '@/types/beer';

export const useComparisonHistory = () => {
  const [history, setHistory] = useState<ComparisonRecord[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem("comparisonHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveToHistory = (results: BeerResult[]) => {
    const newRecord: ComparisonRecord = {
      id: new Date().getTime().toString(),
      date: new Date().toLocaleString('pt-BR'),
      results
    };

    const updatedHistory = [newRecord, ...history].slice(0, 10);
    setHistory(updatedHistory);
    localStorage.setItem("comparisonHistory", JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("comparisonHistory");
  };

  return {
    history,
    saveToHistory,
    clearHistory
  };
};
