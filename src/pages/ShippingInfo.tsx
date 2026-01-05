import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Clock, MapPin, Package, CheckCircle } from "lucide-react";

const shippingMethods = [
  {
    name: "Standard Delivery",
    time: "3-7 business days",
    price: "Free for orders over $50",
    description: "Our most economical option for non-urgent deliveries."
  },
  {
    name: "Express Delivery",
    time: "1-2 business days",
    price: "Starting from $9.99",
    description: "Fast delivery for when you need your items quickly."
  },
  {
    name: "Same Day Delivery",
    time: "Within 24 hours",
    price: "Starting from $14.99",
    description: "Available in select cities for orders placed before 12 PM."
  }
];

const deliveryZones = [
  { zone: "Damascus & Suburbs", standard: "2-3 days", express: "Same day" },
  { zone: "Aleppo", standard: "3-4 days", express: "1-2 days" },
  { zone: "Homs", standard: "3-4 days", express: "1-2 days" },
  { zone: "Latakia", standard: "4-5 days", express: "2-3 days" },
  { zone: "Other Cities", standard: "5-7 days", express: "3-4 days" }
];

const ShippingInfo = () => {
  const [cmsContent, setCmsContent] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase
        .from("cms_pages")
        .select("content")
        .eq("page_key", "shipping-info")
        .eq("is_active", true)
        .single();
      
      if (data?.content) {
        setCmsContent(data.content);
      }
    };
    fetchContent();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Shipping Information
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Fast, reliable delivery to your doorstep. Learn about our shipping options and policies.
            </p>
          </div>
        </section>

        {/* Shipping Methods */}
        <section className="py-16 container mx-auto px-4">
          <h2 className="text-2xl font-heading font-bold text-center mb-8">
            Shipping Methods
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {shippingMethods.map((method) => (
              <Card key={method.name} className="text-center">
                <CardHeader>
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Truck className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle>{method.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{method.time}</span>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {method.price}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {method.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CMS Content */}
        {cmsContent && (
          <section className="py-8 container mx-auto px-4">
            <div 
              className="prose prose-lg max-w-4xl mx-auto"
              dangerouslySetInnerHTML={{ __html: cmsContent }}
            />
          </section>
        )}

        {/* Delivery Zones */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-heading font-bold text-center mb-8">
              Delivery Times by Region
            </h2>
            <div className="max-w-3xl mx-auto">
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4 font-semibold">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-primary" />
                              Region
                            </div>
                          </th>
                          <th className="text-left p-4 font-semibold">Standard</th>
                          <th className="text-left p-4 font-semibold">Express</th>
                        </tr>
                      </thead>
                      <tbody>
                        {deliveryZones.map((zone) => (
                          <tr key={zone.zone} className="border-b last:border-0">
                            <td className="p-4 font-medium">{zone.zone}</td>
                            <td className="p-4 text-muted-foreground">{zone.standard}</td>
                            <td className="p-4 text-muted-foreground">{zone.express}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Shipping Policies */}
        <section className="py-16 container mx-auto px-4">
          <h2 className="text-2xl font-heading font-bold text-center mb-8">
            Shipping Policies
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="shrink-0">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Order Processing</h3>
                    <p className="text-muted-foreground">
                      Orders are processed within 1-2 business days. Orders placed on weekends or holidays will be processed the next business day.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="shrink-0">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Order Tracking</h3>
                    <p className="text-muted-foreground">
                      Once your order ships, you'll receive a confirmation email with tracking information. You can also track your order in your account dashboard.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="shrink-0">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Delivery Attempts</h3>
                    <p className="text-muted-foreground">
                      Our courier will attempt delivery up to 3 times. If unsuccessful, the package will be held at a nearby pickup point for 7 days.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Delivery Restrictions</h3>
                    <p className="text-muted-foreground">
                      Some areas may have limited delivery options due to logistical constraints. Delivery availability will be confirmed at checkout.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ShippingInfo;
