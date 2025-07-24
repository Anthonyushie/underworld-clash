import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlayerStats } from "@/components/game/PlayerStats";
import { useGameData } from "@/hooks/useGameData";
import { useToast } from "@/hooks/use-toast";
import { Swords, Target, Crown, Zap, Heart, TrendingUp } from "lucide-react";

export default function Arena() {
  const { player, opponents, attackPlayer, battles } = useGameData();
  const { toast } = useToast();
  const [selectedOpponent, setSelectedOpponent] = useState<string>("");

  const handleAttack = (defenderId: string) => {
    if (player.energy < 1) {
      toast({
        title: "Not enough energy!",
        description: "Wait for your energy to regenerate or use items.",
        variant: "destructive",
      });
      return;
    }

    const success = attackPlayer(defenderId);
    if (success) {
      const opponent = opponents.find(o => o.id === defenderId);
      const battle = battles[0]; // Most recent battle
      
      if (battle?.winner_id === player.id) {
        toast({
          title: "Victory!",
          description: `Defeated ${opponent?.username} and earned $${battle.reward_currency}`,
        });
      } else {
        toast({
          title: "Defeat",
          description: `${opponent?.username} proved too strong this time.`,
          variant: "destructive",
        });
      }
    }
  };

  const recentBattles = battles.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">PvP Arena</h1>
        <PlayerStats player={player} className="w-80" />
      </div>

      {/* Energy Warning */}
      {player.energy < 1 && (
        <Card className="bg-gradient-blood border-destructive shadow-combat">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-destructive" />
              <div>
                <h3 className="font-medium text-foreground">No Energy Available</h3>
                <p className="text-sm text-muted-foreground">
                  Energy regenerates over time. Each attack costs 1 energy.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Opponents */}
        <Card className="bg-gradient-empire border-primary shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Target className="h-5 w-5" />
              Available Targets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {opponents.map((opponent) => {
              const powerLevel = opponent.level * 5; // Simple power calculation
              const difficulty = powerLevel > player.level * 5 ? "hard" : 
                               powerLevel < player.level * 5 ? "easy" : "medium";
              
              return (
                <div 
                  key={opponent.id}
                  className={`p-4 bg-card rounded border transition-all cursor-pointer hover:shadow-gold ${
                    selectedOpponent === opponent.id ? "border-primary shadow-gold" : "border-border"
                  }`}
                  onClick={() => setSelectedOpponent(opponent.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-primary" />
                      <h3 className="font-medium text-foreground">{opponent.username}</h3>
                    </div>
                    <Badge variant="outline" className="text-primary border-primary">
                      Level {opponent.level}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3 text-health" />
                      <span className="text-health">{opponent.health}/{opponent.max_health}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="h-3 w-3 text-energy" />
                      <span className="text-energy">{opponent.energy}/{opponent.max_energy}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-currency" />
                      <span className="text-currency">${opponent.currency.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge 
                      variant="outline"
                      className={`${
                        difficulty === "hard" ? "border-destructive text-destructive" :
                        difficulty === "easy" ? "border-victory text-victory" :
                        "border-primary text-primary"
                      }`}
                    >
                      {difficulty === "hard" ? "Dangerous" :
                       difficulty === "easy" ? "Easy Target" : "Fair Fight"}
                    </Badge>
                    
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAttack(opponent.id);
                      }}
                      variant="combat"
                      size="sm"
                      disabled={player.energy < 1}
                    >
                      <Swords className="h-4 w-4 mr-1" />
                      Attack
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Battle History */}
        <Card className="bg-gradient-empire border-primary shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Swords className="h-5 w-5" />
              Battle History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentBattles.length > 0 ? (
              <div className="space-y-3">
                {recentBattles.map((battle) => (
                  <div 
                    key={battle.id}
                    className="p-3 bg-card rounded border border-border"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge 
                        variant={battle.winner_id === player.id ? "default" : "destructive"}
                        className={battle.winner_id === player.id ? "bg-victory" : "bg-defeat"}
                      >
                        {battle.winner_id === player.id ? "Victory" : "Defeat"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(battle.timestamp).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Attacker Power: </span>
                        <span className="font-medium">{battle.attacker_snapshot.power}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Defender Power: </span>
                        <span className="font-medium">{battle.defender_snapshot.power}</span>
                      </div>
                    </div>
                    
                    {battle.winner_id === player.id && battle.reward_currency > 0 && (
                      <div className="mt-2 text-sm">
                        <span className="text-muted-foreground">Reward: </span>
                        <span className="text-currency font-medium">+${battle.reward_currency}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Swords className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No battles yet</p>
                <p className="text-sm">Attack an opponent to begin your criminal career!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}