// import { useNavigate } from "react-router-dom";
// import { Card, CardContent } from "@/components/ui/card";
// import { ArrowRight, Smartphone, Shirt, Home, Sparkles, Dumbbell, LucideIcon } from "lucide-react";
// import { useTranslation } from "react-i18next";

// interface Category {
//   id: string;
//   nameKey: string;
//   slug: string;
//   icon: LucideIcon;
// }

// const categories: Category[] = [
//   { id: "1", nameKey: "categories.electronics", slug: "electronics", icon: Smartphone },
//   { id: "2", nameKey: "categories.fashion", slug: "fashion", icon: Shirt },
//   { id: "3", nameKey: "categories.homeLiving", slug: "home-living", icon: Home },
//   { id: "4", nameKey: "categories.beauty", slug: "beauty", icon: Sparkles },
//   { id: "5", nameKey: "categories.sports", slug: "sports", icon: Dumbbell },
// ];


// const CategoryGrid = () => {
//   const navigate = useNavigate();
//   const { t } = useTranslation();

//   return (
//     <section className="py-10 md:py-12 bg-gradient-to-b from-muted/30 to-background">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-6">
//           <h2 className="font-heading font-bold text-2xl md:text-3xl mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
//             {t('home.shopByCategory')}
//           </h2>
//           <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
//             {t('home.categorySubtitle')}
//           </p>
//         </div>

//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
//           {categories.map((category, index) => {
//             const IconComponent = category.icon;
            
//             return (
//               <Card
//                 key={category.id}
//                 className="group hover:shadow-lg transition-all duration-500 cursor-pointer border hover:border-primary/40 overflow-hidden relative bg-card"
//                 onClick={() => navigate(`/category/${category.slug}`)}
//                 style={{
//                   animationDelay: `${index * 100}ms`,
//                 }}
//               >
//                 <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
//                 <CardContent className="p-4 text-center relative">
//                   <div className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-2 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm">
//                     <IconComponent className="h-6 w-6 md:h-7 md:w-7 text-primary" strokeWidth={1.5} />
//                   </div>
//                   <h3 className="font-heading font-semibold text-sm md:text-base group-hover:text-primary transition-colors">
//                     {t(category.nameKey)}
//                   </h3>
//                   <div className="mt-1 inline-flex items-center gap-1 text-primary font-semibold text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                     {t('home.explore')} <ArrowRight className="h-3 w-3 group-hover:ltr:translate-x-1 group-hover:rtl:-translate-x-1 transition-transform" />
//                   </div>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default CategoryGrid;


import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import electronicsImg from "../../assets/electronicimage.webp"
import fashionsImg from "../../assets/fashionimage.png"
import homeImg from "../../assets/homeandlivingimage.png"
import beautyImg from "../../assets/beautyimage.png"
import sportImg from "../../assets/sportsimage.png"


interface Category {
  id: string;
  nameKey: string;
  slug: string;
  image: string;
}

const categories: Category[] = [
  {
    id: "1",
    nameKey: "categories.electronics",
    slug: "electronics",
    image: electronicsImg,
    
  },
  {
    id: "2",
    nameKey: "categories.fashion",
    slug: "fashion",
    image: fashionsImg,
    
  },
  {
    id: "3",
    nameKey: "categories.homeLiving",
    slug: "home-living",
    image: homeImg,
    
  },
  {
    id: "4",
    nameKey: "categories.beauty",
    slug: "beauty",
    image: beautyImg,
   
  },
  {
    id: "5",
    nameKey: "categories.sports",
    slug: "sports",
    image: sportImg,
    
  },
];


const CategoryGrid = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="py-14 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            {t("home.shopByCategory")}
          </h2>
          <p className="text-muted-foreground mt-3 text-sm md:text-base">
            {t("home.categorySubtitle")}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <Card
              key={category.id}
              onClick={() => navigate(`/category/${category.slug}`)}
              className="group relative overflow-hidden rounded-3xl border border-border/40 
              backdrop-blur-xl bg-white/40 dark:bg-white/5
              hover:shadow-2xl hover:-translate-y-2 
              transition-all duration-700 ease-out cursor-pointer
              animate-fade-up"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              {/* Background Image */}
              <div
  className="absolute inset-0 bg-cover bg-center scale-105 
  group-hover:scale-110 transition-transform duration-1000"
  style={{
    backgroundImage: `url(${category.image})`,
  }}
/>

              {/* Brand Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br 
              from-primary/70 via-primary/40 to-transparent 
              opacity-60 group-hover:opacity-75 
              transition-all duration-700" />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center justify-center h-40 md:h-48 text-white text-center p-4">

                {/* Product Count Badge */}
               

                <h3 className="text-base md:text-lg font-medium tracking-wide">
                  {t(category.nameKey)}
                </h3>

                <div className="mt-3 flex items-center gap-1 text-sm opacity-0 
                group-hover:opacity-100 transition-opacity duration-500">
                  {t("home.explore")}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
