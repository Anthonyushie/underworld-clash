import { PlayerStats } from "@/components/game/PlayerStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGameData } from "@/hooks/useGameData";
import { Swords, Package, Store, Trophy, Clock, Target } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { player, userItems, battles } = useGameData();

  const equippedItems = userItems.filter(ui => ui.equipped);
  const recentBattles = battles.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Player Stats */}
      <PlayerStats player={player} />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button asChild variant="combat" size="lg" className="h-20">
          <Link to="/arena" className="flex flex-col items-center gap-2">
            <Swords className="h-6 w-6" />
            <span>Battle</span>
          </Link>
        </Button>
        
        <Button asChild variant="empire" size="lg" className="h-20">
          <Link to="/inventory" className="flex flex-col items-center gap-2">
            <Package className="h-6 w-6" />
            <span>Inventory</span>
          </Link>
        </Button>
        
        <Button asChild variant="luxury" size="lg" className="h-20">
          <Link to="/marketplace" className="flex flex-col items-center gap-2">
            <Store className="h-6 w-6" />
            <span>Market</span>
          </Link>
        </Button>
        
        <Button asChild variant="boss" size="lg" className="h-20">
          <Link to="/leaderboard" className="flex flex-col items-center gap-2">
            <Trophy className="h-6 w-6" />
            <span>Rankings</span>
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equipped Items */}
        <Card className="bg-gradient-empire border-primary shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Target className="h-5 w-5" />
              Equipped Gear
            </CardTitle>
          </CardHeader>
          <CardContent>
            {equippedItems.length > 0 ? (
              <div className="space-y-3">
                {equippedItems.map((userItem) => (
                  <div 
                    key={userItem.id}
                    className="flex items-center justify-between p-3 bg-card rounded border border-border"
                  >
                    <div>
                      <h4 className="font-medium text-foreground">{userItem.item?.name}</h4>
                      <p className="text-sm text-muted-foreground">{userItem.item?.description}</p>
                    </div>
                    <Badge 
                      variant={userItem.item?.rarity === 'legendary' ? 'default' : 'secondary'}
                      className={`${
                        userItem.item?.rarity === 'legendary' ? 'bg-rarity-legendary text-background' :
                        userItem.item?.rarity === 'epic' ? 'bg-rarity-epic text-foreground' :
                        userItem.item?.rarity === 'rare' ? 'bg-rarity-rare text-foreground' :
                        'bg-rarity-common text-foreground'
                      }`}
                    >
                      {userItem.item?.rarity}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No items equipped</p>
                <Button asChild variant="outline" className="mt-2">
                  <Link to="/inventory">Equip Items</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Battles */}
        <Card className="bg-gradient-empire border-primary shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Clock className="h-5 w-5" />
              Recent Battles
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentBattles.length > 0 ? (
              <div className="space-y-3">
                {recentBattles.map((battle) => (
                  <div 
                    key={battle.id}
                    className="flex items-center justify-between p-3 bg-card rounded border border-border"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={battle.winner_id === player.id ? "default" : "destructive"}
                          className={battle.winner_id === player.id ? "bg-victory" : "bg-defeat"}
                        >
                          {battle.winner_id === player.id ? "Victory" : "Defeat"}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          vs Level {battle.defender_snapshot.level}
                        </span>
                      </div>
                      {battle.winner_id === player.id && (
                        <p className="text-sm text-currency">
                          +${battle.reward_currency}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(battle.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Swords className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No battles yet</p>
                <Button asChild variant="combat" className="mt-2">
                  <Link to="/arena">Start Fighting</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}