import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { GameUser } from "@/types/game";
import { Crown, Heart, Zap, Coins, Trophy } from "lucide-react";

interface PlayerStatsProps {
  player: GameUser;
  className?: string;
}

export function PlayerStats({ player, className }: PlayerStatsProps) {
  const healthPercent = (player.health / player.max_health) * 100;
  const energyPercent = (player.energy / player.max_energy) * 100;
  const xpToNext = Math.pow(player.level + 1, 2) * 100;
  const xpPercent = (player.xp % xpToNext) / xpToNext * 100;

  return (
    <Card className={`bg-gradient-empire border-primary shadow-card ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-primary">
          <Crown className="h-5 w-5" />
          {player.username}
          <Badge variant="outline" className="ml-auto text-primary border-primary">
            Level {player.level}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Health Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-health" />
              <span>Health</span>
            </div>
            <span className="text-health font-medium">
              {player.health}/{player.max_health}
            </span>
          </div>
          <Progress 
            value={healthPercent} 
            className="h-2"
            style={{"--progress-background": "hsl(var(--health))"} as any}
          />
        </div>

        {/* Energy Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-energy" />
              <span>Energy</span>
            </div>
            <span className="text-energy font-medium">
              {player.energy}/{player.max_energy}
            </span>
          </div>
          <Progress 
            value={energyPercent} 
            className="h-2"
            style={{"--progress-background": "hsl(var(--energy))"} as any}
          />
        </div>

        {/* XP Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-xp" />
              <span>Experience</span>
            </div>
            <span className="text-xp font-medium">
              {player.xp % xpToNext}/{xpToNext}
            </span>
          </div>
          <Progress 
            value={xpPercent} 
            className="h-2"
            style={{"--progress-background": "hsl(var(--xp))"} as any}
          />
        </div>

        {/* Currency */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-currency" />
            <span className="text-sm">Cash</span>
          </div>
          <span className="text-currency font-bold">
            ${player.currency.toLocaleString()}
          </span>
        </div>

        {/* Kidnapped Status */}
        {player.is_kidnapped && (
          <Badge variant="destructive" className="w-full justify-center bg-kidnapped">
            KIDNAPPED
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}