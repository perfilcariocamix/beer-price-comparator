
import { Card } from "@/components/ui/card";

const Blog = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-amber-900 dark:text-amber-100 mb-2 transition-colors">
          Blog
        </h1>
        <p className="text-amber-700 dark:text-amber-300 text-sm sm:text-base transition-colors">
          Dicas e novidades sobre bebidas
        </p>
      </div>

      <Card className="p-6 bg-white/90 dark:bg-black/40 backdrop-blur-sm border-amber-100 dark:border-amber-800">
        <p className="text-center text-amber-700 dark:text-amber-300">
          Em breve, conteúdo interessante sobre bebidas!
        </p>
      </Card>
    </div>
  );
};

export default Blog;
