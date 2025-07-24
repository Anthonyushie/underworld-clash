import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, 
  Users, 
  Database, 
  RefreshCw, 
  Trash2, 
  Plus,
  AlertTriangle,
  Settings
} from "lucide-react";

export default function Admin() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSeedData = async () => {
    setIsLoading(true);
    // Simulate seeding delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Data seeded successfully!",
      description: "Added 50 test players, 200 items, and 100 battles.",
    });
    setIsLoading(false);
  };

  const handleResetGame = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Game reset complete",
      description: "All player data, battles, and marketplace listings cleared.",
      variant: "destructive",
    });
    setIsLoading(false);
  };

  const handleAddTestPlayer = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Test player added",
      description: "Created new player with random stats and items.",
    });
    setIsLoading(false);
  };

  const adminStats = [
    { label: "Total Players", value: "23", icon: Users },
    { label: "Active Battles", value: "147", icon: Shield },
    { label: "Market Items", value: "89", icon: Database },
    { label: "Server Load", value: "23%", icon: Settings },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-primary">Admin Control Panel</h1>
        <Badge variant="destructive" className="ml-auto">
          ADMIN ACCESS
        </Badge>
      </div>

      {/* Warning */}
      <Card className="bg-gradient-blood border-destructive shadow-combat">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <div>
              <h3 className="font-medium text-foreground">Admin Actions</h3>
              <p className="text-sm text-muted-foreground">
                These actions affect the entire game state. Use with caution in production.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminStats.map((stat) => (
          <Card key={stat.label} className="bg-gradient-empire border-primary shadow-card">
            <CardContent className="pt-6 text-center">
              <stat.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-bold text-2xl text-foreground">{stat.value}</h3>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Management */}
        <Card className="bg-gradient-empire border-primary shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Database className="h-5 w-5" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleSeedData}
              variant="luxury"
              className="w-full"
              disabled={isLoading}
            >
              <Plus className="h-4 w-4 mr-2" />
              {isLoading ? "Seeding..." : "Seed Test Data"}
            </Button>
            
            <Button
              onClick={handleAddTestPlayer}
              variant="empire"
              className="w-full"
              disabled={isLoading}
            >
              <Users className="h-4 w-4 mr-2" />
              {isLoading ? "Adding..." : "Add Test Player"}
            </Button>
            
            <div className="pt-2 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">
                Danger Zone - Irreversible Actions
              </p>
              <Button
                onClick={handleResetGame}
                variant="destructive"
                className="w-full"
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isLoading ? "Resetting..." : "Reset All Game Data"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Game Monitoring */}
        <Card className="bg-gradient-empire border-primary shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <RefreshCw className="h-5 w-5" />
              Game Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-card rounded border border-border">
                <span className="text-sm font-medium">Energy Regeneration</span>
                <Badge variant="outline" className="text-victory border-victory">
                  Active
                </Badge>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-card rounded border border-border">
                <span className="text-sm font-medium">Battle System</span>
                <Badge variant="outline" className="text-victory border-victory">
                  Online
                </Badge>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-card rounded border border-border">
                <span className="text-sm font-medium">Marketplace</span>
                <Badge variant="outline" className="text-victory border-victory">
                  Functional
                </Badge>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-card rounded border border-border">
                <span className="text-sm font-medium">Database Connection</span>
                <Badge variant="outline" className="text-primary border-primary">
                  Mock Mode
                </Badge>
              </div>
            </div>
            
            <Button variant="outline" className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Status
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Supabase Integration Notice */}
      <Card className="bg-gradient-luxury border-accent shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-accent-foreground">
            <Settings className="h-5 w-5" />
            Backend Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-accent-foreground">
              This admin panel is currently using mock data for demonstration purposes.
            </p>
            <p className="text-sm text-accent-foreground/80">
              To enable full functionality with real database operations, connect your Lovable project to Supabase:
            </p>
            <ul className="text-sm text-accent-foreground/80 space-y-1 ml-4">
              <li>• Click the green Supabase button in the top-right corner</li>
              <li>• Set up your database schema with the provided SQL</li>
              <li>• Enable Row Level Security (RLS) policies</li>
              <li>• Configure authentication and real-time subscriptions</li>
            </ul>
            <Button variant="outline" className="mt-4">
              View Integration Guide
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}