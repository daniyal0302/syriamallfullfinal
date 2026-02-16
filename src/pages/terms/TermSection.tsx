// import { useParams, Link } from "react-router-dom";
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
// import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
// import { Button } from "@/components/ui/button";

// const termsContent: Record<string, { title: string; content: string }> = {
//   "acceptance-of-terms": {
//     title: "Acceptance of Terms",
//     content: "By accessing, visiting, browsing, registering on, or using Syria E Mall and any of its related services, features, or content (collectively referred to as th6e “Platform”), you acknowledge that you have read, understood, and agree to be legally bound by these Terms and Conditions, together with any additional policies, guidelines, rules, or notices that are incorporated by reference.",
//   },
//   "use-of-service": {
//     title: "Use of Service",
//     content: "You agree to use SyriaMall only for lawful purposes. You must not misuse the platform in any way, including but not limited to violating laws, disrupting services, or attempting unauthorized access to any part of the website.",
//   },
//   "user-accounts": {
//     title: "User Accounts",
//     content: "When creating an account on SyriaMall, you agree to provide accurate and complete information. You are responsible for keeping your login details secure and for all activities that occur under your account.",
//   },
//   "products-and-orders": {
//     title: "Products and Orders",
//     content: "All products listed on SyriaMall are subject to availability. We reserve the right to modify product details, pricing, or availability at any time, and to cancel or refuse any order at our discretion.",
//   },
//   "payment-terms": {
//     title: "Payment Terms",
//     content: "All payments made on SyriaMall must be authorized and valid. We process payments securely through trusted third-party payment providers and do not store sensitive payment information.",
//   },
//   "shipping-and-delivery": {
//     title: "Shipping and Delivery",
//     content: "Shipping times provided are estimates only. SyriaMall is not responsible for delays caused by shipping companies, customs clearance, or unforeseen circumstances beyond our control.",
//   },
//   "returns-and-refunds": {
//     title: "Returns and Refunds",
//     content: "Return and refund policies may vary depending on the vendor. Customers are advised to review the specific Return Policy associated with each product before making a purchase.",
//   },
//   "intellectual-property": {
//     title: "Intellectual Property",
//     content: "All content available on SyriaMall, including text, images, logos, and software, is protected by intellectual property laws and may not be copied or used without prior written permission.",
//   },
//   "limitation-of-liability": {
//     title: "Limitation of Liability",
//     content: "SyriaMall shall not be held responsible for any indirect, incidental, or consequential damages resulting from the use or inability to use our services.",
//   },
//   "contact-information": {
//     title: "Contact Information",
//     content: "If you have any questions or concerns regarding these Terms of Service, you may contact us at: legal@syriamall.com",
//   },
// };

// const termsSlugs = [
//   "acceptance-of-terms",
//   "use-of-service",
//   "user-accounts",
//   "products-and-orders",
//   "payment-terms",
//   "shipping-and-delivery",
//   "returns-and-refunds",
//   "intellectual-property",
//   "limitation-of-liability",
//   "contact-information",
// ];

// const TermSection = () => {
//   const { slug } = useParams<{ slug: string }>();
//   const term = slug ? termsContent[slug] : null;
  
//   const currentIndex = slug ? termsSlugs.indexOf(slug) : -1;
//   const prevSlug = currentIndex > 0 ? termsSlugs[currentIndex - 1] : null;
//   const nextSlug = currentIndex < termsSlugs.length - 1 ? termsSlugs[currentIndex + 1] : null;

//   if (!term) {
//     return (
//       <div className="min-h-screen flex flex-col bg-background">
//         <Navbar />
//         <main className="flex-1 container mx-auto px-4 py-8">
//           <div className="max-w-3xl mx-auto text-center">
//             <h1 className="text-2xl font-bold text-foreground mb-4">Term Not Found</h1>
//             <Link to="/terms" className="text-primary hover:underline">
//               Back to Terms of Service
//             </Link>
//           </div>
//         </main>
//         <Footer />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col bg-background">
//       <Navbar />
//       <main className="flex-1 container mx-auto px-4 py-8">
//         <div className="max-w-3xl mx-auto">
//           <Link
//             to="/terms"
//             className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Back to Terms of Service
//           </Link>

