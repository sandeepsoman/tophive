
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles, Clock, BarChart } from 'lucide-react';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Delay animation to allow page to load
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute top-1/3 right-0 w-[600px] h-[600px] rounded-full bg-blue-400/5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-3xl"></div>
      </div>

      <div className="container px-6 mx-auto max-w-6xl">
        <div className="text-center space-y-8 max-w-3xl mx-auto">
          <div 
            className={`inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Sparkles size={14} className="mr-1.5" />
            <span>AI-Powered Sales Intelligence</span>
          </div>
          
          <h1 
            className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Generate Perfect Sales Briefings in Seconds
          </h1>
          
          <p 
            className={`text-lg text-foreground/80 max-w-2xl mx-auto transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Never walk into a meeting unprepared again. Our AI generates comprehensive sales briefings with minimal input, giving you the edge in every conversation.
          </p>
          
          <div 
            className={`flex flex-col sm:flex-row justify-center items-center gap-4 pt-4 transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Link to="/signup">
              <Button size="lg" className="rounded-full px-6 shadow-md hover:shadow-lg transition-all w-full sm:w-auto">
                Get Started
                <ChevronRight size={16} className="ml-1" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="rounded-full px-6 transition-all w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
        
        <div 
          className={`mt-16 md:mt-20 max-w-5xl mx-auto transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="relative rounded-xl overflow-hidden shadow-2xl thin-ring">
            <img 
              src="/lovable-uploads/56495fc0-d074-44d7-abdb-9200cf265650.png" 
              alt="TopHive Dashboard" 
              className="w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
          </div>
        </div>
        
        {/* Stats */}
        <div 
          className={`mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-700 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="flex flex-col items-center text-center p-6 rounded-xl glass-morphism">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Sparkles size={20} />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
            <p className="text-muted-foreground">Advanced AI fetches and structures insights without manual research</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 rounded-xl glass-morphism">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Clock size={20} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Time Saving</h3>
            <p className="text-muted-foreground">Reduce research time from hours to minutes with automated briefings</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 rounded-xl glass-morphism">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
              <BarChart size={20} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Better Results</h3>
            <p className="text-muted-foreground">Close more deals with comprehensive, data-driven meeting preparation</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
