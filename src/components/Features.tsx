
import { CheckCircle, Building, Users, TrendingUp, Activity, Zap } from 'lucide-react';

const Features = () => {
  return (
    <section className="py-20 bg-secondary/50">
      <div className="container px-6 mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">
            How SalesBriefGenius Works
          </h2>
          <p className="text-muted-foreground">
            Our AI-powered platform transforms minimal input into comprehensive sales briefings, saving you time and giving you the edge in every meeting.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
          {/* Feature 1 */}
          <div className="flex flex-col space-y-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary p-3 rounded-lg">
                <Building size={24} />
              </div>
              <h3 className="text-xl font-semibold">Minimal Input</h3>
            </div>
            <div className="pl-12">
              <p className="text-muted-foreground mb-4">
                Just enter the company name and meeting type. Our AI will suggest relevant fields and auto-populate the rest.
              </p>
              <ul className="space-y-2">
                {['Company Name', 'Meeting Type', 'Optional Contact', 'Custom Focus Areas'].map((item, i) => (
                  <li key={i} className="flex items-center text-sm">
                    <CheckCircle size={16} className="text-primary mr-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Feature 2 */}
          <div className="flex flex-col space-y-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary p-3 rounded-lg">
                <Activity size={24} />
              </div>
              <h3 className="text-xl font-semibold">AI Research</h3>
            </div>
            <div className="pl-12">
              <p className="text-muted-foreground mb-4">
                Our AI automatically fetches and analyzes relevant data from multiple sources to generate comprehensive insights.
              </p>
              <ul className="space-y-2">
                {['Company Overview', 'Recent News', 'Financial Health', 'Key Decision Makers', 'Competitive Landscape'].map((item, i) => (
                  <li key={i} className="flex items-center text-sm">
                    <CheckCircle size={16} className="text-primary mr-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Feature 3 */}
          <div className="flex flex-col space-y-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary p-3 rounded-lg">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-semibold">Structured Output</h3>
            </div>
            <div className="pl-12">
              <p className="text-muted-foreground mb-4">
                Get a perfectly structured briefing with key insights organized for quick consumption before your meeting.
              </p>
              <ul className="space-y-2">
                {['Key Takeaways', 'Company Snapshot', 'People Insights', 'Sales Hypotheses', 'Customizable Notes', 'Exportable Format'].map((item, i) => (
                  <li key={i} className="flex items-center text-sm">
                    <CheckCircle size={16} className="text-primary mr-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Feature 4 */}
          <div className="flex flex-col space-y-4 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary p-3 rounded-lg">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-semibold">People Insights</h3>
            </div>
            <div className="pl-12">
              <p className="text-muted-foreground">
                Discover key stakeholders, their priorities, recent social posts, and professional background to build meaningful connections.
              </p>
            </div>
          </div>
          
          {/* Feature 5 */}
          <div className="flex flex-col space-y-4 animate-fade-in" style={{ animationDelay: '500ms' }}>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary p-3 rounded-lg">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-semibold">Sales Intelligence</h3>
            </div>
            <div className="pl-12">
              <p className="text-muted-foreground">
                Get AI-generated sales hypotheses, potential objections, and strategic talking points based on company data.
              </p>
            </div>
          </div>
          
          {/* Feature 6 */}
          <div className="flex flex-col space-y-4 animate-fade-in" style={{ animationDelay: '600ms' }}>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary p-3 rounded-lg">
                <CheckCircle size={24} />
              </div>
              <h3 className="text-xl font-semibold">Meeting-Specific</h3>
            </div>
            <div className="pl-12">
              <p className="text-muted-foreground">
                Tailored insights based on meeting type: Intro Calls, Renewals, or Competitive Deals, each with relevant focus areas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
