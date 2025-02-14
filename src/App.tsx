
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { TooltipProvider } from "@/components/ui/tooltip";

// Lazy load components
const Index = lazy(() => import("./pages/Index"));
const BeerCalculator = lazy(() => import("./pages/BeerCalculator"));
const Blog = lazy(() => import("./pages/Blog"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      gcTime: 1000 * 60 * 30, // 30 minutos (antigo cacheTime)
    },
  },
});

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LoadingSpinner />}>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={
            <TooltipProvider>
              <Index />
            </TooltipProvider>
          }>
            <Route index element={<BeerCalculator />} />
            <Route path="blog" element={<Blog />} />
            <Route path="drinks" element={<Blog />} />
            <Route path="vinhos" element={<Blog />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
