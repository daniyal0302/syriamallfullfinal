import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ArrowRight, Smartphone, Shirt, Home, Sparkles, Dumbbell, LucideIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

const categoryIcons: Record<string, LucideIcon> = {
  electronics: Smartphone,
  fashion: Shirt,
  "home-living": Home,
  "home-and-living": Home,
  beauty: Sparkles,
  "beauty-and-personal-care": Sparkles,
  sports: Dumbbell,
  "sports-outdoors": Dumbbell,
};

const CategoryGrid = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .is("parent_id", null)
        .order("display_order", { ascending: true })
        .limit(5);

      if (error) throw error;
      
      // Remove duplicates based on normalized slug (handle variations like "home-living" vs "home-and-living")
      // const normalizeSlug = (slug: string) => slug.replace(/-and-/g, '-').replace(/-&-/g, '-');
      // const seenSlugs = new Set<string>();
      // const uniqueCategories = data?.filter((cat) => {
      //   const normalized = normalizeSlug(cat.slug);
      //   if (seenSlugs.has(normalized)) {
      //     return false;
      //   }
      //   seenSlugs.add(normalized);
      //   return true;
      // }) || [];
      const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/and|&/g, "")
    .replace(/-/g, "")
    .replace(/\s+/g, "")
    .trim();

      const seen = new Set<string>();

const uniqueCategories =
  data?.filter((cat) => {
    const key = normalize(cat.slug || cat.name);

    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  }) || [];




      
      setCategories(uniqueCategories.slice(0, 5));

    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {t('home.shopByCategory')}
          </h2>
          <p className="text-muted-foreground text-base max-w-2xl mx-auto">
            {t('home.categorySubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((category, index) => {
            const IconComponent = categoryIcons[category.slug];
            
            return (
              <Card
                key={category.id}
                className="group hover:shadow-xl transition-all duration-500 cursor-pointer border hover:border-primary/40 overflow-hidden relative bg-card"
                onClick={() => navigate(`/category/${category.slug}`)}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <CardContent className="p-4 md:p-6 text-center relative">
                  <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-md backdrop-blur-sm">
                    {IconComponent ? (
                      <IconComponent className="h-8 w-8 md:h-10 md:w-10 text-primary" strokeWidth={1.5} />
                    ) : (
                      <span className="text-3xl md:text-4xl">{category.icon || "📦"}</span>
                    )}
                  </div>
                  <h3 className="font-heading font-semibold text-base md:text-lg mb-1 group-hover:text-primary transition-colors line-clamp-2">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-xs text-muted-foreground line-clamp-1 leading-relaxed">
                      {category.description}
                    </p>
                  )}
                  <div className="mt-2 inline-flex items-center gap-1 text-primary font-semibold text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
