import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import LoadingEffect from '@/components/LoadingEffect';
import { BriefingService, Briefing, Contact } from '@/utils/briefingService';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Download, Share2, ThumbsUp, ThumbsDown, Printer, Calendar, Mail, BarChart4, FileText } from 'lucide-react';
import type { Json } from '@/integrations/supabase/types';

function safeParseJson<T>(data: unknown, fallback: T): T {
  if (data === null || data === undefined) {
    return fallback;
  }
  
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as T;
    } catch (e) {
      console.error('Error parsing JSON:', e);
      return fallback;
    }
  }
  
  return data as T;
}

const BriefingResult = () => {
  const { id } = useParams<{ id: string }>();
  const [briefing, setBriefing] = useState<Briefing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const loadBriefing = async () => {
      if (!id) {
        setError("No briefing ID provided");
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('briefings')
          .select('*, briefing_requests(*)')
          .eq('id', id)
          .maybeSingle();
          
        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        
        if (data) {
          console.log('Loaded briefing from Supabase:', data);
          
          const parsedSummary = Array.isArray(data.summary) ? data.summary : [];
          const parsedTalkingPoints = Array.isArray(data.talking_points) ? data.talking_points : [];
          const parsedSalesHypotheses = Array.isArray(data.sales_hypotheses) ? data.sales_hypotheses : [];
          
          const defaultCompanyOverview = {
            description: '', 
            recentNews: [],
            financialHealth: { 
              status: '', 
              details: '',
              metrics: undefined
            }
          };
          
          const companyOverview = safeParseJson(data.company_overview, defaultCompanyOverview);
          
          if (!companyOverview.description) companyOverview.description = '';
          if (!companyOverview.recentNews) companyOverview.recentNews = [];
          if (!companyOverview.financialHealth) {
            companyOverview.financialHealth = { status: '', details: '' };
          }
          
          const defaultKeyContacts: Contact[] = [];
          const keyContacts = Array.isArray(data.key_contacts) 
            ? data.key_contacts.map((contact: Json) => {
                if (typeof contact === 'object' && contact !== null) {
                  return {
                    id: String(contact.id || ''),
                    name: String(contact.name || ''),
                    title: String(contact.title || ''),
                    company: String(contact.company || ''),
                    photo: contact.photo as string | undefined,
                    linkedin: contact.linkedin as string | undefined,
                    recentActivity: Array.isArray(contact.recentActivity) 
                      ? contact.recentActivity.map(item => String(item))
                      : undefined
                  };
                }
                return null;
              }).filter((c): c is Contact => c !== null)
            : defaultKeyContacts;
            
          const defaultInsights = [];
          const insights = Array.isArray(data.insights)
            ? data.insights.map((insight: Json) => {
                if (typeof insight === 'object' && insight !== null) {
                  return {
                    title: String(insight.title || ''),
                    description: String(insight.description || ''),
                    items: Array.isArray(insight.items) 
                      ? insight.items.map(item => String(item)) 
                      : []
                  };
                }
                return null;
              }).filter((i) => i !== null)
            : defaultInsights;
          
          let competitorAnalysis;
          if (data.competitor_analysis) {
            const defaultCompetitorAnalysis = {
              competitors: [],
              comparison: ''
            };
            
            competitorAnalysis = safeParseJson(data.competitor_analysis, defaultCompetitorAnalysis);
            
            if (!competitorAnalysis.competitors) competitorAnalysis.competitors = [];
            if (!competitorAnalysis.comparison) competitorAnalysis.comparison = '';
          }
          
          const mappedBriefing: Briefing = {
            id: data.id,
            title: data.title,
            company: {
              id: data.briefing_requests?.company_id || '',
              name: data.briefing_requests?.company_name || '',
              logo: data.briefing_requests?.company_logo || undefined,
              industry: 'Technology',
              location: 'Unknown'
            },
            meetingType: (data.briefing_requests?.meeting_type as any) || 'Intro Call',
            summary: parsedSummary,
            companyOverview: companyOverview,
            keyContacts: keyContacts,
            insights: insights,
            salesHypotheses: parsedSalesHypotheses,
            competitorAnalysis: competitorAnalysis,
            talkingPoints: parsedTalkingPoints,
            createdAt: new Date(data.created_at),
            status: (data.status as any) || 'completed',
            notes: data.notes || '',
          };
          
          setBriefing(mappedBriefing);
          setNotes(data.notes || '');
        } else {
          console.log('Briefing not found in Supabase, using mock service');
          try {
            const mockData = await BriefingService.getBriefingById(id);
            setBriefing(mockData);
            setNotes(mockData.notes || '');
          } catch (mockError) {
            console.error('Error with mock briefing:', mockError);
            throw new Error('Briefing not found in database or mock service');
          }
        }
      } catch (error) {
        console.error('Error loading briefing:', error);
        setError('The requested briefing could not be found.');
        toast({
          title: "Error loading briefing",
          description: "The requested briefing could not be found.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadBriefing();
  }, [id, toast]);

  const handleDownload = () => {
    toast({
      title: "Briefing downloaded",
      description: "Your briefing has been downloaded as a PDF.",
    });
  };

  const handleShare = () => {
    toast({
      title: "Share link copied",
      description: "A link to this briefing has been copied to your clipboard.",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveNotes = async () => {
    if (!briefing) return;
    
    setIsSaving(true);
    
    try {
      if (user && id) {
        const { error } = await supabase
          .from('briefings')
          .update({ notes })
          .eq('id', id);
          
        if (error) throw error;
      }
      
      const updatedBriefing = { ...briefing, notes };
      setBriefing(updatedBriefing);
      
      toast({
        title: "Notes saved",
        description: "Your notes have been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving notes:', error);
      toast({
        title: "Error saving notes",
        description: "There was a problem saving your notes.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFeedback = (type: 'like' | 'dislike') => {
    setFeedback(type);
    toast({
      title: type === 'like' ? 'Feedback: Helpful' : 'Feedback: Not helpful',
      description: "Thank you for your feedback!",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary/30 flex items-center justify-center">
        <LoadingEffect text="Loading your briefing..." />
      </div>
    );
  }

  if (error || !briefing) {
    return (
      <div className="min-h-screen bg-secondary/30 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Briefing Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || "The requested briefing could not be found."}</p>
          <Button onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30 pb-16">
      <header className="bg-background border-b print:hidden">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
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
                <h1 className="text-2xl font-bold">{briefing.title}</h1>
                <div className="flex items-center mt-1">
                  <span className="text-muted-foreground">
                    {new Date(briefing.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  <Badge className="ml-2">{briefing.meetingType}</Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="hidden md:flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleFeedback('like')}
                  className={feedback === 'like' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800' : ''}
                >
                  <ThumbsUp size={14} className="mr-1" />
                  Helpful
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleFeedback('dislike')}
                  className={feedback === 'dislike' ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-800' : ''}
                >
                  <ThumbsDown size={14} className="mr-1" />
                  Not Helpful
                </Button>
                <Separator orientation="vertical" className="h-6" />
              </div>
              
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer size={14} className="mr-1" />
                <span className="hidden md:inline">Print</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 size={14} className="mr-1" />
                <span className="hidden md:inline">Share</span>
              </Button>
              <Button size="sm" onClick={handleDownload}>
                <Download size={14} className="mr-1" />
                <span className="hidden md:inline">Download</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-background overflow-hidden print:shadow-none">
              <div className="bg-primary/10 px-6 py-3 border-b">
                <h2 className="font-medium text-primary">Key Takeaways</h2>
              </div>
              <CardContent className="p-6">
                <ul className="space-y-2">
                  {briefing.summary.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-flex items-center justify-center bg-primary/10 text-primary rounded-full w-5 h-5 text-xs font-medium mr-2 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-background overflow-hidden print:shadow-none">
              <Tabs defaultValue="overview">
                <div className="bg-secondary/50 border-b px-6 py-2">
                  <TabsList className="bg-transparent">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-background">Overview</TabsTrigger>
                    <TabsTrigger value="recent-news" className="data-[state=active]:bg-background">Recent News</TabsTrigger>
                    <TabsTrigger value="financial" className="data-[state=active]:bg-background">Financial</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="overview" className="p-6 mt-0">
                  <div className="flex items-start space-x-4 mb-6">
                    {briefing.company.logo ? (
                      <img 
                        src={briefing.company.logo} 
                        alt={briefing.company.name} 
                        className="w-16 h-16 rounded-md object-contain bg-white p-2 border"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-md bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">
                        {briefing.company.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold">{briefing.company.name}</h3>
                      <p className="text-muted-foreground">{briefing.company.industry}</p>
                      {briefing.company.location && (
                        <p className="text-sm">{briefing.company.location}</p>
                      )}
                    </div>
                  </div>
                  <p className="mb-4">{briefing.companyOverview.description}</p>
                  {briefing.company.website && (
                    <p className="text-sm">
                      <span className="text-muted-foreground">Website:</span>{" "}
                      <a 
                        href={briefing.company.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {briefing.company.website}
                      </a>
                    </p>
                  )}
                </TabsContent>
                
                <TabsContent value="recent-news" className="p-6 mt-0">
                  <div className="space-y-6">
                    {briefing.companyOverview.recentNews && briefing.companyOverview.recentNews.length > 0 ? (
                      briefing.companyOverview.recentNews.map((news, index) => (
                        <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{news.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {news.date}
                            </Badge>
                          </div>
                          <p className="text-sm mb-2">{news.summary}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <span>Source: {news.source}</span>
                            {news.url && (
                              <a 
                                href={news.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="ml-2 text-primary hover:underline"
                              >
                                Read more
                              </a>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No recent news available.</p>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="financial" className="p-6 mt-0">
                  <div className="mb-4">
                    <Badge className="mb-2" variant={
                      briefing.companyOverview.financialHealth?.status?.toLowerCase().includes('strong') ? 'default' :
                      briefing.companyOverview.financialHealth?.status?.toLowerCase().includes('stable') ? 'secondary' :
                      'outline'
                    }>
                      {briefing.companyOverview.financialHealth?.status || 'No status available'}
                    </Badge>
                    <p>{briefing.companyOverview.financialHealth?.details || 'No financial details available'}</p>
                  </div>
                  {briefing.companyOverview.financialHealth?.metrics && (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      {Object.entries(briefing.companyOverview.financialHealth.metrics).map(([key, value]) => (
                        <div key={key} className="bg-secondary/30 p-3 rounded-md">
                          <div className="text-xs text-muted-foreground">{key}</div>
                          <div className="font-medium">{value}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </Card>
            
            <Card className="bg-background overflow-hidden print:shadow-none">
              <div className="bg-primary/10 px-6 py-3 border-b">
                <h2 className="font-medium text-primary">Key Contacts</h2>
              </div>
              <CardContent className="p-6">
                {briefing.keyContacts && briefing.keyContacts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {briefing.keyContacts.map((contact) => (
                      <div key={contact.id} className="flex items-start space-x-3 border p-3 rounded-md">
                        {contact.photo ? (
                          <img 
                            src={contact.photo} 
                            alt={contact.name} 
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-medium">
                            {contact.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium">{contact.name}</h4>
                          <p className="text-sm text-muted-foreground">{contact.title}</p>
                          {contact.linkedin && (
                            <a 
                              href={contact.linkedin} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline mt-1 inline-block"
                            >
                              LinkedIn Profile
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No key contacts available.</p>
                )}
                
                {briefing.keyContacts && briefing.keyContacts.length > 0 && briefing.keyContacts[0].recentActivity && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium mb-2">Recent Activity</h3>
                    <div className="border rounded-md p-4">
                      <ul className="space-y-2">
                        {briefing.keyContacts[0].recentActivity.map((activity, index) => (
                          <li key={index} className="text-sm">
                            • {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {

