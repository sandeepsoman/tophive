
// Mock data for demonstration purposes

export interface Company {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  industry?: string;
  location?: string;
  foundedYear?: number;
  size?: string;
  revenue?: string;
  website?: string;
  socialProfiles?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

export interface Contact {
  id: string;
  name: string;
  title: string;
  photo?: string;
  company: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  twitter?: string;
  recentActivity?: string[];
}

export interface Briefing {
  id: string;
  title: string;
  company: Company;
  meetingType: 'Intro Call' | 'Renewal' | 'Competitive Deal';
  primaryContact?: Contact;
  customFocus?: string[];
  summary: string[];
  companyOverview: {
    description: string;
    recentNews: {
      title: string;
      date: string;
      source: string;
      summary: string;
      url?: string;
    }[];
    financialHealth: {
      status: string;
      details: string;
      metrics?: {
        [key: string]: string;
      };
    };
  };
  keyContacts: Contact[];
  insights: {
    title: string;
    description: string;
    items: string[];
  }[];
  salesHypotheses: string[];
  competitorAnalysis?: {
    competitors: {
      name: string;
      strength: string;
      weakness: string;
    }[];
    comparison: string;
  };
  talkingPoints: string[];
  createdAt: Date;
  status: 'completed' | 'generating' | 'failed';
  notes?: string;
}

const generateMockBriefing = (
  company: Company,
  meetingType: 'Intro Call' | 'Renewal' | 'Competitive Deal',
  primaryContact?: Contact,
  customFocus?: string[]
): Promise<Briefing> => {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const briefing: Briefing = {
        id: Math.random().toString(36).substring(2, 9),
        title: `${meetingType} with ${company.name}`,
        company,
        meetingType,
        primaryContact,
        customFocus,
        summary: [
          `${company.name} is looking to improve their data infrastructure.`,
          "Recent leadership changes indicate a shift towards cloud-first strategy.",
          "Q2 financial results exceeded expectations, suggesting available budget.",
          "Competitive pressure from industry leaders might accelerate decision timeline."
        ],
        companyOverview: {
          description: `${company.name} is a leading provider of ${company.industry} solutions. Founded in ${company.foundedYear || 'N/A'}, they have grown to become a significant player in the industry with ${company.size || 'N/A'} employees worldwide.`,
          recentNews: [
            {
              title: `${company.name} Announces New Cloud Partnership`,
              date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              source: 'TechCrunch',
              summary: `${company.name} has announced a new strategic partnership to enhance their cloud capabilities and expand market reach.`
            },
            {
              title: `${company.name} Reports Strong Q2 Earnings`,
              date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              source: 'Bloomberg',
              summary: `${company.name} reported Q2 earnings above analyst expectations, with revenue growth of 25% year-over-year.`
            },
            {
              title: `${company.name} Appoints New CTO`,
              date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              source: 'Business Insider',
              summary: `${company.name} has appointed a new Chief Technology Officer to lead their digital transformation initiatives.`
            }
          ],
          financialHealth: {
            status: 'Strong',
            details: `${company.name} has demonstrated solid financial performance with consistent revenue growth over the past four quarters.`,
            metrics: {
              'Revenue Growth': '+25% YoY',
              'Profit Margin': '18.5%',
              'Cash Reserves': '$350M',
              'R&D Investment': '12% of revenue'
            }
          }
        },
        keyContacts: [
          {
            id: '1',
            name: 'Jane Smith',
            title: 'Chief Technology Officer',
            company: company.name,
            linkedin: 'https://linkedin.com/in/janesmith',
            recentActivity: [
              'Spoke at Cloud Computing Summit about data modernization',
              'Published article on future of cloud data warehousing',
              'Mentioned scalability challenges in quarterly investor call'
            ]
          },
          {
            id: '2',
            name: 'John Rogers',
            title: 'VP of Data Engineering',
            company: company.name,
            linkedin: 'https://linkedin.com/in/johnrogers',
            recentActivity: [
              'Hired three senior data engineers in the last quarter',
              'Commented on LinkedIn about challenges with current data processing pipeline',
              'Attended workshop on modern data stack architecture'
            ]
          },
          {
            id: '3',
            name: 'Sarah Chen',
            title: 'Chief Financial Officer',
            company: company.name,
            linkedin: 'https://linkedin.com/in/sarahchen',
            recentActivity: [
              'Mentioned technology investment priorities in recent earnings call',
              'Emphasized cost optimization in company town hall',
              'Quoted in industry publication about strategic technology investments'
            ]
          }
        ],
        insights: [
          {
            title: 'Technology Stack',
            description: 'Current technology infrastructure and potential pain points',
            items: [
              'Currently using legacy data warehouse solution with scalability issues',
              'Struggles with data integration across multiple business units',
              'Recently started cloud migration initiative for core applications',
              'Engineering team investigating real-time analytics solutions'
            ]
          },
          {
            title: 'Business Initiatives',
            description: 'Strategic priorities and ongoing projects',
            items: [
              'Digital transformation program launched in Q1 with 3-year roadmap',
              'Expansion into European market planned for next fiscal year',
              'New product launch scheduled for Q4 with data-intensive requirements',
              'Cost optimization initiative targeting 15% reduction in operational expenses'
            ]
          },
          {
            title: 'Decision Process',
            description: 'Understanding of their buying journey and timeline',
            items: [
              'Technology purchases above $250K require executive committee approval',
              'Currently in research phase for data infrastructure modernization',
              'Typical purchase cycle runs 3-6 months from initial evaluation',
              'IT and Finance departments have joint decision-making authority'
            ]
          }
        ],
        salesHypotheses: [
          `${company.name} is likely facing data scalability challenges as they grow, making them receptive to our cloud-based solution.`,
          'Their recent cloud partnership announcement indicates readiness to invest in modern data infrastructure.',
          'The new CTO may be looking to make strategic technology decisions to establish their vision.',
          'Strong financial performance suggests available budget for technology investments with demonstrable ROI.'
        ],
        competitorAnalysis: {
          competitors: [
            {
              name: 'Competitor A',
              strength: 'Established relationship with target account',
              weakness: 'Legacy technology with limited cloud capabilities'
            },
            {
              name: 'Competitor B',
              strength: 'Aggressive pricing and packaging',
              weakness: 'Limited support for complex data integration'
            },
            {
              name: 'Competitor C',
              strength: 'Strong presence in their industry vertical',
              weakness: 'Recent security and reliability issues'
            }
          ],
          comparison: 'Our solution offers superior cloud-native architecture with better scalability and lower TCO than competitor alternatives.'
        },
        talkingPoints: [
          'How are they currently handling data integration across business units?',
          'What are their biggest pain points with their current data infrastructure?',
          'What business outcomes are they looking to achieve with improved data capabilities?',
          'Who are the key stakeholders involved in technology purchase decisions?',
          'What is their timeline for implementing new data solutions?'
        ],
        createdAt: new Date(),
        status: 'completed'
      };
      
      resolve(briefing);
    }, 3000); // Simulate 3 second delay
  });
};

