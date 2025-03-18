
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Share2, ThumbsUp, ThumbsDown, Clock } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface BriefingCardProps {
  briefing: {
    id: string;
    title: string;
    companyName: string;
    companyLogo?: string;
    meetingType: string;
    createdAt: Date;
    status: 'completed' | 'generating' | 'failed';
  };
  onView?: (id: string) => void;
}

const BriefingCard = ({ briefing, onView }: BriefingCardProps) => {
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null);
  const { toast } = useToast();
  
  const handleDownload = () => {
    toast({
      title: "Briefing downloaded",
      description: `${briefing.title} has been downloaded successfully.`,
    });
  };
  
  const handleShare = () => {
    toast({
      title: "Share link copied",
      description: "Link has been copied to clipboard.",
    });
  };
  
  const handleFeedback = (type: 'like' | 'dislike') => {
    setFeedback(type);
    toast({
      title: type === 'like' ? 'Feedback: Helpful' : 'Feedback: Not helpful',
      description: "Thank you for your feedback!",
    });
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  return (
    <Card className="h-full card-elevation hover-lift overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            {briefing.companyLogo ? (
              <img 
                src={briefing.companyLogo} 
                alt={briefing.companyName}
                className="h-8 w-8 rounded-md object-contain bg-white p-1 border"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/32?text=' + briefing.companyName.charAt(0);
                }}
              />
            ) : (
              <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                {briefing.companyName.charAt(0)}
              </div>
            )}
            <div>
              <CardTitle className="text-base">{briefing.title}</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                {briefing.companyName}
              </CardDescription>
            </div>
          </div>
          <Badge variant={
            briefing.status === 'completed' ? 'default' : 
            briefing.status === 'generating' ? 'outline' :
            'destructive'
          }>
            {briefing.status === 'completed' ? 'Complete' : 
             briefing.status === 'generating' ? 'Generating' : 
             'Failed'}
          </Badge>
        </div>
        
        <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
          <Badge variant="secondary" className="text-xs font-normal">
            {briefing.meetingType}
          </Badge>
          <div className="flex items-center">
            <Clock size={12} className="mr-1" />
            <span>{formatDate(briefing.createdAt)}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        <div className="text-sm space-y-1">
          <p>Key details about {briefing.companyName} for your {briefing.meetingType.toLowerCase()} meeting...</p>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-3 flex justify-between">
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleFeedback('like')}
            className={`px-2 button-press ${feedback === 'like' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : ''}`}
          >
            <ThumbsUp size={14} className="mr-1" />
            <span className="sr-only md:not-sr-only md:text-xs">Helpful</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleFeedback('dislike')}
            className={`px-2 button-press ${feedback === 'dislike' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' : ''}`}
          >
            <ThumbsDown size={14} className="mr-1" />
            <span className="sr-only md:not-sr-only md:text-xs">Not helpful</span>
          </Button>
        </div>
        
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleShare}
            className="px-2 button-press"
            disabled={briefing.status !== 'completed'}
          >
            <Share2 size={14} className="mr-1" />
            <span className="sr-only md:not-sr-only md:text-xs">Share</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDownload}
            className="px-2 button-press"
            disabled={briefing.status !== 'completed'}
          >
            <Download size={14} className="mr-1" />
            <span className="sr-only md:not-sr-only md:text-xs">Download</span>
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={() => onView && onView(briefing.id)}
            className="px-2 ml-1 button-press"
            disabled={briefing.status !== 'completed'}
          >
            View
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BriefingCard;
