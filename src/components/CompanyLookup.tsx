
import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ClearbitService from '@/services/clearbitService';

export interface Company {
  id: string;
  name: string;
  logo?: string;
  industry?: string;
  location?: string;
  domain?: string;
}

interface CompanyLookupProps {
  onSelect: (company: Company) => void;
  selectedCompany: Company | null;
}

const CompanyLookup = ({ onSelect, selectedCompany }: CompanyLookupProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current && 
        !resultsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchCompanies = async () => {
      setIsLoading(true);
      
      try {
        // Use the ClearbitService to search for companies
        const companies = await ClearbitService.searchCompanies(query);
        setResults(companies);
      } catch (error) {
        console.error('Error searching companies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search
    const handler = setTimeout(searchCompanies, 300);
    return () => clearTimeout(handler);
  }, [query]);

  const handleSelect = (company: Company) => {
    onSelect(company);
    setQuery('');
    setResults([]);
    setIsFocused(false);
  };

  const clearSelection = () => {
    onSelect({ id: '', name: '' });
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative">
      {!selectedCompany || !selectedCompany.id ? (
        <div className="relative">
          <div className="relative">
            <Search 
              size={18} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search for a company..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              className="pl-10 focus-within-ring transition-all"
              autoComplete="off"
            />
          </div>
          
          {isFocused && (query || results.length > 0) && (
            <Card 
              ref={resultsRef}
              className="absolute z-10 mt-1 w-full max-h-64 overflow-y-auto shadow-lg animate-fade-in"
            >
              {isLoading ? (
                <div className="p-3 space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <Skeleton className="h-10 w-10 rounded-md" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : results.length > 0 ? (
                <div className="py-1">
                  {results.map((company) => (
                    <button
                      key={company.id}
                      onClick={() => handleSelect(company)}
                      className="w-full text-left px-3 py-2 hover:bg-secondary transition-colors flex items-center space-x-3"
                    >
                      {company.logo ? (
                        <img 
                          src={company.logo} 
                          alt={company.name}
                          className="h-10 w-10 rounded-md object-contain bg-white p-1 border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=' + company.name.charAt(0);
                          }}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                          {company.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{company.name}</p>
                        {company.industry && (
                          <p className="text-xs text-muted-foreground">
                            {company.industry} • {company.location}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : query ? (
                <div className="p-3 text-center text-sm text-muted-foreground">
                  No companies found matching "{query}"
                </div>
              ) : null}
            </Card>
          )}
        </div>
      ) : (
        <div className="flex items-center space-x-3 p-3 border rounded-md bg-secondary/30 animate-fade-in">
          {selectedCompany.logo ? (
            <img 
              src={selectedCompany.logo} 
              alt={selectedCompany.name}
              className="h-10 w-10 rounded-md object-contain bg-white p-1 border"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=' + selectedCompany.name.charAt(0);
              }}
            />
          ) : (
            <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">
              {selectedCompany.name.charAt(0)}
            </div>
          )}
          <div className="flex-1">
            <p className="font-medium">{selectedCompany.name}</p>
            {selectedCompany.industry && (
              <p className="text-xs text-muted-foreground">
                {selectedCompany.industry} • {selectedCompany.location}
              </p>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearSelection}
            className="h-8 w-8 p-0"
          >
            <X size={16} />
            <span className="sr-only">Clear selection</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default CompanyLookup;
