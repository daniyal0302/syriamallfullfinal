
// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { supabase } from "@/integrations/supabase/client";
// import { useNavigate } from "react-router-dom";

// // Desktop & Mobile fallback images
// import heroBanner from "@/assets/Banner For Desktop.jpeg";
// import heroBannerMobile from "@/assets/Banner For Mobile.jpeg";

// const HeroSection = () => {
//   const navigate = useNavigate();
//   const [banners, setBanners] = useState<any[]>([]);
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchBanners();
//   }, []);

//   const fetchBanners = async () => {
//     try {
//       const { data, error } = await supabase
//         .from("banners")
//         .select("*")
//         .eq("is_active", true)
//         .order("display_order", { ascending: true });

//       if (error) throw error;

//       if (data && data.length > 0) {
//         setBanners(data);
//       } else {
//         setBanners([
//           {
//             id: "default",
//             title: "Welcome to SyriaMall",
//             subtitle: "Discover premium electronics and lifestyle products",
//             image_url: heroBanner,
//             mobile_image_url: heroBannerMobile,
//             redirect_url: "/category/electronics",
//           },
//         ]);
//       }
//     } catch (error) {
//       console.error("Error fetching banners:", error);
//       setBanners([
//         {
//           id: "default",
//           title: "Welcome to SyriaMall",
//           subtitle: "Discover premium electronics and lifestyle products",
//           image_url: heroBanner,
//           mobile_image_url: heroBannerMobile,
//           redirect_url: "/category/electronics",
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const nextSlide = () => {
//     setCurrentSlide((prev) => (prev + 1) % banners.length);
//   };

//   const previousSlide = () => {
//     setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
//   };

//   useEffect(() => {
//     if (banners.length > 1) {
//       const timer = setInterval(nextSlide, 5000);
//       return () => clearInterval(timer);
//     }
//   }, [banners.length]);

//   if (loading) {
//     return (
//       <section className="relative w-full bg-background">
//         <div className="container mx-auto px-4 py-6">
//           <div className="h-[320px] md:h-[550px] rounded-xl bg-muted animate-pulse" />
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="relative w-full bg-background">
//       <div className="container mx-auto px-4 py-6">
//         <div className="relative h-[320px] sm:h-[400px] md:h-[550px] lg:h-[600px] overflow-hidden rounded-xl shadow-xl">
//           {banners.map((banner, index) => (
//             <div
//               key={banner.id}
//               className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
//                 index === currentSlide ? "opacity-100" : "opacity-0"
//               }`}
//             >
//               {/* ✅ Responsive Image */}
//               <picture>
//                 <source
//                   media="(max-width: 768px)"
//                   srcSet={banner.mobile_image_url || banner.image_url}
//                 />
//                 <img
//                   src={banner.image_url}
//                   alt={banner.title}
//                   className="w-full h-full object-cover"
//                 />
//               </picture>

//               {/* Overlay */}
//               <div className="absolute inset-0  to-transparent flex items-center">
//                 {/* <div className="px-6 md:px-12 lg:px-16 max-w-2xl text-white space-y-4">
//                   <h1 className="font-heading font-bold text-3xl md:text-5xl lg:text-6xl leading-tight">
//                     {banner.title}
//                   </h1>

//                   {banner.subtitle && (
//                     <p className="text-base md:text-xl text-white/90">
//                       {banner.subtitle}
//                     </p>
//                   )}

//                   {banner.redirect_url && (
//                     <Button
//                       size="lg"
//                       className="mt-4 px-8 shadow-orange"
//                       onClick={() => navigate(banner.redirect_url)}
//                     >
//                       Shop Now
//                     </Button>
//                   )}
//                 </div> */}
//               </div>
//             </div>
//           ))}

//           {/* Arrows */}
//           {banners.length > 1 && (
//             <>
//               <button
//                 onClick={previousSlide}
//                 className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg"
//               >
//                 <ChevronLeft className="h-6 w-6" />
//               </button>

//               <button
//                 onClick={nextSlide}
//                 className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg"
//               >
//                 <ChevronRight className="h-6 w-6" />
//               </button>

//               {/* Dots */}
//               <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
//                 {banners.map((_, index) => (
//                   <button
//                     key={index}
//                     onClick={() => setCurrentSlide(index)}
//                     className={`h-2 rounded-full transition-all ${
//                       index === currentSlide
//                         ? "bg-primary w-8"
//                         : "bg-white/70 w-2"
//                     }`}
//                   />
//                 ))}
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;


import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAutoTranslateBatch } from "@/hooks/useAutoTranslate";
import heroDesktop from "@/assets/Banner For Desktop.jpeg";

