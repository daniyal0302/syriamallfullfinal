import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Briefcase, ArrowRight } from "lucide-react";

interface JobListing {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
}

const defaultJobs: JobListing[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Join our engineering team to build amazing user experiences for millions of shoppers."
  },
  {
    id: "2",
    title: "Product Manager",
    department: "Product",
    location: "Damascus, Syria",
    type: "Full-time",
    description: "Lead product strategy and work with cross-functional teams to deliver impactful features."
  },
  {
    id: "3",
    title: "Customer Support Specialist",
    department: "Customer Service",
    location: "Remote",
    type: "Full-time",
    description: "Help our customers have the best shopping experience by providing world-class support."
  },
  {
    id: "4",
    title: "Marketing Manager",
    department: "Marketing",
    location: "Damascus, Syria",
    type: "Full-time",
    description: "Drive brand awareness and customer acquisition through innovative marketing campaigns."
  },
  {
    id: "5",
    title: "Vendor Relations Manager",
    department: "Operations",
    location: "Remote",
    type: "Full-time",
    description: "Build and maintain strong relationships with our vendor partners to ensure mutual success."
  }
];

const Careers = () => {
  const [cmsContent, setCmsContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase
        .from("cms_pages")
        .select("content")
        .eq("page_key", "careers")
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
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Join Our Team
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Be part of something big. Help us build the future of e-commerce in Syria and beyond.
            </p>
          </div>
        </section>

        {/* Why Join Us */}
        <section className="py-16 container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">
            Why Work at SyriaMall?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Growth Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We invest in our people. Grow your career with mentorship, training, and advancement opportunities.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Work-Life Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Flexible working hours, remote options, and generous time off to keep you at your best.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Inclusive Culture</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  A diverse and welcoming workplace where every voice is heard and valued.
                </p>
              </CardContent>
            </Card>
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

        {/* Job Listings */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-heading font-bold text-center mb-12">
              Open Positions
            </h2>
            <div className="max-w-4xl mx-auto space-y-4">
              {defaultJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                        <p className="text-muted-foreground mb-3">{job.description}</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">{job.department}</Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {job.type}
                          </Badge>
                        </div>
                      </div>
                      <Button className="bg-primary hover:bg-primary-hover shrink-0">
                        Apply Now
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 container mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">
            Don't see the right role?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            We're always looking for talented people. Send us your resume and we'll keep you in mind for future opportunities.
          </p>
          <Button size="lg" variant="outline">
            Send Your Resume
          </Button>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;