//           <div className="bg-card border border-border rounded-lg p-6 md:p-8">
//             <div className="flex items-center gap-3 mb-6">
//               <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground text-lg font-bold">
//                 {currentIndex + 1}
//               </span>
//               <h1 className="text-2xl md:text-3xl font-bold text-foreground">{term.title}</h1>
//             </div>

//             <div className="prose prose-gray max-w-none">
//               <p className="text-foreground/80 leading-relaxed text-lg">
//                 {term.content}
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center justify-between mt-6">
//             {prevSlug ? (
//               <Button variant="outline" asChild>
//                 <Link to={`/terms/${prevSlug}`} className="flex items-center gap-2">
//                   <ChevronLeft className="h-4 w-4" />
//                   Previous
//                 </Link>
//               </Button>
//             ) : (
//               <div />
//             )}
            
//             {nextSlug ? (
//               <Button variant="outline" asChild>
//                 <Link to={`/terms/${nextSlug}`} className="flex items-center gap-2">
//                   Next
//                   <ChevronRight className="h-4 w-4" />
//                 </Link>
//               </Button>
//             ) : (
//               <Button asChild>
//                 <Link to="/terms">View All Terms</Link>
//               </Button>
//             )}
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default TermSection;


import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const termsContent: Record<
  string,
  { title: string; content: string[] }
