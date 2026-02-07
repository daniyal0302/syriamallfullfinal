// import { useEffect, useState } from "react";
// import { supabase } from "@/integrations/supabase/client";
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
// import { Skeleton } from "@/components/ui/skeleton";

// const TermsOfService = () => {
//   const [content, setContent] = useState<string>("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchContent = async () => {
//       const { data } = await supabase
//         .from("cms_pages")
//         .select("content")
//         .eq("page_key", "terms")
//         .eq("is_active", true)
//         .single();
      
//       if (data?.content) {
//         setContent(data.content);
//       } else {
//         setContent(getDefaultContent());
//       }
//       setLoading(false);
//     };

//     fetchContent();
//   }, []);

//   const getDefaultContent = () => `
// ## Terms of Service

// **Last updated: January 2026**

// ### 1. Acceptance of Terms

// By accessing and using SyriaMall, you accept and agree to be bound by the terms and provision of this agreement.

// ### 2. Use of Service

// You agree to use our services only for lawful purposes and in accordance with these Terms. You agree not to:
// - Use the service in any way that violates any applicable law
// - Engage in any conduct that restricts or inhibits anyone's use of the service
// - Attempt to gain unauthorized access to any portion of the service

// ### 3. User Accounts

// When you create an account with us, you must provide accurate and complete information. You are responsible for:
// - Maintaining the confidentiality of your account
// - All activities that occur under your account
// - Notifying us immediately of any unauthorized use

// ### 4. Products and Orders

// All product descriptions, pricing, and availability are subject to change without notice. We reserve the right to:
// - Limit the quantity of items purchased
// - Refuse or cancel any order
// - Discontinue any product at any time

// ### 5. Payment Terms

// By providing payment information, you represent that you are authorized to use the payment method. All payments are processed securely through our payment partners.

// ### 6. Shipping and Delivery

// Delivery times are estimates and not guaranteed. We are not responsible for delays caused by shipping carriers or customs processing.

// ### 7. Returns and Refunds

// Please refer to our Return Policy for information about returns and refunds. Each vendor may have specific return policies.

// ### 8. Intellectual Property

// All content on SyriaMall, including text, graphics, logos, and software, is our property or the property of our vendors and is protected by intellectual property laws.

// ### 9. Limitation of Liability

// SyriaMall shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.

// ### 10. Contact Information

// For questions about these Terms, please contact us at legal@syriamall.com.
//   `;

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />
//       <main className="container mx-auto px-4 py-12">
//         <div className="max-w-4xl mx-auto">
//           <h1 className="text-3xl font-heading font-bold mb-8">Terms of Service</h1>
          
//           {loading ? (
//             <div className="space-y-4">
//               <Skeleton className="h-6 w-3/4" />
//               <Skeleton className="h-4 w-full" />
//               <Skeleton className="h-4 w-full" />
//               <Skeleton className="h-4 w-2/3" />
//             </div>
//           ) : (
//             <div className="prose prose-gray dark:prose-invert max-w-none">
//               {content.split('\n').map((line, index) => {
//                 if (line.startsWith('## ')) {
//                   return <h2 key={index} className="text-2xl font-bold mt-8 mb-4">{line.replace('## ', '')}</h2>;
//                 } else if (line.startsWith('### ')) {
//                   return <h3 key={index} className="text-xl font-semibold mt-6 mb-3">{line.replace('### ', '')}</h3>;
//                 } else if (line.startsWith('**') && line.endsWith('**')) {
//                   return <p key={index} className="font-semibold mt-4">{line.replace(/\*\*/g, '')}</p>;
//                 } else if (line.startsWith('- ')) {
//                   return <li key={index} className="ml-6">{line.replace('- ', '')}</li>;
//                 } else if (line.trim()) {
//                   return <p key={index} className="text-muted-foreground mb-2">{line}</p>;
//                 }
//                 return null;
//               })}
//             </div>
//           )}
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default TermsOfService;

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Skeleton } from "@/components/ui/skeleton";

const TermsOfService = () => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase
        .from("cms_pages")
        .select("content")
        .eq("page_key", "terms")
        .eq("is_active", true)
        .single();
      
      if (data?.content) {
        setContent(data.content);
      } else {
        setContent(getDefaultContent());
      }
      setLoading(false);
    };

    fetchContent();
  }, []);

  const getDefaultContent = () => `
## Terms of Service

**Last updated: January 2026**

### 1. Acceptance of Terms

By accessing and using SyriaMall, you accept and agree to be bound by the terms and provision of this agreement.

### 2. Use of Service

You agree to use our services only for lawful purposes and in accordance with these Terms. You agree not to:
- Use the service in any way that violates any applicable law
- Engage in any conduct that restricts or inhibits anyone's use of the service
- Attempt to gain unauthorized access to any portion of the service

### 3. User Accounts

When you create an account with us, you must provide accurate and complete information. You are responsible for:
- Maintaining the confidentiality of your account
- All activities that occur under your account
- Notifying us immediately of any unauthorized use

### 4. Products and Orders

All product descriptions, pricing, and availability are subject to change without notice. We reserve the right to:
- Limit the quantity of items purchased
- Refuse or cancel any order
- Discontinue any product at any time

### 5. Payment Terms

By providing payment information, you represent that you are authorized to use the payment method. All payments are processed securely through our payment partners.

### 6. Shipping and Delivery

Delivery times are estimates and not guaranteed. We are not responsible for delays caused by shipping carriers or customs processing.

### 7. Returns and Refunds

Please refer to our Return Policy for information about returns and refunds. Each vendor may have specific return policies.

### 8. Intellectual Property

All content on SyriaMall, including text, graphics, logos, and software, is our property or the property of our vendors and is protected by intellectual property laws.

### 9. Limitation of Liability

SyriaMall shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.

### 10. Contact Information

For questions about these Terms, please contact us at legal@syriamall.com.
  `;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-heading font-bold mb-8">Terms of Service</h1>
          
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : (
            <div className="prose prose-gray dark:prose-invert max-w-none">
  {content.split("\n").map((line, index) => {
    // 🔹 SECTION HEADING
    if (line.startsWith("### ")) {
      const sectionNumber = line.match(/\d+/)?.[0];

      return (
        <div key={index}>
          <h3 className="text-xl font-semibold mt-6 mb-3">
            {line.replace("### ", "")}
          </h3>

          {/* ✅ READ MORE BUTTON FOR EACH SECTION */}
          {sectionNumber && (
            <a
              href={`/pdf/terms-${sectionNumber}.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 mb-4 text-sm font-medium text-primary underline"
            >
              Read more
            </a>
          )}
        </div>
      );
    }

    // 🔹 BULLET POINTS
    if (line.startsWith("- ")) {
      return (
        <li key={index} className="ml-6">
          {line.replace("- ", "")}
        </li>
      );
    }

    // 🔹 BOLD LINE
    if (line.startsWith("**") && line.endsWith("**")) {
      return (
        <p key={index} className="font-semibold mt-4">
          {line.replace(/\*\*/g, "")}
        </p>
      );
    }

    // 🔹 NORMAL TEXT
    if (line.trim()) {
      return (
        <p key={index} className="text-muted-foreground mb-2">
          {line}
        </p>
      );
    }

    return null;
  })}
</div>

          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;

