
import LoadingEffect from '@/components/LoadingEffect';

interface BriefingGenerationProgressProps {
  progress: number;
}

const BriefingGenerationProgress = ({ progress }: BriefingGenerationProgressProps) => {
  const getProgressMessage = () => {
    if (progress < 30) {
      return "Gathering company information...";
    } else if (progress < 60) {
      return "Analyzing recent news and trends...";
    } else if (progress < 85) {
      return "Identifying key contacts and insights...";
    } else {
      return "Finalizing your briefing...";
    }
  };

  return (
    <div className="py-12 flex flex-col items-center justify-center">
      <LoadingEffect text="Generating your sales briefing..." className="mb-6" />
      
      <div className="w-full max-w-md bg-secondary rounded-full h-4 mb-4 overflow-hidden">
        <div 
          className="bg-primary h-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="text-sm text-muted-foreground mb-8">
        {getProgressMessage()}
      </div>
      
      <p className="text-sm text-center text-muted-foreground max-w-md">
        Our AI is researching and analyzing data about the company to create a comprehensive sales briefing.
      </p>
    </div>
  );
};

export default BriefingGenerationProgress;