> = {
  "acceptance-of-terms": {
    title: "Acceptance of Terms",
    content: [
      "By accessing, visiting, browsing, registering on, or using Syria E Mall and any of its related services, features, or content (collectively referred to as the “Platform”), you acknowledge that you have read, understood, and agree to be legally bound by these Terms and Conditions.",
      "These Terms form a legally binding agreement between you (“User,” “you,” or “your”) and Syria E Mall (“we,” “us,” or “our”). If you do not agree with any part of these Terms, you must not access or use the Platform. Your continued use of Syria E Mall constitutes your ongoing acceptance of these Terms, including any updates or modifications made from time to time.",
      "Syria E Mall reserves the right to amend, modify, update, or replace these Terms at its sole discretion, without prior notice. Any changes will become effective immediately upon being posted on the Platform. It is your responsibility to review the Terms regularly to stay informed of any updates. Continued access to or use of the Platform following the posting of changes will be deemed your acceptance of those revised Terms.",
      "By using Syria E Mall, you confirm that you are legally capable of entering into a binding agreement under applicable laws and that your use of the Platform complies with all relevant laws and regulations. These Terms apply to all users of the Platform, including visitors, registered users, buyers, sellers, merchants, and content contributors.",
      "If you are using Syria E Mall on behalf of a business or other legal entity, you represent and warrant that you have the authority to bind such entity to these Terms, and in such case, the terms “you” and “your” shall refer to that entity."
    ],
  },

  "use-of-service": {
    title: "Use of Service",
    content: [
      "By accessing or using Syria E Mall, you agree to use the Platform and its services solely for lawful purposes and in strict accordance with these Terms and all applicable laws, regulations, and guidelines. You are responsible for ensuring that your use of the Platform does not violate any local, national, or international laws, including but not limited to laws related to commerce, consumer protection, intellectual property, data protection, and online conduct.",
      "You agree not to use Syria E Mall in any manner that is unlawful, fraudulent, abusive, deceptive, harmful, or otherwise objectionable. This includes, but is not limited to, engaging in activities that may disrupt, damage, overburden, or impair the proper functioning, security, or integrity of the Platform. Any behavior that interferes with or restricts another user’s ability to access or enjoy the services is strictly prohibited.",
      "Users must not attempt to gain unauthorized access to any part of the Platform, including user accounts, systems, servers, databases, or networks connected to Syria E Mall. This includes attempting to bypass security features, hacking, password mining, data scraping, introducing malicious code, or exploiting vulnerabilities. Any such attempts may result in immediate suspension or termination of access and may be reported to relevant authorities where required by law.",
      "You further agree not to use Syria E Mall to distribute harmful or malicious content, engage in spam or unsolicited communications, impersonate any individual or entity, or misrepresent your affiliation with any person or organization. Syria E Mall reserves the right, at its sole discretion, to monitor usage, investigate suspected violations, and take appropriate legal or technical action, including restricting access, removing content, or terminating user accounts without prior notice.",
      "Failure to comply with this section may result in suspension or permanent termination of your access to the Platform and may expose you to civil or criminal liability under applicable laws."
    ],
  },

  "user-accounts": {
    title: "User Accounts",
    content: [
      "To access certain features of Syria E Mall, you may be required to create a user account. When registering, you agree to provide accurate, current, and complete information and to keep your account details updated at all times. Providing false, misleading, or incomplete information may result in the suspension or termination of your account.",
      "You are solely responsible for maintaining the confidentiality and security of your account credentials, including your username, password, and any other authentication information. You agree not to share your login details with any third party and to take reasonable measures to prevent unauthorized access to your account.",
      "All activities conducted through your account, whether authorized or unauthorized, are your responsibility. Syria E Mall will not be liable for any loss, damage, or unauthorized transactions resulting from your failure to safeguard your account credentials. You agree that any actions taken through your account will be deemed to have been taken by you.",
      "If you become aware of any unauthorized use of your account, suspected security breach, or compromise of your login credentials, you must notify Syria E Mall immediately. Upon receiving such notice, Syria E Mall may take reasonable steps to secure the account, including temporarily suspending access or requiring a password reset. However, Syria E Mall is not responsible for any loss or damage incurred before such notice is provided.",
      "Syria E Mall reserves the right to suspend or terminate user accounts at its discretion if it believes that an account has been compromised, is being used in violation of these Terms, or poses a security risk to the Platform or other users."
    ],
  },

  "products-and-orders": {
    title: "Products and Orders",
    content: [
      "Syria E Mall strives to provide accurate and up-to-date information regarding product descriptions, images, specifications, pricing, and availability. However, all such information is provided on an “as-is” basis and is subject to change at any time without prior notice. We do not guarantee that product descriptions, images, or other content on the Platform are accurate, complete, reliable, current, or error-free, and minor variations in appearance, color, or packaging may occur.",
      "All prices listed on Syria E Mall are subject to modification without notice. In the event of a pricing error, typographical mistake, or incorrect product information, Syria E Mall reserves the right to correct such errors and to refuse, cancel, or modify any order placed for products listed at an incorrect price, whether or not the order has been confirmed or payment has been processed. If payment has already been made, a refund may be issued in accordance with our refund policy.",
      "Syria E Mall reserves the right, at its sole discretion, to limit the quantity of items purchased per order, per account, per household, or per transaction. We may also refuse or cancel any order if we suspect fraudulent activity, unauthorized or illegal transactions, violations of these Terms, or misuse of the Platform. Order cancellation may occur even after order confirmation or payment authorization.",
      "We further reserve the right to discontinue, modify, or remove any product or service from the Platform at any time, without notice and without liability. Product availability is not guaranteed, and items may become unavailable after an order is placed. In such cases, Syria E Mall may cancel the affected order or offer an alternative solution, such as a refund or replacement, at its discretion.",
      "By placing an order on Syria E Mall, you acknowledge and agree that all purchases are subject to availability, verification, and acceptance by Syria E Mall and that we are not obligated to fulfill any order if it does not comply with these Terms."
    ],
  },

  "payment-terms": {
    title: "Payment Terms",
    content: [
      "By placing an order on Syria E Mall, you agree to provide valid, accurate, and complete payment information and represent that you are legally authorized to use the selected payment method. This includes credit cards, debit cards, digital wallets, or any other payment options made available on the Platform. You further authorize Syria E Mall and its designated payment partners to charge the full amount of your purchase, including applicable taxes, fees, and shipping charges, to the payment method provided.",
      "All payments made through Syria E Mall are processed securely via trusted third-party payment service providers. Syria E Mall does not store, process, or have direct access to your full payment card details. Payment information is handled in accordance with industry-standard security practices and the privacy policies of our payment partners. While we take reasonable measures to ensure secure transactions, Syria E Mall shall not be held responsible for any issues arising directly from the payment service providers.",
      "In the event that a payment is declined, reversed, or fails for any reason, Syria E Mall reserves the right to cancel or suspend the related order or account until payment is successfully completed. Any unauthorized, fraudulent, or suspicious transactions may be investigated and reported to relevant authorities where required by law.",
      "Prices and payment obligations are final at the time of purchase unless otherwise stated. Refunds, chargebacks, and payment disputes will be handled in accordance with Syria E Mall’s refund and dispute resolution policies. By using the Platform, you acknowledge and agree to comply with all payment-related terms imposed by our payment partners."
    ],
  },

  "shipping-and-delivery": {
    title: "Shipping and Delivery",
    content: [
      "Syria E Mall aims to process and ship orders in a timely manner; however, all delivery times provided on the Platform are estimates only and are not guaranteed. Estimated delivery dates may vary based on factors such as product availability, shipping method selected, destination, carrier operations, weather conditions, and customs clearance procedures. By placing an order, you acknowledge that delivery timelines are approximate and may be subject to change.",
      "Shipping services are fulfilled through third-party logistics providers and carriers. Once an order has been dispatched, Syria E Mall does not have direct control over the shipping process. As a result, we are not responsible for delays, losses, or delivery failures caused by shipping carriers, customs authorities, border inspections, or other circumstances beyond our reasonable control.",
      "International shipments may be subject to customs inspections, import duties, taxes, or additional charges imposed by the destination country. Any such fees or delays related to customs processing are the sole responsibility of the customer. Syria E Mall is not liable for delays caused by customs clearance procedures or for orders held, returned, or confiscated by customs authorities.",
      "Risk of loss and ownership of products pass to the customer upon handover of the shipment to the carrier, unless otherwise required by applicable law. Syria E Mall shall not be held responsible for delivery delays caused by incorrect or incomplete shipping information provided by the customer. It is the customer’s responsibility to ensure that all delivery details are accurate at the time of order placement.",
      "In the event of significant delivery issues, Syria E Mall may, at its discretion, assist customers in coordinating with the shipping carrier to resolve the matter; however, this assistance does not constitute acceptance of liability."
    ],
  },

//   "returns-and-refunds": {
//     title: "Returns and Refunds",
//     content: [
//       "Return and refund policies may vary depending on the vendor.",
//       "Customers must review the specific Return Policy associated with each product before purchase.",
//       "Refunds are processed according to the vendor’s individual policy."
//     ],
//   },

  "intellectual-property": {
    title: "Intellectual Property",
    content: [
      "All content available on or through Syria E Mall, including but not limited to text, product descriptions, images, graphics, logos, icons, designs, videos, software, source code, trademarks, service marks, and other materials (collectively, the “Content”), is the exclusive property of Syria E Mall or its licensors, vendors, or content providers and is protected by applicable intellectual property laws, including copyright, trademark, and other proprietary rights.",
      "The compilation, organization, structure, and overall presentation of the Content on the Platform are also the intellectual property of Syria E Mall and are protected by law. Unauthorized use, reproduction, modification, distribution, transmission, display, performance, publication, or exploitation of any Content, in whole or in part, without prior written consent from Syria E Mall or the respective rights holder is strictly prohibited.",
      "Syria E Mall grants you a limited, non-exclusive, non-transferable, and revocable license to access and use the Platform and its Content solely for personal, non-commercial use and in accordance with these Terms. This license does not grant you any ownership rights in the Content. You may not copy, download, scrape, reverse engineer, create derivative works from, or otherwise misuse any part of the Platform or its Content without express authorization.",
      "All trademarks, logos, and service marks displayed on Syria E Mall are registered or unregistered trademarks of Syria E Mall or its vendors. Nothing contained on the Platform shall be construed as granting, by implication or otherwise, any license or right to use any trademark without the prior written permission of the trademark owner.",
      "Any unauthorized use of Syria E Mall’s intellectual property or that of its vendors may result in termination of access to the Platform and may subject the user to civil or criminal liability under applicable laws."
    ],
  },

  "limitation-of-liability": {
    title: "Limitation of Liability",
    content: [
      "To the fullest extent permitted by applicable law, Syria E Mall, its owners, directors, officers, employees, affiliates, partners, vendors, and service providers shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your access to, use of, or inability to use the Platform or its services. This includes, without limitation, damages for loss of profits, revenue, business opportunities, data, goodwill, or other intangible losses, even if Syria E Mall has been advised of the possibility of such damages.",
      "Syria E Mall provides its services, products, and content on an “as-is” and “as-available” basis without warranties of any kind, whether express or implied. We do not guarantee that the Platform will be uninterrupted, error-free, secure, or free from viruses or other harmful components. Any reliance you place on the Platform or its content is strictly at your own risk.",
      "In no event shall Syria E Mall’s total liability to you for any claims, damages, losses, or causes of action arising out of or related to your use of the Platform exceed the amount paid by you, if any, to Syria E Mall for the relevant product or service giving rise to the claim.",
      "Syria E Mall shall not be liable for damages resulting from actions or omissions of third parties, including but not limited to payment processors, shipping carriers, vendors, or external service providers. We are also not responsible for delays, failures, or interruptions caused by events beyond our reasonable control, including acts of God, natural disasters, government actions, internet outages, or system failures.",
      "Nothing in these Terms shall exclude or limit liability for matters that cannot be excluded or limited under applicable law. In such cases, Syria E Mall’s liability shall be limited to the maximum extent permitted by law."
    ],
  },

  "contact-information": {
    title: "Contact Information",
    content: [
      "If you have any questions, concerns, or inquiries regarding these Terms and Conditions, your rights and obligations under this agreement, or the operation of the Syria E Mall Platform, please feel free to contact us using the details provided below. We encourage users to reach out for clarification, feedback, or assistance related to these Terms.",
      "All legal notices, requests, or communications concerning these Terms should be directed to our official contact channel. Syria E Mall will make reasonable efforts to review and respond to inquiries in a timely manner; however, response times may vary depending on the nature of the request.",
      "Email: legal@syriaemall.com",
      "By contacting Syria E Mall, you agree that communications may be conducted electronically and that such electronic communications satisfy any legal requirement for written notice, to the extent permitted by applicable law."
    ],
  },
};