export const BriefingService = {
  generateBriefing: async (
    company: Company,
    meetingType: 'Intro Call' | 'Renewal' | 'Competitive Deal',
    primaryContact?: Contact,
    customFocus?: string[]
  ): Promise<Briefing> => {
    return generateMockBriefing(company, meetingType, primaryContact, customFocus);
  },
  
  getRecentBriefings: (): Promise<Briefing[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            title: 'Intro Call with Snowflake',
            company: { 
              id: '1', 
              name: 'Snowflake', 
              logo: 'https://logo.clearbit.com/snowflake.com',
              industry: 'Cloud Data Platform'
            },
            meetingType: 'Intro Call',
            summary: ['Sample summary point'],
            companyOverview: {
              description: 'Brief description',
              recentNews: [],
              financialHealth: {
                status: 'Strong',
                details: 'Details'
              }
            },
            keyContacts: [],
            insights: [],
            salesHypotheses: [],
            talkingPoints: [],
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            status: 'completed'
          },
          {
            id: '2',
            title: 'Renewal Meeting with Salesforce',
            company: { 
              id: '2', 
              name: 'Salesforce', 
              logo: 'https://logo.clearbit.com/salesforce.com',
              industry: 'CRM Software'
            },
            meetingType: 'Renewal',
            summary: ['Sample summary point'],
            companyOverview: {
              description: 'Brief description',
              recentNews: [],
              financialHealth: {
                status: 'Strong',
                details: 'Details'
              }
            },
            keyContacts: [],
            insights: [],
            salesHypotheses: [],
            talkingPoints: [],
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            status: 'completed'
          },
          {
            id: '3',
            title: 'Competitive Deal with Adobe',
            company: { 
              id: '3', 
              name: 'Adobe', 
              logo: 'https://logo.clearbit.com/adobe.com',
              industry: 'Software'
            },
            meetingType: 'Competitive Deal',
            summary: ['Sample summary point'],
            companyOverview: {
              description: 'Brief description',
              recentNews: [],
              financialHealth: {
                status: 'Strong',
                details: 'Details'
              }
            },
            keyContacts: [],
            insights: [],
            salesHypotheses: [],
            talkingPoints: [],
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            status: 'generating'
          }
        ]);
      }, 1000);
    });
  },
  
  getBriefingById: (id: string): Promise<Briefing> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (id === '1') {
          resolve({
            id: '1',
            title: 'Intro Call with Snowflake',
            company: { 
              id: '1', 
              name: 'Snowflake', 
              logo: 'https://logo.clearbit.com/snowflake.com',
              industry: 'Cloud Data Platform',
              location: 'Bozeman, MT',
              foundedYear: 2012,
              size: '2,000+ employees',
              revenue: '$1.2B annually',
              website: 'https://snowflake.com'
            },
            meetingType: 'Intro Call',
            summary: [
              'Snowflake is expanding their data analytics capabilities',
              'Recently appointed new CTO with cloud-native background',
              'Q2 financial results showed 80% YoY growth',
              'Investing heavily in AI/ML capabilities'
            ],
            companyOverview: {
              description: 'Snowflake delivers the Data Cloud — a global network where thousands of organizations mobilize data with near-unlimited scale, concurrency, and performance.',
              recentNews: [
                {
                  title: 'Snowflake Announces Enhanced AI Features',
                  date: '2023-10-15',
                  source: 'TechCrunch',
                  summary: 'Snowflake unveiled new AI-powered features to help customers derive insights from their data more efficiently.'
                },
                {
                  title: 'Snowflake Reports Strong Q2 Earnings',
                  date: '2023-08-24',
                  source: 'Bloomberg',
                  summary: 'Snowflake reported Q2 earnings above analyst expectations, with revenue growth of 83% year-over-year.'
                },
                {
                  title: 'Snowflake Appoints New CTO',
                  date: '2023-07-12',
                  source: 'Business Insider',
                  summary: 'Snowflake has appointed a new Chief Technology Officer with extensive experience in cloud technologies and AI.'
                }
              ],
              financialHealth: {
                status: 'Strong Growth',
                details: 'Snowflake has demonstrated exceptional financial performance with consistent revenue growth over the past four quarters.',
                metrics: {
                  'Revenue Growth': '+83% YoY',
                  'Customers': '7,000+',
                  'Net Revenue Retention': '171%',
                  'Cash Reserves': '$4.1B'
                }
              }
            },
            keyContacts: [
              {
                id: '1',
                name: 'Frank Slootman',
                title: 'Chairman and CEO',
                company: 'Snowflake',
                linkedin: 'https://linkedin.com/in/frankslootman',
                recentActivity: [
                  'Emphasized focus on AI/ML capabilities in recent earnings call',
                  'Published article on future of data cloud',
                  'Spoke at industry conference about data-driven transformation'
                ]
              },
              {
                id: '2',
                name: 'Benoit Dageville',
                title: 'Co-Founder and President of Products',
                company: 'Snowflake',
                linkedin: 'https://linkedin.com/in/benoitdageville',
                recentActivity: [
                  'Announced product roadmap at Snowflake Summit',
                  'Spoke about data sharing ecosystem',
                  'Participated in panel discussion on modern data architecture'
                ]
              },
              {
                id: '3',
                name: 'Mike Scarpelli',
                title: 'Chief Financial Officer',
                company: 'Snowflake',
                linkedin: 'https://linkedin.com/in/mikescarpelli',
                recentActivity: [
                  'Presented financial results at investor conference',
                  'Discussed strategic investments in technology infrastructure',
                  'Mentioned increasing investment in partner ecosystem'
                ]
              }
            ],
            insights: [
              {
                title: 'Technology Strategy',
                description: 'Current data platform and strategic direction',
                items: [
                  'Heavily invested in cloud-native data architecture',
                  'Expanding capabilities in AI/ML and data science',
                  'Building stronger data sharing and marketplace offerings',
                  'Focus on industry-specific solutions and accelerators'
                ]
              },
              {
                title: 'Business Initiatives',
                description: 'Strategic priorities and ongoing projects',
                items: [
                  'International expansion, particularly in APAC region',
                  'Strengthening enterprise customer base',
                  'Developing industry-specific solutions',
                  'Building developer ecosystem around Snowpark'
                ]
              },
              {
                title: 'Competitive Landscape',
                description: 'Understanding of market position and challenges',
                items: [
                  'Competing with established data warehouse vendors',
                  'Facing pressure from cloud hyperscalers',
                  'Differentiating through performance and ease of use',
                  'Expanding partner ecosystem for implementation support'
                ]
              }
            ],
            salesHypotheses: [
              'Snowflake is looking to enhance their data analytics capabilities to better serve enterprise customers.',
              'Their focus on AI/ML aligns with our advanced analytics offerings.',
              'The new CTO may be open to exploring complementary technologies.',
              'Strong financial position suggests available budget for strategic technology investments.'
            ],
            competitorAnalysis: {
              competitors: [
                {
                  name: 'Databricks',
                  strength: 'Strong in data engineering and ML workloads',
                  weakness: 'Less mature data warehousing capabilities'
                },
                {
                  name: 'Amazon Redshift',
                  strength: 'Tight AWS integration and competitive pricing',
                  weakness: 'Performance at scale compared to Snowflake'
                },
                {
                  name: 'Google BigQuery',
                  strength: 'Serverless architecture with ML capabilities',
                  weakness: 'More complex administration and optimization'
                }
              ],
              comparison: 'Our solution complements Snowflake by providing advanced analytics capabilities that integrate seamlessly with their data cloud platform.'
            },
            talkingPoints: [
              'How are they currently leveraging their data for business insights?',
              'What challenges are they facing with their current analytics approach?',
              'How are they planning to implement AI/ML capabilities?',
              'What business outcomes are they looking to achieve with improved analytics?',
              'Who are the key stakeholders involved in analytics decisions?'
            ],
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            status: 'completed'
          });
        } else {
          reject(new Error('Briefing not found'));
        }
      }, 1000);
    });
  }
};