const HeroSection = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [dbBanners, setDbBanners] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasDbBanners, setHasDbBanners] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        setDbBanners(data);
        setHasDbBanners(true);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  };

  const banners = useMemo(() => {
    if (hasDbBanners) return dbBanners;
    return [
      {
        id: "default",
        title: t("home.everythingYouLove"),
        subtitle: t("home.allInOnePlace"),
        image_url: heroDesktop,
        redirect_url: "/category/electronics",
        _isDefault: true,
      },
    ];
  }, [hasDbBanners, dbBanners, t, i18n.language]);

  const titleItems = useMemo(
    () =>
      banners.map((b: any) => ({
        text: b.title || "",
        existingTranslation: b._isDefault ? null : b.title_ar,
      })),
    [banners]
  );
  const subtitleItems = useMemo(
    () =>
      banners.map((b: any) => ({
        text: b.subtitle || "",
        existingTranslation: b._isDefault ? null : b.subtitle_ar,
      })),
    [banners]
  );

  const translatedTitles = useAutoTranslateBatch(titleItems);
  const translatedSubtitles = useAutoTranslateBatch(subtitleItems);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const previousSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  useEffect(() => {
    if (banners.length > 1) {
      const timer = setInterval(nextSlide, 5000);
      return () => clearInterval(timer);
    }
  }, [banners.length]);

  if (loading) {
    return (
      <section className="relative w-full bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="h-[300px] md:h-[400px] lg:h-[450px] rounded-xl bg-muted animate-pulse" />
        </div>
      </section>
    );
  }

  // Default hero — use the uploaded banner image directly
  if (!hasDbBanners) {
    return (
      <section className="relative w-full bg-background">
        <div className="container mx-auto px-4 py-6">
          <div
            className="relative overflow-hidden rounded-xl shadow-xl cursor-pointer group"
            onClick={() => navigate("/category/electronics")}
          >
            <img
              src={heroDesktop}
              alt={t("home.everythingYouLove")}
              className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
            {/* Invisible clickable category areas */}
            <div className="absolute inset-0 flex items-end justify-center pb-[5%] gap-[12%]">
              <button
                onClick={(e) => { e.stopPropagation(); navigate("/category/fashion"); }}
                className="w-[22%] h-[55%] rounded-full hover:ring-4 hover:ring-white/10 transition-all duration-300 cursor-pointer"
                aria-label={t("categories.fashion")}
              />
              <button
                onClick={(e) => { e.stopPropagation(); navigate("/category/home-living"); }}
                className="w-[22%] h-[55%] rounded-full hover:ring-4 hover:ring-white/10 transition-all duration-300 cursor-pointer"
                aria-label={t("categories.homeLiving")}
              />
              <button
                onClick={(e) => { e.stopPropagation(); navigate("/category/electronics"); }}
                className="w-[22%] h-[55%] rounded-full hover:ring-4 hover:ring-white/10 transition-all duration-300 cursor-pointer"
                aria-label={t("categories.electronics")}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // DB banners slider
  return (
    <section className="relative w-full bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="relative h-[300px] md:h-[400px] lg:h-[450px] overflow-hidden rounded-xl shadow-xl">
          {banners.map((banner: any, index: number) => {
            const displayTitle = banner._isDefault
              ? banner.title
              : translatedTitles[index] || banner.title;
            const displaySubtitle = banner._isDefault
              ? banner.subtitle
              : translatedSubtitles[index] || banner.subtitle;

            return (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={banner.image_url}
                  alt={displayTitle}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex items-center">
                  <div className="container mx-auto px-8 md:px-12 lg:px-16">
                    <div className="max-w-2xl space-y-6 text-white">
                      <h1 className="font-heading font-bold text-5xl md:text-6xl lg:text-7xl leading-tight tracking-tight">
                        {displayTitle}
                      </h1>
                      {displaySubtitle && (
                        <p className="text-xl md:text-2xl font-light leading-relaxed text-white/90">
                          {displaySubtitle}
                        </p>
                      )}
                      {banner.redirect_url && (
                        <Button
                          size="lg"
                          className="mt-6 text-lg px-8 py-6 shadow-orange hover:shadow-xl transition-all duration-300"
                          onClick={() => navigate(banner.redirect_url || "/")}
                        >
                          {t("home.shopNow")}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {banners.length > 1 && (
            <>
              <button
                onClick={previousSlide}
                className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 transition-all duration-300 hover:scale-110 shadow-lg"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-6 w-6 text-foreground" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 transition-all duration-300 hover:scale-110 shadow-lg"
                aria-label="Next slide"
              >
                <ChevronRight className="h-6 w-6 text-foreground" />
              </button>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                {banners.map((_: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? "bg-primary w-10"
                        : "bg-white/70 w-2 hover:bg-white"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
