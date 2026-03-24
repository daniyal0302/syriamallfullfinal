// import { useState, useEffect } from "react";
// import { supabase } from "@/integrations/supabase/client";
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import { Search, ShoppingCart, Truck, CreditCard, User, Package, MessageCircle } from "lucide-react";
// import { NavLink } from "@/components/NavLink";

// const helpCategories = [
//   {
//     icon: ShoppingCart,
//     title: "Orders & Payments",
//     description: "Track orders, payment issues, refunds",
//     link: "/help/orders"
//   },
//   {
//     icon: Truck,
//     title: "Shipping & Delivery",
//     description: "Shipping methods, delivery times",
//     link: "/shipping"
//   },
//   {
//     icon: Package,
//     title: "Returns & Refunds",
//     description: "Return policy, how to return items",
//     link: "/returns"
//   },
//   {
//     icon: User,
//     title: "Account & Profile",
//     description: "Account settings, password reset",
//     link: "/account"
//   },
//   {
//     icon: CreditCard,
//     title: "Payment Methods",
//     description: "Accepted payments, billing info",
//     link: "/help/payments"
//   },
//   {
//     icon: MessageCircle,
//     title: "Contact Support",
//     description: "Get in touch with our team",
//     link: "/contact"
//   }
// ];

// const faqs = [
//   {
//     question: "How do I track my order?",
//     answer: "You can track your order by going to 'My Orders' in your account dashboard. Click on any order to see its current status and tracking information. You'll also receive email updates as your order progresses."
//   },
//   {
//     question: "What payment methods do you accept?",
//     answer: "We accept various payment methods including credit/debit cards (Visa, MasterCard), bank transfers, and cash on delivery (COD) for eligible orders. Payment options may vary based on your location."
//   },
//   {
//     question: "How long does delivery take?",
//     answer: "Delivery times vary by location and shipping method. Standard delivery typically takes 3-7 business days, while express delivery is available for 1-2 business days in major cities. You can see estimated delivery times at checkout."
//   },
//   {
//     question: "What is your return policy?",
//     answer: "We offer a 14-day return policy for most items. Products must be unused, in original packaging, and with all tags attached. Some categories like personal care items may have different policies. Visit our Returns page for full details."
//   },
//   {
//     question: "How do I change or cancel my order?",
//     answer: "You can modify or cancel your order within 1 hour of placing it by going to 'My Orders' and selecting the order. After this window, please contact our support team for assistance."
//   },
//   {
//     question: "How do I become a vendor on SyriaMall?",
//     answer: "To become a vendor, click on 'Sell on SyriaMall' in the header or visit our 'Become a Vendor' page. Complete the application form with your business details, and our team will review your application within 2-3 business days."
//   },
//   {
//     question: "Is my personal information secure?",
//     answer: "Yes, we take security seriously. All personal and payment information is encrypted using industry-standard SSL technology. We never share your data with third parties without your consent. Read our Privacy Policy for more details."
//   },
//   {
//     question: "How do I contact customer support?",
//     answer: "You can reach our support team through multiple channels: Live chat (available 9 AM - 9 PM), email at support@syriamall.com, or through our Contact Us page. We typically respond within 24 hours."
//   }
// ];

// const HelpCenter = () => {
//   const [cmsContent, setCmsContent] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     const fetchContent = async () => {
//       const { data } = await supabase
//         .from("cms_pages")
//         .select("content")
//         .eq("page_key", "help-center")
//         .eq("is_active", true)
//         .single();
      
//       if (data?.content) {
//         setCmsContent(data.content);
//       }
//     };
//     fetchContent();
//   }, []);

//   const filteredFaqs = faqs.filter(
//     faq =>
//       faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen flex flex-col bg-background">
//       <Navbar />
//       <main className="flex-1">
//         {/* Hero Section */}
//         <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-16">
//           <div className="container mx-auto px-4 text-center">
//             <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
//               How can we help you?
//             </h1>
//             <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
//               Find answers to common questions or get in touch with our support team.
//             </p>
//             <div className="max-w-xl mx-auto relative">
//               <Input
//                 type="search"
//                 placeholder="Search for help..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-12 h-14 text-lg"
//               />
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
//             </div>
//           </div>
//         </section>

//         {/* Help Categories */}
//         <section className="py-16 container mx-auto px-4">
//           <h2 className="text-2xl font-heading font-bold text-center mb-8">
//             Browse by Category
//           </h2>
//           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
//             {helpCategories.map((category) => (
//               <NavLink key={category.title} to={category.link}>
//                 <Card className="h-full hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer">
//                   <CardHeader className="text-center">
//                     <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
//                       <category.icon className="h-7 w-7 text-primary" />
//                     </div>
//                     <CardTitle className="text-lg">{category.title}</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <p className="text-sm text-muted-foreground text-center">
//                       {category.description}
//                     </p>
//                   </CardContent>
//                 </Card>
//               </NavLink>
//             ))}
//           </div>
//         </section>

//         {/* CMS Content */}
//         {cmsContent && (
//           <section className="py-8 container mx-auto px-4">
//             <div 
//               className="prose prose-lg max-w-4xl mx-auto"
//               dangerouslySetInnerHTML={{ __html: cmsContent }}
//             />
//           </section>
//         )}

