import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Skeleton } from "@/components/ui/skeleton";

const PrivacyPolicy = () => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase
        .from("cms_pages")
        .select("content")
        .eq("page_key", "privacy")
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
## Privacy Policy

**Last updated: January 2026**

### 1. Information We Collect

We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.

**Personal Information:**
- Name and email address
- Billing and shipping addresses
- Payment information
- Phone number

### 2. How We Use Your Information

We use the information we collect to:
- Process and fulfill your orders
- Send you transaction confirmations
- Respond to your comments and questions
- Send you marketing communications (with your consent)
- Improve our services

### 3. Information Sharing

We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except:
- To trusted third parties who assist us in operating our website
- When required by law
- To protect our rights or safety

### 4. Data Security

We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

### 5. Cookies

We use cookies to enhance your experience on our site. You can choose to disable cookies through your browser settings.

### 6. Your Rights

You have the right to:
- Access your personal data
- Correct inaccurate data
- Request deletion of your data
- Opt-out of marketing communications

### 7. Contact Us

If you have questions about this Privacy Policy, please contact us at support@syriamall.com.
  `;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-heading font-bold mb-8">Privacy Policy</h1>
          
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : (
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
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
