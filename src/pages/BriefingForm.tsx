
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import CompanyLookup, { Company } from "@/components/CompanyLookup";
import LoadingEffect from '@/components/LoadingEffect';
import { BriefingService } from '@/utils/briefingService';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";

// Define the interface for Contact to avoid naming conflicts
interface ContactPerson {
  id: string;
  name: string;
  title: string;
}

const BriefingForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [meetingType, setMeetingType] = useState<'Intro Call' | 'Renewal' | 'Competitive Deal'>('Intro Call');
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [formStep, setFormStep] = useState<'company' | 'details'>('company');

  // Mock company contacts
  const contacts: ContactPerson[] = [
    { id: '1', name: 'Jane Smith', title: 'Chief Technology Officer' },
    { id: '2', name: 'John Rogers', title: 'VP of Data Engineering' },
    { id: '3', name: 'Sarah Chen', title: 'Chief Financial Officer' },
  ];

  const focusOptions = [
    { id: 'competitor-moves', label: 'Competitor Moves' },
    { id: 'industry-trends', label: 'Industry Trends' },
    { id: 'financial-health', label: 'Financial Health' },
    { id: 'leadership-changes', label: 'Leadership Changes' },
    { id: 'technology-stack', label: 'Technology Stack' },
  ];

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
    if (company.id) {
      setFormStep('details');
    }
  };

  const handleFocusChange = (checked: boolean, value: string) => {
    if (checked) {
      setFocusAreas([...focusAreas, value]);
    } else {
      setFocusAreas(focusAreas.filter(area => area !== value));
    }
  };

  const handleGenerate = async () => {
    if (!selectedCompany || !selectedCompany.id || !user) {
      toast({
        title: "Company required",
        description: "Please select a company to generate a briefing.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        return newProgress >= 100 ? 99 : newProgress;
      });
    }, 800);
    
    try {
      // Save briefing request to Supabase
      const { data: requestData, error: requestError } = await supabase
        .from('briefing_requests')
        .insert({
          user_id: user.id,
          company_id: selectedCompany.id,
          company_name: selectedCompany.name,
          company_logo: selectedCompany.logo,
          meeting_type: meetingType,
          contact_id: selectedContact,
          focus_areas: focusAreas.length > 0 ? focusAreas : null,
          status: 'generating'
        })
        .select('id')
        .single();
        
      if (requestError) throw requestError;
      
      // For now, still using mock service to generate the briefing
      const selectedContactObj = selectedContact ? 
        contacts.find(c => c.id === selectedContact) as unknown as any : 
        undefined;

      const briefing = await BriefingService.generateBriefing(
        selectedCompany,
        meetingType,
        selectedContactObj,
        focusAreas.length > 0 ? focusAreas : undefined
      );
      
      // Save the generated briefing to Supabase
      if (requestData?.id) {
        const { error: briefingError } = await supabase
          .from('briefings')
          .insert({
            request_id: requestData.id,
            title: briefing.title,
            summary: briefing.summary,
            company_overview: briefing.companyOverview,
            key_contacts: briefing.keyContacts,
            insights: briefing.insights,
            sales_hypotheses: briefing.salesHypotheses,
            competitor_analysis: briefing.competitorAnalysis,
            talking_points: briefing.talkingPoints,
            status: 'completed'
          });
          
        if (briefingError) throw briefingError;
      }
      
      clearInterval(progressInterval);
      setGenerationProgress(100);
      
      toast({
        title: "Briefing generated successfully",
        description: "Your sales briefing is ready to view.",
      });
      
      // Wait a moment before redirecting to show 100% progress
      setTimeout(() => {
        navigate('/briefing/1'); // In a real app, this would be the actual briefing ID
      }, 500);
      
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Error generating briefing:', error);
      
      toast({
        title: "Failed to generate briefing",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="bg-background border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-4"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft size={16} className="mr-1" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Create New Briefing</h1>
              <p className="text-muted-foreground mt-1">Enter the details to generate a sales briefing</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-background shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              {isGenerating ? (
                <div className="py-12 flex flex-col items-center justify-center">
                  <LoadingEffect text="Generating your sales briefing..." className="mb-6" />
                  
                  <div className="w-full max-w-md bg-secondary rounded-full h-4 mb-4 overflow-hidden">
                    <div 
                      className="bg-primary h-full transition-all duration-500 ease-out"
                      style={{ width: `${generationProgress}%` }}
                    ></div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mb-8">
                    {generationProgress < 30 ? (
                      "Gathering company information..."
                    ) : generationProgress < 60 ? (
                      "Analyzing recent news and trends..."
                    ) : generationProgress < 85 ? (
                      "Identifying key contacts and insights..."
                    ) : (
                      "Finalizing your briefing..."
                    )}
                  </div>
                  
                  <p className="text-sm text-center text-muted-foreground max-w-md">
                    Our AI is researching and analyzing data about the company to create a comprehensive sales briefing.
                  </p>
                </div>
              ) : (
                <form className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-base">
                      Company Name <span className="text-destructive">*</span>
                    </Label>
                    <CompanyLookup onSelect={handleCompanySelect} selectedCompany={selectedCompany} />
                  </div>
                  
                  {formStep === 'details' && selectedCompany && selectedCompany.id && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="space-y-3">
                        <Label className="text-base">
                          Meeting Type <span className="text-destructive">*</span>
                        </Label>
                        <RadioGroup 
                          defaultValue="Intro Call" 
                          value={meetingType}
                          onValueChange={(value) => setMeetingType(value as 'Intro Call' | 'Renewal' | 'Competitive Deal')}
                          className="grid grid-cols-1 md:grid-cols-3 gap-3"
                        >
                          <Label 
                            htmlFor="intro-call"
                            className={`flex flex-col items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-secondary/50 transition-colors ${meetingType === 'Intro Call' ? 'bg-primary/5 border-primary' : 'bg-background'}`}
                          >
                            <RadioGroupItem value="Intro Call" id="intro-call" className="sr-only" />
                            <span className="text-sm font-medium">Intro Call</span>
                          </Label>
                          <Label 
                            htmlFor="renewal"
                            className={`flex flex-col items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-secondary/50 transition-colors ${meetingType === 'Renewal' ? 'bg-primary/5 border-primary' : 'bg-background'}`}
                          >
                            <RadioGroupItem value="Renewal" id="renewal" className="sr-only" />
                            <span className="text-sm font-medium">Renewal</span>
                          </Label>
                          <Label 
                            htmlFor="competitive-deal"
                            className={`flex flex-col items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-secondary/50 transition-colors ${meetingType === 'Competitive Deal' ? 'bg-primary/5 border-primary' : 'bg-background'}`}
                          >
                            <RadioGroupItem value="Competitive Deal" id="competitive-deal" className="sr-only" />
                            <span className="text-sm font-medium">Competitive Deal</span>
                          </Label>
                        </RadioGroup>
                      </div>
                      
                      <div className="space-y-3">
                        <Label className="text-base">Primary Contact (Optional)</Label>
                        <RadioGroup 
                          value={selectedContact || ''}
                          onValueChange={setSelectedContact}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {contacts.map((contact) => (
                              <Label 
                                key={contact.id}
                                htmlFor={`contact-${contact.id}`}
                                className={`flex items-start space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-secondary/50 transition-colors ${selectedContact === contact.id ? 'bg-primary/5 border-primary' : 'bg-background'}`}
                              >
                                <RadioGroupItem value={contact.id} id={`contact-${contact.id}`} className="mt-1" />
                                <div className="space-y-1">
                                  <span className="text-sm font-medium">{contact.name}</span>
                                  <p className="text-xs text-muted-foreground">{contact.title}</p>
                                </div>
                              </Label>
                            ))}
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <div className="space-y-3">
                        <Label className="text-base">Custom Focus Areas (Optional)</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {focusOptions.map((option) => (
                            <Label 
                              key={option.id}
                              htmlFor={option.id}
                              className={`flex items-start space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-secondary/50 transition-colors ${focusAreas.includes(option.label) ? 'bg-primary/5 border-primary' : 'bg-background'}`}
                            >
                              <Checkbox 
                                id={option.id} 
                                checked={focusAreas.includes(option.label)}
                                onCheckedChange={(checked) => 
                                  handleFocusChange(checked as boolean, option.label)
                                }
                                className="mt-1"
                              />
                              <span className="text-sm font-medium">{option.label}</span>
                            </Label>
                          ))}
                        </div>
                      </div>
                      
                      <Button
                        onClick={handleGenerate}
                        disabled={!selectedCompany || !selectedCompany.id}
                        className="w-full"
                        type="button"
                      >
                        <Sparkles size={16} className="mr-2" />
                        Generate Briefing
                      </Button>
                    </div>
                  )}
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default BriefingForm;