//         {/* FAQs */}
//         <section className="py-16 bg-muted/30">
//           <div className="container mx-auto px-4">
//             <h2 className="text-2xl font-heading font-bold text-center mb-8">
//               Frequently Asked Questions
//             </h2>
//             <div className="max-w-3xl mx-auto">
//               <Accordion type="single" collapsible className="space-y-4">
//                 {filteredFaqs.map((faq, index) => (
//                   <AccordionItem 
//                     key={index} 
//                     value={`item-${index}`}
//                     className="bg-background rounded-lg border px-6"
//                   >
//                     <AccordionTrigger className="text-left font-medium">
//                       {faq.question}
//                     </AccordionTrigger>
//                     <AccordionContent className="text-muted-foreground">
//                       {faq.answer}
//                     </AccordionContent>
//                   </AccordionItem>
//                 ))}
//               </Accordion>
//               {filteredFaqs.length === 0 && (
//                 <p className="text-center text-muted-foreground py-8">
//                   No results found for "{searchQuery}". Try a different search term.
//                 </p>
//               )}
//             </div>
//           </div>
//         </section>

//         {/* Contact CTA */}
//         <section className="py-16 container mx-auto px-4 text-center">
//           <h2 className="text-2xl font-heading font-bold mb-4">
//             Still need help?
//           </h2>
//           <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
//             Our customer support team is here to assist you with any questions or concerns.
//           </p>
//           <NavLink to="/contact">
//             <Button size="lg" className="bg-primary hover:bg-primary-hover">
//               Contact Support
//             </Button>
//           </NavLink>
//         </section>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default HelpCenter;

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, ShoppingCart, Truck, CreditCard, User, Package, MessageCircle } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const HelpCenter = () => {
  const { t } = useTranslation();
  const [cmsContent, setCmsContent] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase.from("cms_pages").select("content").eq("page_key", "help-center").eq("is_active", true).single();
      if (data?.content) setCmsContent(data.content);
    };
    fetchContent();
  }, []);

  const helpCategories = [
    { icon: ShoppingCart, titleKey: "helpCenter.ordersPayments", descKey: "helpCenter.ordersPaymentsDesc", link: "/help/orders" },
    { icon: Truck, titleKey: "helpCenter.shippingDelivery", descKey: "helpCenter.shippingDeliveryDesc", link: "/shipping" },
    { icon: Package, titleKey: "helpCenter.returnsRefunds", descKey: "helpCenter.returnsRefundsDesc", link: "/returns" },
    { icon: User, titleKey: "helpCenter.accountProfile", descKey: "helpCenter.accountProfileDesc", link: "/account" },
    { icon: CreditCard, titleKey: "helpCenter.paymentMethods", descKey: "helpCenter.paymentMethodsDesc", link: "/help/payments" },
    { icon: MessageCircle, titleKey: "helpCenter.contactSupportTitle", descKey: "helpCenter.contactSupportDesc", link: "/contact" },
  ];

  const faqs = [
    { qKey: "helpCenter.faq1q", aKey: "helpCenter.faq1a" },
    { qKey: "helpCenter.faq2q", aKey: "helpCenter.faq2a" },
    { qKey: "helpCenter.faq3q", aKey: "helpCenter.faq3a" },
    { qKey: "helpCenter.faq4q", aKey: "helpCenter.faq4a" },
    { qKey: "helpCenter.faq5q", aKey: "helpCenter.faq5a" },
    { qKey: "helpCenter.faq6q", aKey: "helpCenter.faq6a" },
    { qKey: "helpCenter.faq7q", aKey: "helpCenter.faq7a" },
    { qKey: "helpCenter.faq8q", aKey: "helpCenter.faq8a" },
  ];

  const filteredFaqs = faqs.filter(
    faq =>
      t(faq.qKey).toLowerCase().includes(searchQuery.toLowerCase()) ||
      t(faq.aKey).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">{t('helpCenter.title')}</h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">{t('helpCenter.subtitle')}</p>
            <div className="max-w-xl mx-auto relative">
              <Input type="search" placeholder={t('helpCenter.searchPlaceholder')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12 h-14 text-lg" />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </section>

        <section className="py-16 container mx-auto px-4">
          <h2 className="text-2xl font-heading font-bold text-center mb-8">{t('helpCenter.browseByCategory')}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {helpCategories.map((cat) => (
              <NavLink key={cat.titleKey} to={cat.link}>
                <Card className="h-full hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer">
                  <CardHeader className="text-center">
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <cat.icon className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{t(cat.titleKey)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground text-center">{t(cat.descKey)}</p>
                  </CardContent>
                </Card>
              </NavLink>
            ))}
          </div>
        </section>

        {cmsContent && (
          <section className="py-8 container mx-auto px-4">
            <div className="prose prose-lg max-w-4xl mx-auto" dangerouslySetInnerHTML={{ __html: cmsContent }} />
          </section>
        )}

        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-heading font-bold text-center mb-8">{t('helpCenter.faqTitle')}</h2>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="bg-background rounded-lg border px-6">
                    <AccordionTrigger className="text-left font-medium">{t(faq.qKey)}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{t(faq.aKey)}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              {filteredFaqs.length === 0 && (
                <p className="text-center text-muted-foreground py-8">{t('helpCenter.noResults', { query: searchQuery })}</p>
              )}
            </div>
          </div>
        </section>

        <section className="py-16 container mx-auto px-4 text-center">
          <h2 className="text-2xl font-heading font-bold mb-4">{t('helpCenter.stillNeedHelp')}</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">{t('helpCenter.stillNeedHelpDesc')}</p>
          <NavLink to="/contact">
            <Button size="lg" className="bg-primary hover:bg-primary-hover">{t('common.contactSupport')}</Button>
          </NavLink>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HelpCenter;
