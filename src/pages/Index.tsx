
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { CheckCircle, ArrowRight, Sparkles, Users, BarChart, FileText, Clock, Zap } from 'lucide-react';

const Index = () => {
  console.log('Index component rendering');

  // For animated sections
  const { ref: demoRef, inView: demoInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const { ref: ctaRef, inView: ctaInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const { ref: testimonialsRef, inView: testimonialsInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const { ref: pricingRef, inView: pricingInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    console.log('Index component mounted');
    document.title = 'TopHive - AI-Powered Sales Briefings';
  }, []);
  
  return (
    <div className="min-h-screen bg-background">
      {/* Regular content */}
      <Header />
      <Hero />
      
      {/* How It Works Section */}
      <section ref={demoRef} className="py-20">
        <div className="container px-6 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground">
              Generate comprehensive sales briefings in just three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: FileText,
                title: "Input Basic Meeting Context",
                description: "Enter the company name, meeting type, and any optional focus areas. Our AI takes care of the rest.",
                delay: 100
              },
              {
                icon: Sparkles,
                title: "AI Generates Insights",
                description: "Our powerful AI fetches and analyzes data from multiple sources to create a comprehensive briefing.",
                delay: 300
              },
              {
                icon: Zap,
                title: "Review & Customize",
                description: "Receive a structured briefing with key takeaways, company insights, and actionable talking points.",
                delay: 500
              }
            ].map((step, i) => (
              <div 
                key={i}
                className={`flex flex-col items-center text-center transition-all duration-1000 ${
                  demoInView
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${step.delay}ms` }}
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <step.icon size={28} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Value Props Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container px-6 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Why Sales Teams Love TopHive
              </h2>
              
              <div className="space-y-6">
                {[
                  {
                    title: "Save Research Time",
                    description: "Reduce meeting prep from hours to minutes with AI-powered research and insights."
                  },
                  {
                    title: "Never Miss Key Information",
                    description: "Get comprehensive company details, decision maker insights, and competitive intelligence."
                  },
                  {
                    title: "Prepare with Confidence",
                    description: "Walk into every meeting armed with strategic talking points and sales hypotheses."
                  },
                  {
                    title: "Stay on Top of Developments",
                    description: "Automatically track news, leadership changes, and market movements."
                  }
                ].map((item, i) => (
                  <div key={i} className="flex">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-10">
                <Link to="/signup">
                  <Button size="lg" className="shadow-md hover:shadow-lg">
                    Start for Free
                    <ArrowRight size={16} className="ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="flex justify-center lg:justify-end">
              <div className="relative max-w-md">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-400/20 rounded-2xl blur-3xl"></div>
                <div className="relative bg-background rounded-xl overflow-hidden border shadow-xl">
                  <div className="p-1">
                    <div className="flex items-center px-3 py-2 border-b">
                      <div className="flex space-x-1.5">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="mx-auto text-xs text-muted-foreground">
                        TopHive
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium mb-2">Company Briefing - Snowflake</h3>
                      <div className="space-y-3">
                        <div className="bg-secondary/50 p-3 rounded-md">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Key Takeaways</p>
                          <ul className="text-sm space-y-2">
                            <li className="flex items-start">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2"></span>
                              <span>Recently closed $200M Series F funding round</span>
                            </li>
                            <li className="flex items-start">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2"></span>
                              <span>New CTO hired from major cloud provider</span>
                            </li>
                            <li className="flex items-start">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2"></span>
                              <span>Expanding data analytics capabilities</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-secondary/50 p-3 rounded-md">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Sales Hypotheses</p>
                          <p className="text-sm">Snowflake's recent funding and leadership changes suggest they're likely investing in expanded data infrastructure, making our solution timely.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Statistics */}
      <section className="py-20">
        <div className="container px-6 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "80%", label: "Less Research Time", icon: Clock },
              { value: "3x", label: "More Meeting Confidence", icon: Users },
              { value: "90%", label: "Higher Meeting Effectiveness", icon: BarChart },
              { value: "85%", label: "Improved Close Rates", icon: Sparkles },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <stat.icon size={20} />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section ref={testimonialsRef} className="py-20 bg-secondary/50">
        <div className="container px-6 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">
              What Sales Professionals Say
            </h2>
            <p className="text-muted-foreground">
              Hear from sales representatives who have transformed their meeting preparation
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "TopHive has become my secret weapon. I save hours on research before each call and walk in with insights my competitors don't have.",
                author: "Sarah J.",
                role: "Account Executive",
                company: "Enterprise Tech",
                delay: 100
              },
              {
                quote: "The AI-generated sales hypotheses are spot on. They've helped me identify opportunities and objections I might have missed otherwise.",
                author: "Michael T.",
                role: "Sales Director",
                company: "SaaS Platform",
                delay: 300
              },
              {
                quote: "As a new AE, this tool has been invaluable. It gives me the confidence of someone with years of experience in every meeting.",
                author: "Priya K.",
                role: "Sales Representative",
                company: "Financial Services",
                delay: 500
              }
            ].map((testimonial, i) => (
              <div 
                key={i} 
                className={`bg-background p-6 rounded-xl border shadow-sm hover:shadow-md transition-all duration-700 ${
                  testimonialsInView
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${testimonial.delay}ms` }}
              >
                <blockquote className="text-lg italic mb-6">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section ref={pricingRef} className="py-20">
        <div className="container px-6 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground">
              Choose the plan that's right for your sales needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "$29",
                description: "Perfect for individual sales reps",
                features: [
                  "15 briefings per month",
                  "Basic company insights",
                  "Key contacts identification",
                  "PDF export",
                  "Email support"
                ],
                highlight: false,
                delay: 100
              },
              {
                name: "Professional",
                price: "$79",
                description: "Ideal for growing sales teams",
                features: [
                  "50 briefings per month",
                  "Advanced company insights",
                  "Competitor analysis",
                  "Team sharing",
                  "Priority support",
                  "API access"
                ],
                highlight: true,
                delay: 200
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For organizations with large sales teams",
                features: [
                  "Unlimited briefings",
                  "Full data integration",
                  "Custom AI training",
                  "CRM integration",
                  "Dedicated account manager",
                  "SLA guarantee"
                ],
                highlight: false,
                delay: 300
              }
            ].map((plan, i) => (
              <div 
                key={i}
                className={`border rounded-xl overflow-hidden transition-all duration-1000 ${
                  plan.highlight ? 'border-primary shadow-lg relative' : 'bg-background shadow-sm hover:shadow transition-shadow'
                } ${
                  pricingInView
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${plan.delay}ms` }}
              >
                {plan.highlight && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 transform translate-x-2 -translate-y-1/2 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className={`p-6 ${plan.highlight ? 'bg-primary/5' : ''}`}>
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-end mb-4">
                    <span className="text-3xl font-extrabold">{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-muted-foreground ml-1">/month</span>}
                  </div>
                  <p className="text-muted-foreground mb-6">{plan.description}</p>
                  <Link to="/signup">
                    <Button 
                      className={`w-full ${plan.highlight ? '' : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'}`}
                      variant={plan.highlight ? 'default' : 'outline'}
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
                <div className="p-6 border-t bg-background">
                  <p className="font-medium mb-4">What's included:</p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section 
        ref={ctaRef} 
        className={`py-20 bg-primary/5 transition-all duration-1000 ${
          ctaInView ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="container px-6 mx-auto text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Sales Meetings?
          </h2>
          <p className="text-lg mb-8">
            Join thousands of sales professionals who have elevated their meeting preparation with AI-powered briefings.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="shadow-md hover:shadow-lg w-full sm:w-auto">
                Get Started for Free
              </Button>
            </Link>
            <Link to="/demo">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                See a Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-secondary/70 py-12">
        <div className="container px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-2">
                  <span className="text-white font-bold">TH</span>
                </span>
                <span className="font-semibold">TopHive</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                AI-powered sales briefings that give you the edge in every meeting.
              </p>
            </div>
            
            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Integrations", "Updates"]
              },
              {
                title: "Resources",
                links: ["Documentation", "Tutorials", "Blog", "API"]
              },
              {
                title: "Company",
                links: ["About Us", "Careers", "Contact", "Press"]
              }
            ].map((column, i) => (
              <div key={i}>
                <h3 className="font-medium mb-4">{column.title}</h3>
                <ul className="space-y-3">
                  {column.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} TopHive. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
