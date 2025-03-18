
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import BriefingCard from "@/components/BriefingCard";
import LoadingEffect from '@/components/LoadingEffect';
import { BriefingService, Briefing } from '@/utils/briefingService';
import { Plus, FileText, Clock, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const [briefings, setBriefings] = useState<Briefing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const loadBriefings = async () => {
      try {
        const data = await BriefingService.getRecentBriefings();
        setBriefings(data);
      } catch (error) {
        console.error('Error loading briefings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBriefings();
  }, []);

  const filteredBriefings = briefings.filter(briefing => {
    const matchesSearch = briefing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          briefing.company.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'completed' && briefing.status === 'completed') ||
                      (activeTab === 'generating' && briefing.status === 'generating');
    
    return matchesSearch && matchesTab;
  });

  const handleViewBriefing = (id: string) => {
    window.location.href = `/briefing/${id}`;
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="bg-background border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage your sales briefings</p>
            </div>
            <Link to="/new-briefing">
              <Button className="flex items-center shadow-sm hover:shadow-md">
                <Plus size={16} className="mr-1" />
                New Briefing
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover-lift card-elevation">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileText size={18} className="mr-2 text-primary" />
                Total Briefings
              </CardTitle>
              <CardDescription>All-time generated briefings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {isLoading ? '-' : briefings.length}
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover-lift card-elevation">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Clock size={18} className="mr-2 text-amber-500" />
                Generating
              </CardTitle>
              <CardDescription>Briefings in progress</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {isLoading ? '-' : briefings.filter(b => b.status === 'generating').length}
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover-lift card-elevation">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Clock size={18} className="mr-2 text-green-500" />
                Recent Activity
              </CardTitle>
              <CardDescription>Last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {isLoading ? '-' : briefings.filter(b => {
                  const sevenDaysAgo = new Date();
                  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                  return b.createdAt > sevenDaysAgo;
                }).length}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold">Your Briefings</h2>
          
          <div className="w-full md:w-auto flex items-center space-x-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Search briefings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 focus-within-ring"
              />
            </div>
            <Link to="/new-briefing" className="md:hidden">
              <Button className="flex items-center whitespace-nowrap">
                <Plus size={16} className="mr-1" />
                New
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="generating">Generating</TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingEffect text="Loading your briefings..." />
          </div>
        ) : filteredBriefings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBriefings.map((briefing) => (
              <BriefingCard 
                key={briefing.id} 
                briefing={{
                  id: briefing.id,
                  title: briefing.title,
                  companyName: briefing.company.name,
                  companyLogo: briefing.company.logo,
                  meetingType: briefing.meetingType,
                  createdAt: briefing.createdAt,
                  status: briefing.status
                }}
                onView={handleViewBriefing}
              />
            ))}
          </div>
        ) : (
          <Card className="bg-secondary/50 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-secondary p-3 mb-4">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No briefings found</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                {searchQuery 
                  ? `No briefings match your search for "${searchQuery}"`
                  : "You haven't created any briefings yet. Create your first briefing to get started."}
              </p>
              <Link to="/new-briefing">
                <Button className="flex items-center shadow-sm hover:shadow-md">
                  <Plus size={16} className="mr-1" />
                  Create New Briefing
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
