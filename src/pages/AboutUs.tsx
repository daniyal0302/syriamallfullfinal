import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Store, Users, Shield, Globe } from "lucide-react";

const AboutUs = () => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase
        .from("cms_pages")
        .select("content")
        .eq("page_key", "about")
        .eq("is_active", true)
        .maybeSingle();
      
      if (data?.content) {
        setContent(data.content);
      }
      setLoading(false);
    };

    fetchContent();
  }, []);

  const features = [
    {
      icon: Store,
      title: "Trusted Marketplace",
      description: "Connecting buyers with verified local and international vendors"
    },
    {
      icon: Users,
      title: "Community First",
      description: "Building a thriving community of sellers and shoppers"
    },
    {
      icon: Shield,
      title: "Secure Shopping",
      description: "Your transactions and data are always protected"
    },
    {
      icon: Globe,
      title: "Wide Selection",
      description: "Thousands of products across multiple categories"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-heading font-bold mb-8">About Us</h1>
          
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : content ? (
            <div className="prose prose-gray dark:prose-invert max-w-none">
              {content.split('\n').map((line, index) => {
                if (line.startsWith('## ')) {
                  return <h2 key={index} className="text-2xl font-bold mt-8 mb-4">{line.replace('## ', '')}</h2>;
                } else if (line.startsWith('### ')) {
                  return <h3 key={index} className="text-xl font-semibold mt-6 mb-3">{line.replace('### ', '')}</h3>;
                } else if (line.startsWith('**') && line.endsWith('**')) {
                  return <p key={index} className="font-semibold mt-4">{line.replace(/\*\*/g, '')}</p>;
                } else if (line.startsWith('- ')) {
                  return <li key={index} className="ml-6">{line.replace('- ', '')}</li>;
                } else if (line.trim()) {
                  return <p key={index} className="text-muted-foreground mb-2">{line}</p>;
                }
                return null;
              })}
            </div>
          ) : (
            <>
              {/* Hero Section */}
              <div className="text-center mb-12">
                <h2 className="text-2xl font-semibold mb-4">Welcome to SyriaMall</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Your trusted digital marketplace for all your shopping needs. We connect buyers with quality vendors, 
                  offering a seamless shopping experience with secure transactions and reliable delivery.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {features.map((feature, index) => (
                  <div key={index} className="p-6 rounded-lg border bg-card">
                    <feature.icon className="h-10 w-10 text-primary mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>

              {/* Mission Section */}
              <div className="bg-secondary/50 rounded-lg p-8 mb-12">
                <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                <p className="text-muted-foreground mb-4">
                  At SyriaMall, we believe in empowering local businesses and providing customers with access to 
                  quality products at competitive prices. Our platform serves as a bridge between talented vendors 
                  and discerning shoppers.
                </p>
                <p className="text-muted-foreground">
                  We are committed to fostering a safe, transparent, and efficient marketplace where everyone can 
                  thrive. Whether you're a vendor looking to expand your reach or a customer seeking the perfect 
                  product, SyriaMall is here to serve you.
                </p>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-4">
                  <p className="text-3xl font-bold text-primary">500+</p>
                  <p className="text-sm text-muted-foreground">Verified Vendors</p>
                </div>
                <div className="p-4">
                  <p className="text-3xl font-bold text-primary">10K+</p>
                  <p className="text-sm text-muted-foreground">Products</p>
                </div>
                <div className="p-4">
                  <p className="text-3xl font-bold text-primary">50K+</p>
                  <p className="text-sm text-muted-foreground">Happy Customers</p>
                </div>
                <div className="p-4">
                  <p className="text-3xl font-bold text-primary">99%</p>
                  <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
