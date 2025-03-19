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
                    </p>
                  )}
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BriefingResult;
