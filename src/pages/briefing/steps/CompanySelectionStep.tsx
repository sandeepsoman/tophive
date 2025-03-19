
import { Label } from "@/components/ui/label";
import CompanyLookup, { Company } from "@/components/CompanyLookup";

interface CompanySelectionStepProps {
  onSelect: (company: Company) => void;
  selectedCompany: Company | null;
}

const CompanySelectionStep = ({ onSelect, selectedCompany }: CompanySelectionStepProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="company" className="text-base">
        Company Name <span className="text-destructive">*</span>
      </Label>
      <CompanyLookup onSelect={onSelect} selectedCompany={selectedCompany} />
    </div>
  );
};

export default CompanySelectionStep;
