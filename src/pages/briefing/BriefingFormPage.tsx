
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import CompanySelectionStep from './steps/CompanySelectionStep';
import MeetingDetailsStep from './steps/MeetingDetailsStep';
import { Company } from "@/components/CompanyLookup";
import { BriefingService } from '@/utils/briefingService';
import BriefingGenerationProgress from './components/BriefingGenerationProgress';

export type FormStep = 'company' | 'details';
export type MeetingType = 'Intro Call' | 'Renewal' | 'Competitive Deal';
export type ContactPerson = {
  id: string;
  name: string;
  title: string;
};

const BriefingFormPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [meetingType, setMeetingType] = useState<MeetingType>('Intro Call');
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [formStep, setFormStep] = useState<FormStep>('company');

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
      const contacts = getContacts();
      const selectedContactObj = selectedContact ? 
        contacts.find(c => c.id === selectedContact) : 
        undefined;

      const briefing = await BriefingService.generateBriefing(
        selectedCompany,
        meetingType,
        selectedContactObj as any,
        focusAreas.length > 0 ? focusAreas : undefined
      );
      
      // Save the generated briefing to Supabase
      let briefingId = null;
      if (requestData?.id) {
        // Convert contacts to a compatible JSON format
        const keyContactsJson = briefing.keyContacts.map(contact => ({
          id: contact.id,
          name: contact.name,
          title: contact.title,
          company: contact.company,
          linkedin: contact.linkedin || null,
          recentActivity: contact.recentActivity || null
        }));

        const { data: briefingData, error: briefingError } = await supabase
          .from('briefings')
          .insert({
            request_id: requestData.id,
            title: briefing.title,
            summary: briefing.summary,
            company_overview: briefing.companyOverview,
            key_contacts: keyContactsJson,
            insights: briefing.insights,
            sales_hypotheses: briefing.salesHypotheses,
            competitor_analysis: briefing.competitorAnalysis,
            talking_points: briefing.talkingPoints,
            status: 'completed'
          })
          .select('id')
          .single();
          
        if (briefingError) throw briefingError;
        
        briefingId = briefingData?.id;
      }
      
      clearInterval(progressInterval);
      setGenerationProgress(100);
      
      toast({
        title: "Briefing generated successfully",
        description: "Your sales briefing is ready to view.",
      });
      
      // Wait a moment before redirecting to show 100% progress
      setTimeout(() => {
        if (briefingId) {
          navigate(`/briefing/${briefingId}`);
        } else {
          navigate('/dashboard');
        }
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

  // Helper function to get contacts
  const getContacts = (): ContactPerson[] => {
    return [
      { id: '1', name: 'Jane Smith', title: 'Chief Technology Officer' },
      { id: '2', name: 'John Rogers', title: 'VP of Data Engineering' },
      { id: '3', name: 'Sarah Chen', title: 'Chief Financial Officer' },
    ];
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
                <BriefingGenerationProgress progress={generationProgress} />
              ) : (
                <form className="space-y-6">
                  <CompanySelectionStep 
                    onSelect={handleCompanySelect} 
                    selectedCompany={selectedCompany} 
                  />
                  
                  {formStep === 'details' && selectedCompany && selectedCompany.id && (
                    <MeetingDetailsStep
                      meetingType={meetingType}
                      setMeetingType={setMeetingType}
                      selectedContact={selectedContact}
                      setSelectedContact={setSelectedContact}
                      focusAreas={focusAreas}
                      handleFocusChange={handleFocusChange}
                      handleGenerate={handleGenerate}
                      contacts={getContacts()}
                    />
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

export default BriefingFormPage;
