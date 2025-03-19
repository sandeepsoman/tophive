
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Sparkles } from 'lucide-react';
import { MeetingType, ContactPerson } from '../BriefingFormPage';

interface MeetingDetailsStepProps {
  meetingType: MeetingType;
  setMeetingType: (type: MeetingType) => void;
  selectedContact: string | null;
  setSelectedContact: (id: string) => void;
  focusAreas: string[];
  handleFocusChange: (checked: boolean, value: string) => void;
  handleGenerate: () => void;
  contacts: ContactPerson[];
}

const MeetingDetailsStep = ({
  meetingType,
  setMeetingType,
  selectedContact,
  setSelectedContact,
  focusAreas,
  handleFocusChange,
  handleGenerate,
  contacts
}: MeetingDetailsStepProps) => {
  const focusOptions = [
    { id: 'competitor-moves', label: 'Competitor Moves' },
    { id: 'industry-trends', label: 'Industry Trends' },
    { id: 'financial-health', label: 'Financial Health' },
    { id: 'leadership-changes', label: 'Leadership Changes' },
    { id: 'technology-stack', label: 'Technology Stack' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-3">
        <Label className="text-base">
          Meeting Type <span className="text-destructive">*</span>
        </Label>
        <RadioGroup 
          defaultValue="Intro Call" 
          value={meetingType}
          onValueChange={(value) => setMeetingType(value as MeetingType)}
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
        className="w-full"
        type="button"
      >
        <Sparkles size={16} className="mr-2" />
        Generate Briefing
      </Button>
    </div>
  );
};

export default MeetingDetailsStep;
