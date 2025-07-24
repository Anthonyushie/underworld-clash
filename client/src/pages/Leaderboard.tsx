import { GameLayout } from "@/components/game/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGameData } from "@/hooks/useGameData";
import { Trophy, Crown, TrendingUp, Zap, Heart } from "lucide-react";

function LeaderboardPage() {
  const { leaderboard } = useGameData();

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1: return "text-yellow-500";
      case 2: return "text-gray-400";
      case 3: return "text-amber-600";
      default: return "text-muted-foreground";
    }
  };

  const getMedalIcon = (rank: number) => {
    if (rank <= 3) {
      return <Crown className={`h-5 w-5 ${getMedalColor(rank)}`} />;
    }
    return <span className="text-muted-foreground font-bold">#{rank}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Trophy className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-primary">Criminal Leaderboard</h1>
      </div>

      {/* Top Players */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {leaderboard.slice(0, 3).map((player, index) => (
          <Card 
            key={player.id}
            className={`bg-gradient-empire border-primary shadow-card ${
              index === 0 ? "ring-2 ring-primary shadow-gold" : ""
            }`}
          >
            <CardHeader className="text-center pb-3">
              <div className="flex justify-center mb-2">
                {getMedalIcon(index + 1)}
              </div>
              <CardTitle className="text-lg text-foreground">{player.username}</CardTitle>
              <Badge variant="outline" className="text-primary border-primary">
                Level {player.level}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-xp" />
                  <span className="text-xp">{player.xp} XP</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-currency">${player.currency.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-3 w-3 text-health" />
                  <span className="text-health">{player.health}/{player.max_health}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="h-3 w-3 text-energy" />
                  <span className="text-energy">{player.energy}/{player.max_energy}</span>
                </div>
              </div>
              
              {player.is_kidnapped && (
                <Badge variant="destructive" className="w-full justify-center bg-kidnapped">
                  KIDNAPPED
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Full Leaderboard */}
      <Card className="bg-gradient-empire border-primary shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Trophy className="h-5 w-5" />
            Complete Rankings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {leaderboard.map((player, index) => (
              <div 
                key={player.id}
                className="flex items-center justify-between p-4 bg-card rounded border border-border hover:shadow-gold transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 flex justify-center">
                    {getMedalIcon(index + 1)}
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{player.username}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Level {player.level}</span>
                      <span>{player.xp} XP</span>
                      <span>${player.currency.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {player.is_kidnapped && (
                    <Badge variant="destructive" className="bg-kidnapped">
                      Kidnapped
                    </Badge>
                  )}
                  
                  <div className="text-right text-sm">
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3 text-health" />
                      <span className="text-health">{player.health}/{player.max_health}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="h-3 w-3 text-energy" />
                      <span className="text-energy">{player.energy}/{player.max_energy}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-empire border-primary shadow-card">
          <CardContent className="pt-6 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="font-bold text-2xl text-foreground">
              {Math.max(...leaderboard.map(p => p.level))}
            </h3>
            <p className="text-sm text-muted-foreground">Highest Level</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-empire border-primary shadow-card">
          <CardContent className="pt-6 text-center">
            <span className="text-2xl">💰</span>
            <h3 className="font-bold text-2xl text-foreground">
              ${Math.max(...leaderboard.map(p => p.currency)).toLocaleString()}
            </h3>
            <p className="text-sm text-muted-foreground">Richest Player</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-empire border-primary shadow-card">
          <CardContent className="pt-6 text-center">
            <Crown className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="font-bold text-2xl text-foreground">
              {leaderboard.filter(p => !p.is_kidnapped).length}
            </h3>
            <p className="text-sm text-muted-foreground">Active Players</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Leaderboard() {
  return (
    <GameLayout>
      <LeaderboardPage />
    </GameLayout>
  );
}