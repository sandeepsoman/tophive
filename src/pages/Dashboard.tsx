
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import BriefingCard from '@/components/BriefingCard';
import { Plus, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleNewBriefing = () => {
    navigate('/new-briefing');
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-7xl mx-auto p-4 md:p-6">
        <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}! Manage your sales briefings here.
            </p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button onClick={handleNewBriefing} className="flex items-center w-full md:w-auto">
              <Plus className="mr-1 h-4 w-4" />
              New Briefing
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSignOut} 
              className="flex items-center w-full md:w-auto"
            >
              <LogOut className="mr-1 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Briefings</CardTitle>
              <CardDescription>
                View and manage your recent sales briefings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Placeholder for empty state */}
                <div className="col-span-full py-8 text-center">
                  <p className="text-muted-foreground mb-4">You haven't created any briefings yet.</p>
                  <Button onClick={handleNewBriefing} variant="outline">
                    <Plus className="mr-1 h-4 w-4" />
                    Create your first briefing
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
