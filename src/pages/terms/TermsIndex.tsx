import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FileText, ChevronRight } from "lucide-react";

const termsLinks = [
  { id: 1, title: "Acceptance of Terms", slug: "acceptance-of-terms", preview: "By accessing, visiting, browsing, registering on, or using Syria E Mall and any of its related services, features, or content (collectively referred to as th6e “Platform”), you acknowledge that you have read, understood, and agree to be legally bound by these Terms and Conditions, together with any additional policies, guidelines, rules, or notices that are incorporated by reference." },
  { id: 2, title: "Use of Service", slug: "use-of-service", preview: "By accessing or using Syria E Mall, you agree to use the Platform and its services solely for lawful purposes and in strict accordance with these Terms and all applicable laws, regulations, and guidelines." },
  { id: 3, title: "User Accounts", slug: "user-accounts", preview: "To access certain features of Syria E Mall, you may be required to create a user account. When registering, you agree to provide accurate, current, and complete information and to keep your account details updated at all times. " },
  { id: 4, title: "Products and Orders", slug: "products-and-orders", preview: "Syria E Mall strives to provide accurate and up-to-date information regarding product descriptions, images, specifications, pricing, and availability. However, all such information is provided on an “as-is” basis and is subject to change at any time without prior notice. " },
  { id: 5, title: "Payment Terms", slug: "payment-terms", preview: "By placing an order on Syria E Mall, you agree to provide valid, accurate, and complete payment information and represent that you are legally authorized to use the selected payment method. This includes credit cards, debit cards, digital wallets, or any other payment options made available on the Platform. " },
  { id: 6, title: "Shipping and Delivery", slug: "shipping-and-delivery", preview: "Syria E Mall aims to process and ship orders in a timely manner; however, all delivery times provided on the Platform are estimates only and are not guaranteed. " },
//   { id: 7, title: "Returns and Refunds", slug: "returns-and-refunds", preview: "Return and refund policies may vary depending on the vendor. Review the specific policy before purchasing." },
  { id: 7, title: "Intellectual Property", slug: "intellectual-property", preview: "All content available on or through Syria E Mall, including but not limited to text, product descriptions, images, graphics, logos, icons, designs, videos, software, source code, trademarks, service marks, and other materials (collectively, the “Content”), is the exclusive property of Syria E Mall" },
  { id: 8, title: "Limitation of Liability", slug: "limitation-of-liability", preview: "To the fullest extent permitted by applicable law, Syria E Mall, its owners, directors, officers, employees, affiliates, partners, vendors, and service providers shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your access to, use of, or inability to use the Platform or its services. " },
  { id: 9, title: "Contact Information", slug: "contact-information", preview: "If you have any questions, concerns, or inquiries regarding these Terms and Conditions, your rights and obligations under this agreement, or the operation of the Syria E Mall Platform, please feel free to contact us using the details provided below." },
];

const TermsIndex = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Terms of Service</h1>
          </div>
          
          <p className="text-muted-foreground mb-8">
            Please review our Terms of Service carefully. By using SyriaMall, you agree to be bound by these terms.
          </p>

          <div className="space-y-4">
            {termsLinks.map((term) => (
              <div
                key={term.id}
                className="p-5 bg-card border border-border rounded-lg"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                    {term.id}
                  </span>
                  <h2 className="font-semibold text-foreground text-lg">
                    {term.title}
                  </h2>
                </div>
                <p className="text-muted-foreground mb-3 leading-relaxed">
                  {term.preview}
                </p>
                <Link
                  to={`/terms/${term.slug}`}
                  className="inline-flex items-center gap-1 text-primary font-medium hover:underline transition-colors text-sm"
                >
                  Read More
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Last updated: January 2026. If you have any questions about these terms, please contact us at{" "}
              <a href="mailto:legal@syriamall.com" className="text-primary hover:underline">
                legal@syriamall.com
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsIndex;
