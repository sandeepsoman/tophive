
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
import { ArrowLeft, Download, Share2, ThumbsUp, ThumbsDown, Printer, Calendar, Mail, BarChart4, FileText } from 'lucide-react';

const BriefingResult = () => {
  const { id } = useParams<{ id: string }>();
  const [briefing, setBriefing] = useState<Briefing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadBriefing = async () => {
      if (!id) return;
      
      try {
        const data = await BriefingService.getBriefingById(id);
        setBriefing(data);
        setNotes(data.notes || '');
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

  const handleSaveNotes = () => {
    toast({
      title: "Notes saved",
      description: "Your notes have been saved successfully.",
    });
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
                  onClick={handleFeedback.bind(null, 'like')}
                  className={feedback === 'like' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800' : ''}
                >
                  <ThumbsUp size={14} className="mr-1" />
                  Helpful
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleFeedback.bind(null, 'dislike')}
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
                      <a href={briefing.company.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {briefing.company.website.replace(/^https?:\/\//, '')}
                      </a>
                    </p>
                  )}
                </TabsContent>
                
                <TabsContent value="recent-news" className="mt-0">
                  <div className="divide-y">
                    {briefing.companyOverview.recentNews.map((news, index) => (
                      <div key={index} className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{news.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {news.date}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mb-3">{news.source}</p>
                        <p>{news.summary}</p>
                        {news.url && (
                          <a 
                            href={news.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-sm inline-block mt-2"
                          >
                            Read more
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="financial" className="p-6 mt-0">
                  <div className="mb-4">
                    <h3 className="font-medium mb-2">Financial Health: {briefing.companyOverview.financialHealth.status}</h3>
                    <p>{briefing.companyOverview.financialHealth.details}</p>
                  </div>
                  
                  {briefing.companyOverview.financialHealth.metrics && (
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      {Object.entries(briefing.companyOverview.financialHealth.metrics).map(([key, value]) => (
                        <div key={key} className="bg-secondary/50 rounded-lg p-4">
                          <p className="text-muted-foreground text-sm">{key}</p>
                          <p className="text-lg font-medium">{value}</p>
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
                <h2 className="font-medium text-primary">Key Contacts & Decision-Makers</h2>
              </div>
              <CardContent className="divide-y">
                {briefing.keyContacts.map((contact, index) => (
                  <div key={index} className="py-4 first:pt-6 last:pb-6">
                    <div className="flex items-start space-x-4">
                      {contact.photo ? (
                        <img 
                          src={contact.photo} 
                          alt={contact.name} 
                          className="w-12 h-12 rounded-full object-cover border"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-base font-medium">
                          {contact.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{contact.name}</h3>
                            <p className="text-muted-foreground text-sm">{contact.title}</p>
                          </div>
                          {contact.linkedin && (
                            <a 
                              href={contact.linkedin} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              <svg viewBox="0 0 24 24" width="16" height="16" className="fill-current">
                                <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                              </svg>
                            </a>
                          )}
                        </div>

                        {contact.recentActivity && contact.recentActivity.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Recent Activity</p>
                            <ul className="text-sm space-y-1">
                              {contact.recentActivity.map((activity, idx) => (
                                <li key={idx} className="flex items-start">
                                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2"></span>
                                  {activity}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Meeting-Specific Insights */}
            <Card className="bg-background overflow-hidden print:shadow-none">
              <div className="bg-primary/10 px-6 py-3 border-b">
                <h2 className="font-medium text-primary">Meeting-Specific Insights</h2>
              </div>
              <CardContent className="p-6">
                {briefing.insights.map((insight, index) => (
                  <div key={index} className={index > 0 ? 'mt-6 pt-6 border-t' : ''}>
                    <h3 className="font-medium mb-2">{insight.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{insight.description}</p>
                    <ul className="space-y-2">
                      {insight.items.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Sales Hypotheses */}
            <Card className="bg-background overflow-hidden print:shadow-none">
              <div className="bg-primary/10 px-6 py-3 border-b">
                <h2 className="font-medium text-primary">AI-Generated Sales Hypotheses</h2>
              </div>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {briefing.salesHypotheses.map((hypothesis, index) => (
                    <li key={index} className="flex items-start p-3 bg-secondary/30 rounded-lg">
                      <span className="inline-flex items-center justify-center bg-primary/10 text-primary rounded-full w-5 h-5 text-xs font-medium mr-2 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span>{hypothesis}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Competitor Analysis (if available) */}
            {briefing.competitorAnalysis && (
              <Card className="bg-background overflow-hidden print:shadow-none">
                <div className="bg-primary/10 px-6 py-3 border-b">
                  <h2 className="font-medium text-primary">Competitor Analysis</h2>
                </div>
                <CardContent className="p-6">
                  <p className="mb-6">{briefing.competitorAnalysis.comparison}</p>
                  
                  {briefing.competitorAnalysis.competitors.map((competitor, index) => (
                    <div 
                      key={index} 
                      className={`p-4 border rounded-lg ${index > 0 ? 'mt-4' : ''}`}
                    >
                      <h3 className="font-medium mb-3">{competitor.name}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-green-50 dark:bg-green-950 p-3 rounded-md border border-green-100 dark:border-green-900">
                          <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-1">
                            Strength
                          </p>
                          <p className="text-sm">{competitor.strength}</p>
                        </div>
                        <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded-md border border-amber-100 dark:border-amber-900">
                          <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-1">
                            Weakness
                          </p>
                          <p className="text-sm">{competitor.weakness}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Talking Points */}
            <Card className="bg-background overflow-hidden print:shadow-none">
              <div className="bg-primary/10 px-6 py-3 border-b">
                <h2 className="font-medium text-primary">Suggested Talking Points</h2>
              </div>
              <CardContent className="p-6">
                <ul className="space-y-2">
                  {briefing.talkingPoints.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2"></span>
                      <span className="text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-background overflow-hidden print:hidden">
              <div className="bg-secondary/50 px-6 py-3 border-b">
                <h2 className="font-medium">Quick Actions</h2>
              </div>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="flex flex-col items-center justify-center h-20"
                    onClick={() => {
                      toast({
                        title: "Calendar integration",
                        description: "Adding to calendar is not available in this demo.",
                      });
                    }}
                  >
                    <Calendar size={20} className="mb-1 text-primary" />
                    <span className="text-xs">Add to Calendar</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex flex-col items-center justify-center h-20"
                    onClick={() => {
                      toast({
                        title: "Email integration",
                        description: "Email functionality is not available in this demo.",
                      });
                    }}
                  >
                    <Mail size={20} className="mb-1 text-primary" />
                    <span className="text-xs">Send via Email</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex flex-col items-center justify-center h-20"
                    onClick={() => {
                      navigate('/dashboard');
                    }}
                  >
                    <BarChart4 size={20} className="mb-1 text-primary" />
                    <span className="text-xs">View Dashboard</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex flex-col items-center justify-center h-20"
                    onClick={() => {
                      navigate('/new-briefing');
                    }}
                  >
                    <FileText size={20} className="mb-1 text-primary" />
                    <span className="text-xs">New Briefing</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notes Section */}
            <Card className="bg-background overflow-hidden print:shadow-none">
              <div className="bg-secondary/50 px-6 py-3 border-b">
                <h2 className="font-medium">Your Notes</h2>
              </div>
              <CardContent className="p-6">
                <Textarea 
                  placeholder="Add your personal notes about this meeting..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[150px] focus-within-ring"
                />
                <Button 
                  onClick={handleSaveNotes}
                  className="mt-4 w-full"
                >
                  Save Notes
                </Button>
              </CardContent>
            </Card>

            {/* Feedback (mobile only) */}
            <Card className="bg-background overflow-hidden md:hidden print:hidden">
              <div className="bg-secondary/50 px-6 py-3 border-b">
                <h2 className="font-medium">Provide Feedback</h2>
              </div>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Was this briefing helpful? Your feedback helps us improve.
                </p>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => handleFeedback('like')}
                    className={`flex-1 ${feedback === 'like' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800' : ''}`}
                  >
                    <ThumbsUp size={14} className="mr-1" />
                    Helpful
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleFeedback('dislike')}
                    className={`flex-1 ${feedback === 'dislike' ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-800' : ''}`}
                  >
                    <ThumbsDown size={14} className="mr-1" />
                    Not Helpful
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BriefingResult;
