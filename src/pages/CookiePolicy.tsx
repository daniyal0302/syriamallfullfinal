// import { useEffect, useState } from "react";
// import { supabase } from "@/integrations/supabase/client";
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
// import { Skeleton } from "@/components/ui/skeleton";

// const CookiePolicy = () => {
//   const [content, setContent] = useState<string>("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchContent = async () => {
//       const { data } = await supabase
//         .from("cms_pages")
//         .select("content")
//         .eq("page_key", "cookies")
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
// ## Cookie Policy

// **Last updated: January 2026**

// ### 1. What Are Cookies?

// Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.

// ### 2. How We Use Cookies

// SyriaMall uses cookies for various purposes:

// **Essential Cookies:**
// - Session management
// - Shopping cart functionality
// - User authentication
// - Security features

// **Performance Cookies:**
// - Analytics and statistics
// - Load balancing
// - Site performance monitoring

// **Functionality Cookies:**
// - Remembering your preferences
// - Language settings
// - Recently viewed products

// **Marketing Cookies:**
// - Personalized advertisements
// - Social media integration
// - Remarketing campaigns

// ### 3. Types of Cookies We Use

// **Session Cookies:** Temporary cookies that expire when you close your browser.

// **Persistent Cookies:** Cookies that remain on your device for a set period or until you delete them.

// **First-Party Cookies:** Cookies set by SyriaMall directly.

// **Third-Party Cookies:** Cookies set by our partners and service providers.

// ### 4. Managing Cookies

// You can control and manage cookies in various ways:

// **Browser Settings:** Most browsers allow you to refuse or accept cookies, delete existing cookies, and set preferences for certain websites.

// **Opt-Out Tools:** Many advertising networks offer opt-out tools to limit targeted advertising.

// ### 5. Impact of Disabling Cookies

// If you disable cookies, some features of our website may not function properly, including:
// - Shopping cart functionality
// - User account features
// - Personalized recommendations

// ### 6. Updates to This Policy

// We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.

// ### 7. Contact Us

// If you have questions about our use of cookies, please contact us at privacy@syriamall.com.
//   `;

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />
//       <main className="container mx-auto px-4 py-12">
//         <div className="max-w-4xl mx-auto">
//           <h1 className="text-3xl font-heading font-bold mb-8">Cookie Policy</h1>
          
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

// export default CookiePolicy;

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";

const CookiePolicy = () => {
  const { t } = useTranslation();
  const [cmsContent, setCmsContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase
        .from("cms_pages")
        .select("content")
        .eq("page_key", "cookies")
        .eq("is_active", true)
        .single();
      
      if (data?.content) {
        setCmsContent(data.content);
      }
      setLoading(false);
    };

    fetchContent();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-heading font-bold mb-8">{t('cookiePolicy.title')}</h1>
          
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : cmsContent ? (
            <div className="prose prose-gray dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: cmsContent }}
            />
          ) : (
            <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
              <p className="text-sm text-muted-foreground font-semibold">{t('cookiePolicy.lastUpdated')}</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">{t('cookiePolicy.whatAreCookies')}</h3>
              <p className="text-muted-foreground mb-2">{t('cookiePolicy.whatAreCookiesDesc')}</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">{t('cookiePolicy.howWeUseCookies')}</h3>
              <p className="text-muted-foreground mb-2">{t('cookiePolicy.howWeUseCookiesDesc')}</p>

              <p className="font-semibold mt-4">{t('cookiePolicy.essentialCookies')}</p>
              <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                <li>{t('cookiePolicy.essential1')}</li>
                <li>{t('cookiePolicy.essential2')}</li>
                <li>{t('cookiePolicy.essential3')}</li>
                <li>{t('cookiePolicy.essential4')}</li>
              </ul>

              <p className="font-semibold mt-4">{t('cookiePolicy.performanceCookies')}</p>
              <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                <li>{t('cookiePolicy.performance1')}</li>
                <li>{t('cookiePolicy.performance2')}</li>
                <li>{t('cookiePolicy.performance3')}</li>
              </ul>

              <p className="font-semibold mt-4">{t('cookiePolicy.functionalityCookies')}</p>
              <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                <li>{t('cookiePolicy.functionality1')}</li>
                <li>{t('cookiePolicy.functionality2')}</li>
                <li>{t('cookiePolicy.functionality3')}</li>
              </ul>

              <p className="font-semibold mt-4">{t('cookiePolicy.marketingCookies')}</p>
              <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                <li>{t('cookiePolicy.marketing1')}</li>
                <li>{t('cookiePolicy.marketing2')}</li>
                <li>{t('cookiePolicy.marketing3')}</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">{t('cookiePolicy.typesOfCookies')}</h3>
              <p className="font-semibold mt-4">{t('cookiePolicy.sessionCookies')}</p>
              <p className="text-muted-foreground mb-2">{t('cookiePolicy.sessionCookiesDesc')}</p>
              <p className="font-semibold mt-4">{t('cookiePolicy.persistentCookies')}</p>
              <p className="text-muted-foreground mb-2">{t('cookiePolicy.persistentCookiesDesc')}</p>
              <p className="font-semibold mt-4">{t('cookiePolicy.firstPartyCookies')}</p>
              <p className="text-muted-foreground mb-2">{t('cookiePolicy.firstPartyCookiesDesc')}</p>
              <p className="font-semibold mt-4">{t('cookiePolicy.thirdPartyCookies')}</p>
              <p className="text-muted-foreground mb-2">{t('cookiePolicy.thirdPartyCookiesDesc')}</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">{t('cookiePolicy.managingCookies')}</h3>
              <p className="text-muted-foreground mb-2">{t('cookiePolicy.managingCookiesDesc')}</p>
              <p className="font-semibold mt-4">{t('cookiePolicy.browserSettings')}</p>
              <p className="text-muted-foreground mb-2">{t('cookiePolicy.browserSettingsDesc')}</p>
              <p className="font-semibold mt-4">{t('cookiePolicy.optOutTools')}</p>
              <p className="text-muted-foreground mb-2">{t('cookiePolicy.optOutToolsDesc')}</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">{t('cookiePolicy.impactOfDisabling')}</h3>
              <p className="text-muted-foreground mb-2">{t('cookiePolicy.impactOfDisablingDesc')}</p>
              <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                <li>{t('cookiePolicy.impact1')}</li>
                <li>{t('cookiePolicy.impact2')}</li>
                <li>{t('cookiePolicy.impact3')}</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">{t('cookiePolicy.updates')}</h3>
              <p className="text-muted-foreground mb-2">{t('cookiePolicy.updatesDesc')}</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">{t('cookiePolicy.contactUs')}</h3>
              <p className="text-muted-foreground mb-2">{t('cookiePolicy.contactUsDesc')}</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CookiePolicy;

