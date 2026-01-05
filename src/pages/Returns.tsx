import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RotateCcw, Package, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const returnSteps = [
  {
    step: 1,
    title: "Request Return",
    description: "Go to 'My Orders', select the order, and click 'Request Return' for the item you want to return."
  },
  {
    step: 2,
    title: "Pack the Item",
    description: "Pack the item securely in its original packaging with all tags and accessories included."
  },
  {
    step: 3,
    title: "Schedule Pickup",
    description: "Choose a convenient pickup time or drop off at a designated location."
  },
  {
    step: 4,
    title: "Receive Refund",
    description: "Once we receive and inspect the item, your refund will be processed within 5-7 business days."
  }
];

const returnableCategoreis = [
  { category: "Electronics", period: "14 days", condition: "Unopened, sealed packaging" },
  { category: "Fashion & Clothing", period: "30 days", condition: "Unworn, tags attached" },
  { category: "Home & Living", period: "30 days", condition: "Unused, original packaging" },
  { category: "Beauty & Personal Care", period: "7 days", condition: "Unopened only" },
  { category: "Toys & Games", period: "30 days", condition: "Unopened, original packaging" }
];

const nonReturnableItems = [
  "Underwear and intimate apparel",
  "Swimwear without hygiene seal",
  "Personalized or customized items",
  "Perishable goods and food items",
  "Digital products and gift cards",
  "Health and hygiene products (opened)",
  "Items marked as 'Final Sale'"
];

const Returns = () => {
  const [cmsContent, setCmsContent] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase
        .from("cms_pages")
        .select("content")
        .eq("page_key", "returns")
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
              Returns & Refunds
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Easy returns, hassle-free refunds. We want you to be completely satisfied with your purchase.
            </p>
          </div>
        </section>

        {/* Return Process */}
        <section className="py-16 container mx-auto px-4">
          <h2 className="text-2xl font-heading font-bold text-center mb-12">
            How to Return an Item
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {returnSteps.map((step) => (
              <Card key={step.step} className="text-center relative">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                    {step.step}
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <NavLink to="/orders">
              <Button size="lg" className="bg-primary hover:bg-primary-hover">
                <RotateCcw className="h-4 w-4 mr-2" />
                Start a Return
              </Button>
            </NavLink>
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

        {/* Return Periods by Category */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-heading font-bold text-center mb-8">
              Return Periods by Category
            </h2>
            <div className="max-w-3xl mx-auto">
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="text-left p-4 font-semibold">Category</th>
                          <th className="text-left p-4 font-semibold">Return Period</th>
                          <th className="text-left p-4 font-semibold">Condition</th>
                        </tr>
                      </thead>
                      <tbody>
                        {returnableCategoreis.map((item) => (
                          <tr key={item.category} className="border-b last:border-0">
                            <td className="p-4 font-medium">{item.category}</td>
                            <td className="p-4">
                              <span className="inline-flex items-center gap-1 text-primary">
                                <Clock className="h-4 w-4" />
                                {item.period}
                              </span>
                            </td>
                            <td className="p-4 text-muted-foreground">{item.condition}</td>
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

        {/* Returnable vs Non-Returnable */}
        <section className="py-16 container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Eligible for Return */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <CardTitle>Eligible for Return</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 shrink-0" />
                    <span className="text-muted-foreground">Items in original, unused condition</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 shrink-0" />
                    <span className="text-muted-foreground">Original packaging and tags intact</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 shrink-0" />
                    <span className="text-muted-foreground">Within the return period</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 shrink-0" />
                    <span className="text-muted-foreground">Proof of purchase available</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 shrink-0" />
                    <span className="text-muted-foreground">Defective or damaged items</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Non-Returnable */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <XCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <CardTitle>Non-Returnable Items</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {nonReturnableItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-600 mt-1 shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Refund Info */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-heading font-bold text-center mb-8">
              Refund Information
            </h2>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1" className="bg-background rounded-lg border px-6">
                  <AccordionTrigger className="text-left font-medium">
                    How long does it take to receive my refund?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Once we receive your returned item, we'll inspect it within 2-3 business days. After approval, refunds are processed within 5-7 business days. The time it takes for the refund to appear in your account depends on your payment method.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="bg-background rounded-lg border px-6">
                  <AccordionTrigger className="text-left font-medium">
                    What if my item arrived damaged?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    If your item arrived damaged, please contact us within 48 hours of delivery with photos of the damage. We'll arrange a free pickup and provide a full refund or replacement at no additional cost.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="bg-background rounded-lg border px-6">
                  <AccordionTrigger className="text-left font-medium">
                    Can I exchange an item instead of returning it?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Yes! If you'd like a different size, color, or variant, you can request an exchange. Simply select "Exchange" instead of "Return" when initiating your request. Exchanges are subject to availability.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4" className="bg-background rounded-lg border px-6">
                  <AccordionTrigger className="text-left font-medium">
                    Who pays for return shipping?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    For defective or damaged items, we cover all return shipping costs. For change-of-mind returns, a small return shipping fee may apply, which will be deducted from your refund amount.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 text-amber-600 mb-4">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">Need help with a return?</span>
          </div>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Our customer support team is ready to assist you with any return or refund questions.
          </p>
          <NavLink to="/contact">
            <Button size="lg" variant="outline">
              Contact Support
            </Button>
          </NavLink>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Returns;