const termsSlugs = [
  "acceptance-of-terms",
  "use-of-service",
  "user-accounts",
  "products-and-orders",
  "payment-terms",
  "shipping-and-delivery",
//   "returns-and-refunds",
  "intellectual-property",
  "limitation-of-liability",
  "contact-information",
];

const TermSection = () => {
  const { slug } = useParams<{ slug: string }>();
  const term = slug ? termsContent[slug] : null;

  const currentIndex = slug ? termsSlugs.indexOf(slug) : -1;
  const prevSlug = currentIndex > 0 ? termsSlugs[currentIndex - 1] : null;
  const nextSlug =
    currentIndex < termsSlugs.length - 1
      ? termsSlugs[currentIndex + 1]
      : null;

  if (!term) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Term Not Found
            </h1>
            <Link to="/terms" className="text-primary hover:underline">
              Back to Terms of Service
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/terms"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Terms of Service
          </Link>

          <div className="bg-card border border-border rounded-lg p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground text-lg font-bold">
                {currentIndex + 1}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {term.title}
              </h1>
            </div>

            {/* Multiple Paragraph Support */}
            <div className="space-y-4">
              {term.content.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-foreground/80 leading-relaxed text-lg"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            {prevSlug ? (
              <Button variant="outline" asChild>
                <Link
                  to={`/terms/${prevSlug}`}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Link>
              </Button>
            ) : (
              <div />
            )}

            {nextSlug ? (
              <Button variant="outline" asChild>
                <Link
                  to={`/terms/${nextSlug}`}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <Link to="/terms">View All Terms</Link>
              </Button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermSection;

