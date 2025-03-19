
import { Company } from '@/components/CompanyLookup';

/**
 * Service for interacting with the Clearbit API
 */
export const ClearbitService = {
  /**
   * Search for companies by name using Clearbit's Autocomplete API
   * 
   * @param query The search query (company name)
   * @returns Promise with company results
   */
  async searchCompanies(query: string): Promise<Company[]> {
    try {
      // In production, you would use the actual Clearbit API
      // const response = await fetch(
      //   `https://autocomplete.clearbit.com/v1/companies/suggest?query=${encodeURIComponent(query)}`
      // );
      
      // For now, we'll simulate the API call with mock data
      // This is just for demonstration purposes
      const mockCompanies = [
        { 
          id: '1', 
          name: 'Snowflake', 
          logo: 'https://logo.clearbit.com/snowflake.com', 
          industry: 'Cloud Data Platform',
          location: 'Bozeman, MT',
          domain: 'snowflake.com'
        },
        { 
          id: '2', 
          name: 'Salesforce', 
          logo: 'https://logo.clearbit.com/salesforce.com', 
          industry: 'CRM Software',
          location: 'San Francisco, CA',
          domain: 'salesforce.com'
        },
        { 
          id: '3', 
          name: 'Microsoft', 
          logo: 'https://logo.clearbit.com/microsoft.com', 
          industry: 'Technology',
          location: 'Redmond, WA',
          domain: 'microsoft.com'
        },
        { 
          id: '4', 
          name: 'Adobe', 
          logo: 'https://logo.clearbit.com/adobe.com', 
          industry: 'Software',
          location: 'San Jose, CA',
          domain: 'adobe.com'
        },
        { 
          id: '5', 
          name: 'Slack', 
          logo: 'https://logo.clearbit.com/slack.com', 
          industry: 'Communication',
          location: 'San Francisco, CA',
          domain: 'slack.com'
        },
        { 
          id: '6', 
          name: 'Google', 
          logo: 'https://logo.clearbit.com/google.com', 
          industry: 'Technology',
          location: 'Mountain View, CA',
          domain: 'google.com'
        },
        { 
          id: '7', 
          name: 'Amazon', 
          logo: 'https://logo.clearbit.com/amazon.com', 
          industry: 'E-commerce',
          location: 'Seattle, WA',
          domain: 'amazon.com'
        },
        { 
          id: '8', 
          name: 'Apple', 
          logo: 'https://logo.clearbit.com/apple.com', 
          industry: 'Technology',
          location: 'Cupertino, CA',
          domain: 'apple.com'
        },
        { 
          id: '9', 
          name: 'Facebook', 
          logo: 'https://logo.clearbit.com/facebook.com', 
          industry: 'Social Media',
          location: 'Menlo Park, CA',
          domain: 'facebook.com'
        },
        { 
          id: '10', 
          name: 'Tesla', 
          logo: 'https://logo.clearbit.com/tesla.com', 
          industry: 'Automotive',
          location: 'Palo Alto, CA',
          domain: 'tesla.com'
        }
      ];

      // Filter mock companies based on the query
      const filtered = mockCompanies.filter(company => 
        company.name.toLowerCase().includes(query.toLowerCase())
      );

      return filtered;
    } catch (error) {
      console.error('Error searching companies with Clearbit:', error);
      return [];
    }
  },

  /**
   * Get logo URL for a company domain
   * 
   * @param domain Company domain
   * @returns Logo URL
   */
  getLogoUrl(domain: string): string {
    return `https://logo.clearbit.com/${domain}`;
  }
};

export default ClearbitService;
