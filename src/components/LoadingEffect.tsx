
import { Loader2 } from 'lucide-react';

interface LoadingEffectProps {
  text?: string;
  className?: string;
}

const LoadingEffect = ({ text = 'Loading...', className = '' }: LoadingEffectProps) => {
  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <div className="relative">
        <Loader2 size={36} className="animate-spin text-primary" />
        <div className="absolute inset-0 animate-pulse-subtle blur-sm opacity-70">
          <Loader2 size={36} className="text-primary" />
        </div>
      </div>
      <p className="text-sm font-medium text-muted-foreground animate-pulse">{text}</p>
    </div>
  );
};

export default LoadingEffect;
