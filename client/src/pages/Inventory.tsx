import { useState } from "react";
import { GameLayout } from "@/components/game/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlayerStats } from "@/components/game/PlayerStats";
import { useGameData } from "@/hooks/useGameData";
import { Package, Sword, Shield, Wrench, Pill, Star } from "lucide-react";

const categoryIcons = {
  weapon: Sword,
  armor: Shield,
  utility: Wrench,
  consumable: Pill,
  special: Star,
};

function InventoryPage() {
  const { player, userItems, equipItem } = useGameData();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredItems = selectedCategory === "all" 
    ? userItems 
    : userItems.filter(ui => ui.item?.category === selectedCategory);

  const categories = ["all", "weapon", "armor", "utility", "consumable", "special"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Inventory</h1>
        <PlayerStats player={player} className="w-80" />
      </div>

      {/* Category Filter */}
      <Card className="bg-gradient-empire border-primary shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Package className="h-5 w-5" />
            Item Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category === "all" ? "All Items" : category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((userItem) => {
          const item = userItem.item!;
          const CategoryIcon = categoryIcons[item.category];
          
          return (
            <Card 
              key={userItem.id}
              className={`bg-gradient-empire border-primary shadow-card transition-all hover:shadow-gold ${
                userItem.equipped ? "ring-2 ring-primary" : ""
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <CategoryIcon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg text-foreground">{item.name}</CardTitle>
                  </div>
                  <Badge 
                    variant="outline"
                    className={`${
                      item.rarity === 'legendary' ? 'border-rarity-legendary text-rarity-legendary' :
                      item.rarity === 'epic' ? 'border-rarity-epic text-rarity-epic' :
                      item.rarity === 'rare' ? 'border-rarity-rare text-rarity-rare' :
                      'border-rarity-common text-rarity-common'
                    }`}
                  >
                    {item.rarity}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{item.description}</p>
                
                {/* Item Effects */}
                {Object.entries(item.effect).length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground">Effects:</h4>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      {Object.entries(item.effect).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-muted-foreground capitalize">
                            {key.replace(/_/g, ' ')}:
                          </span>
                          <span className="text-primary font-medium">
                            {typeof value === 'number' && value > 1 && key.includes('multiplier') 
                              ? `${(value * 100 - 100).toFixed(0)}%`
                              : typeof value === 'number' && key.includes('chance')
                              ? `${value}%`
                              : `+${value}`
                            }
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Value */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-sm text-muted-foreground">Value:</span>
                  <span className="text-currency font-bold">${item.price.toLocaleString()}</span>
                </div>

                {/* Equip Button */}
                <Button
                  onClick={() => equipItem(userItem.item_id)}
                  variant={userItem.equipped ? "destructive" : "default"}
                  className="w-full"
                >
                  {userItem.equipped ? "Unequip" : "Equip"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <Card className="bg-gradient-empire border-primary shadow-card">
          <CardContent className="py-12 text-center">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Items Found</h3>
            <p className="text-muted-foreground mb-4">
              {selectedCategory === "all" 
                ? "Your inventory is empty. Visit the marketplace to buy items."
                : `No ${selectedCategory} items in your inventory.`
              }
            </p>
            <Button asChild variant="luxury">
              <a href="/marketplace">Visit Marketplace</a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function Inventory() {
  return (
    <GameLayout>
      <InventoryPage />
    </GameLayout>
  );
}