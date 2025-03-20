
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
import { BriefingService, Briefing } from '@/utils/briefingService';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Download, Share2, ThumbsUp, ThumbsDown, Printer, Calendar, Mail, BarChart4, FileText } from 'lucide-react';

const BriefingResult = () => {
  const { id } = useParams<{ id: string }>();
  const [briefing, setBriefing] = useState<Briefing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const loadBriefing = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        // Try to load from Supabase first
        const { data, error } = await supabase
          .from('briefings')
          .select('*, briefing_requests(*)')
          .eq('id', id)
          .maybeSingle();
          
        if (error) throw error;
        
        if (data) {
          console.log('Loaded briefing from Supabase:', data);
          
          // Map the Supabase briefing data to our Briefing interface
          const mappedBriefing: Briefing = {
            id: data.id,
            title: data.title,
            company: {
              id: data.briefing_requests?.company_id || '',
              name: data.briefing_requests?.company_name || '',
              logo: data.briefing_requests?.company_logo || undefined,
            },
            meetingType: data.briefing_requests?.meeting_type as any,
            summary: data.summary || [],
            companyOverview: data.company_overview || { 
              description: '', 
              recentNews: [],
              financialHealth: { status: '', details: '' }
            },
            keyContacts: data.key_contacts || [],
            insights: data.insights || [],
            salesHypotheses: data.sales_hypotheses || [],
            competitorAnalysis: data.competitor_analysis || undefined,
            talkingPoints: data.talking_points || [],
            createdAt: new Date(data.created_at),
            status: data.status as any,
            notes: data.notes || '',
          };
          
          setBriefing(mappedBriefing);
          setNotes(data.notes || '');
        } else {
          // Fallback to mock service if not found in Supabase
          console.log('Briefing not found in Supabase, using mock service');
          const mockData = await BriefingService.getBriefingById(id);
          setBriefing(mockData);
          setNotes(mockData.notes || '');
        }
      } catch (error) {
        console.error('Error loading briefing:', error);
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
      // Update notes in Supabase
      if (user && id) {
        const { error } = await supabase
          .from('briefings')
          .update({ notes })
          .eq('id', id);
          
        if (error) throw error;
      }
      
      // Update locally
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

  if (!briefing) {
    return (
      <div className="min-h-screen bg-secondary/30 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Briefing Not Found</h1>
          <p className="text-muted-foreground mb-6">The requested briefing could not be found.</p>
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
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Key Takeaways */}
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

            {/* Company Overview */}
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
                    {briefing.companyOverview.recentNews.map((news, index) => (
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
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="financial" className="p-6 mt-0">
                  <div className="mb-4">
                    <Badge className="mb-2" variant={
                      briefing.companyOverview.financialHealth.status.toLowerCase().includes('strong') ? 'default' :
                      briefing.companyOverview.financialHealth.status.toLowerCase().includes('stable') ? 'secondary' :
                      'outline'
                    }>
                      {briefing.companyOverview.financialHealth.status}
                    </Badge>
                    <p>{briefing.companyOverview.financialHealth.details}</p>
                  </div>
                  {briefing.companyOverview.financialHealth.metrics && (
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
            
            {/* Key Contacts */}
            <Card className="bg-background overflow-hidden print:shadow-none">
              <div className="bg-primary/10 px-6 py-3 border-b">
                <h2 className="font-medium text-primary">Key Contacts</h2>
              </div>
              <CardContent className="p-6">
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
                
                {briefing.keyContacts.length > 0 && briefing.keyContacts[0].recentActivity && (
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

            {/* Insights */}
            {briefing.insights && briefing.insights.length > 0 && (
              <Card className="bg-background overflow-hidden print:shadow-none">
                <div className="bg-primary/10 px-6 py-3 border-b">
                  <h2 className="font-medium text-primary">Business Insights</h2>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {briefing.insights.map((insight, index) => (
                      <div key={index} className={index > 0 ? "pt-4 border-t" : ""}>
                        <h3 className="font-medium mb-1">{insight.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                        <ul className="space-y-2">
                          {insight.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-start">
                              <span className="inline-flex items-center justify-center bg-secondary text-primary rounded-full w-5 h-5 text-xs font-medium mr-2 mt-0.5 flex-shrink-0">
                                •
                              </span>
                              <span className="text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sales Hypotheses */}
            {briefing.salesHypotheses && briefing.salesHypotheses.length > 0 && (
              <Card className="bg-background overflow-hidden print:shadow-none">
                <div className="bg-primary/10 px-6 py-3 border-b">
                  <h2 className="font-medium text-primary">Sales Hypotheses</h2>
                </div>
                <CardContent className="p-6">
                  <ul className="space-y-3">
                    {briefing.salesHypotheses.map((hypothesis, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-flex items-center justify-center bg-primary/10 text-primary rounded-full w-5 h-5 text-xs font-medium mr-2 mt-0.5 flex-shrink-0">
                          {index + 1}
                        </span>
                        <span>{hypothesis}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Competitor Analysis */}
            {briefing.competitorAnalysis && (
              <Card className="bg-background overflow-hidden print:shadow-none">
                <div className="bg-primary/10 px-6 py-3 border-b">
                  <h2 className="font-medium text-primary">Competitor Analysis</h2>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-3">Key Competitors</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-muted/50">
                              <th className="text-left p-2 border">Competitor</th>
                              <th className="text-left p-2 border">Strengths</th>
                              <th className="text-left p-2 border">Weaknesses</th>
                            </tr>
                          </thead>
                          <tbody>
                            {briefing.competitorAnalysis.competitors.map((competitor, index) => (
                              <tr key={index} className="border-b">
                                <td className="p-2 border">{competitor.name}</td>
                                <td className="p-2 border">{competitor.strength}</td>
                                <td className="p-2 border">{competitor.weakness}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Competitive Position</h3>
                      <p>{briefing.competitorAnalysis.comparison}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Talking Points */}
            {briefing.talkingPoints && briefing.talkingPoints.length > 0 && (
              <Card className="bg-background overflow-hidden print:shadow-none">
                <div className="bg-primary/10 px-6 py-3 border-b">
                  <h2 className="font-medium text-primary">Suggested Talking Points</h2>
                </div>
                <CardContent className="p-6">
                  <ul className="space-y-3">
                    {briefing.talkingPoints.map((point, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-flex items-center justify-center bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full w-5 h-5 text-xs font-medium mr-2 mt-0.5 flex-shrink-0">
                          Q
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6 print:hidden">
            {/* Action Buttons */}
            <Card className="bg-background">
              <CardContent className="p-4 space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <Calendar size={16} className="mr-2" />
                  Schedule Meeting
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Mail size={16} className="mr-2" />
                  Email Briefing
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BarChart4 size={16} className="mr-2" />
                  Create Presentation
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText size={16} className="mr-2" />
                  Export as Word Doc
                </Button>
              </CardContent>
            </Card>
            
            {/* Notes */}
            <Card className="bg-background">
              <div className="px-4 py-3 border-b">
                <h3 className="font-medium">Meeting Notes</h3>
              </div>
              <CardContent className="p-4">
                <Textarea 
                  placeholder="Add your personal notes here..." 
                  className="min-h-[200px] mb-4"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <Button 
                  onClick={handleSaveNotes} 
                  className="w-full"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Notes"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BriefingResult;
