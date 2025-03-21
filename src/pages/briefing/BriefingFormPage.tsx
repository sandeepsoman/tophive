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
  const [error, setError] = useState<string | null>(null);

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
    setError(null);
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        return newProgress >= 100 ? 99 : newProgress;
      });
    }, 800);
    
    try {
      console.log('Creating briefing request with user ID:', user.id);
      
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
        
      if (requestError) {
        console.error('Error creating briefing request:', requestError);
        throw new Error(`Failed to create briefing request: ${requestError.message}`);
      }
      
      if (!requestData?.id) {
        throw new Error('No request ID returned from database');
      }
      
      console.log('Briefing request created with ID:', requestData.id);
      
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
      
      // Convert complex objects to proper JSON
      const keyContactsJson = briefing.keyContacts.map(contact => ({
        id: contact.id,
        name: contact.name,
        title: contact.title,
        company: contact.company,
        linkedin: contact.linkedin || null,
        recentActivity: contact.recentActivity || null
      }));

      const insightsJson = briefing.insights.map(insight => ({
        title: insight.title,
        description: insight.description,
        items: insight.items
      }));
      
      const companyOverviewJson = {
        description: briefing.companyOverview.description,
        recentNews: briefing.companyOverview.recentNews,
        financialHealth: {
          status: briefing.companyOverview.financialHealth.status,
          details: briefing.companyOverview.financialHealth.details,
          metrics: briefing.companyOverview.financialHealth.metrics || null
        }
      };
      
      const competitorAnalysisJson = briefing.competitorAnalysis ? {
        competitors: briefing.competitorAnalysis.competitors,
        comparison: briefing.competitorAnalysis.comparison
      } : null;

      console.log('Inserting briefing with request ID:', requestData.id);
      
      // Debug the authentication before insertion
      const { data: sessionData } = await supabase.auth.getSession();
      console.log('Current session exists:', !!sessionData.session);
      console.log('Current user ID:', sessionData.session?.user?.id);
      
      try {
        // Save the generated briefing to Supabase
        const { data: briefingData, error: briefingError } = await supabase
          .from('briefings')
          .insert({
            request_id: requestData.id,
            title: briefing.title,
            summary: briefing.summary,
            company_overview: companyOverviewJson,
            key_contacts: keyContactsJson,
            insights: insightsJson,
            sales_hypotheses: briefing.salesHypotheses,
            competitor_analysis: competitorAnalysisJson,
            talking_points: briefing.talkingPoints,
            status: 'completed'
          })
          .select('id')
          .single();
            
        if (briefingError) {
          console.error('Error saving briefing:', briefingError);
          throw new Error(`Failed to save briefing: ${briefingError.message}`);
        }
        
        // Update request status
        const { error: updateError } = await supabase
          .from('briefing_requests')
          .update({ status: 'completed' })
          .eq('id', requestData.id);
          
        if (updateError) {
          console.error('Error updating request status:', updateError);
          // Non-fatal error, continue
        }
        
        clearInterval(progressInterval);
        setGenerationProgress(100);
        
        toast({
          title: "Briefing generated successfully",
          description: "Your sales briefing is ready to view.",
        });
        
        // Wait a moment before redirecting to show 100% progress
        setTimeout(() => {
          if (briefingData?.id) {
            console.log('Redirecting to briefing page:', briefingData.id);
            navigate(`/briefing/${briefingData.id}`);
          } else {
            setError("Briefing was created but ID was not returned. Please check your dashboard.");
            setIsGenerating(false);
          }
        }, 500);
      } catch (briefingError: any) {
        console.error('Error saving briefing details:', briefingError);
        
        // Fallback: Try to save briefing without explicitly requesting ID
        const { error: fallbackError } = await supabase
          .from('briefings')
          .insert({
            request_id: requestData.id,
            title: briefing.title,
            summary: briefing.summary,
            company_overview: companyOverviewJson,
            key_contacts: keyContactsJson,
            insights: insightsJson,
            sales_hypotheses: briefing.salesHypotheses,
            competitor_analysis: competitorAnalysisJson,
            talking_points: briefing.talkingPoints,
            status: 'completed'
          });
        
        if (fallbackError) {
          console.error('Fallback briefing save also failed:', fallbackError);
          throw new Error(`All attempts to save briefing failed: ${fallbackError.message}`);
        }
        
        console.log('Briefing saved without ID return. Redirecting to dashboard');
        clearInterval(progressInterval);
        setGenerationProgress(100);
        
        toast({
          title: "Briefing generated",
          description: "Your briefing has been saved. Redirecting to dashboard.",
        });
        
        // Redirect to dashboard since we don't have an ID
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      }
      
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Error generating briefing:', error);
      
      setError("Failed to generate briefing. Please try again.");
      
      toast({
        title: "Failed to generate briefing",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
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
                  {error && (
                    <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4">
                      {error}
                    </div>
                  )}
                  
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
