mport { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Smartphone, Shirt, Home, Sparkles, Dumbbell, LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Category {
  id: string;
  nameKey: string;
  slug: string;
  icon: LucideIcon;
}

const categories: Category[] = [
  { id: "1", nameKey: "categories.electronics", slug: "electronics", icon: Smartphone },
  { id: "2", nameKey: "categories.fashion", slug: "fashion", icon: Shirt },
  { id: "3", nameKey: "categories.homeLiving", slug: "home-living", icon: Home },
  { id: "4", nameKey: "categories.beauty", slug: "beauty", icon: Sparkles },
  { id: "5", nameKey: "categories.sports", slug: "sports", icon: Dumbbell },
];


const CategoryGrid = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="py-10 md:py-12 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="font-heading font-bold text-2xl md:text-3xl mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {t('home.shopByCategory')}
          </h2>
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
            {t('home.categorySubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            
            return (
              <Card
                key={category.id}
                className="group hover:shadow-lg transition-all duration-500 cursor-pointer border hover:border-primary/40 overflow-hidden relative bg-card"
                onClick={() => navigate(`/category/${category.slug}`)}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <CardContent className="p-4 text-center relative">
                  <div className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-2 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm">
                    <IconComponent className="h-6 w-6 md:h-7 md:w-7 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading font-semibold text-sm md:text-base group-hover:text-primary transition-colors">
                    {t(category.nameKey)}
                  </h3>
                  <div className="mt-1 inline-flex items-center gap-1 text-primary font-semibold text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {t('home.explore')} <ArrowRight className="h-3 w-3 group-hover:ltr:translate-x-1 group-hover:rtl:-translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
