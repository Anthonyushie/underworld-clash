import { useState } from "react";
import { GameLayout } from "@/components/game/GameLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PlayerStats } from "@/components/game/PlayerStats";
import { useGameData } from "@/hooks/useGameData";
import { useToast } from "@/hooks/use-toast";
import { Store, Search, Sword, Shield, Wrench, Pill, Star, Coins } from "lucide-react";

// Mock marketplace items for demo
const marketplaceItems = [
  {
    id: "mp-1",
    name: "Chicago Typewriter",
    description: "Professional grade Thompson submachine gun. Favored by serious operators.",
    category: "weapon" as const,
    effect: { attack_power: 20, energy_boost: 3 },
    price: 7500,
    rarity: "epic" as const,
    seller: "VinnyTheShark"
  },
  {
    id: "mp-2",
    name: "Steel Plate Armor",
    description: "Heavy protection for the discerning criminal. Slight mobility reduction.",
    category: "armor" as const,
    effect: { defense_boost: 15, max_health: 30 },
    price: 6000,
    rarity: "rare" as const,
    seller: "ToughTony"
  },
  {
    id: "mp-3",
    name: "Golden Horseshoe",
    description: "Extremely rare lucky charm. Increases fortune in all endeavors.",
    category: "utility" as const,
    effect: { steal_chance: 10, xp_multiplier: 1.25 },
    price: 15000,
    rarity: "legendary" as const,
    seller: "LuckyLou"
  },
  {
    id: "mp-4",
    name: "Brass Knuckles",
    description: "Simple but effective close combat enhancement.",
    category: "weapon" as const,
    effect: { attack_power: 8 },
    price: 1200,
    rarity: "common" as const,
    seller: "StreetVendor"
  },
  {
    id: "mp-5",
    name: "Adrenaline Shot",
    description: "Emergency medical stimulant. Instant health and energy boost.",
    category: "consumable" as const,
    effect: { health_boost: 50, energy_boost: 5 },
    price: 800,
    rarity: "common" as const,
    seller: "DocHoliday"
  }
];

const categoryIcons = {
  weapon: Sword,
  armor: Shield,
  utility: Wrench,
  consumable: Pill,
  special: Star,
};

function MarketplacePage() {
  const { player } = useGameData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"price" | "rarity" | "name">("price");

  const filteredItems = marketplaceItems
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      // Sort by rarity: legendary > epic > rare > common
      const rarityOrder = { legendary: 4, epic: 3, rare: 2, common: 1 };
      return rarityOrder[b.rarity] - rarityOrder[a.rarity];
    });

  const handlePurchase = (item: typeof marketplaceItems[0]) => {
    if (player.currency < item.price) {
      toast({
        title: "Insufficient funds",
        description: `You need $${(item.price - player.currency).toLocaleString()} more to buy this item.`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Purchase successful!",
      description: `You bought ${item.name} for $${item.price.toLocaleString()}`,
    });
  };

  const categories = ["all", "weapon", "armor", "utility", "consumable", "special"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Black Market</h1>
        <PlayerStats player={player} className="w-80" />
      </div>

      {/* Filters and Search */}
      <Card className="bg-gradient-empire border-primary shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Store className="h-5 w-5" />
            Browse Items
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category === "all" ? "All" : category}
                </Button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex gap-2">
              <Button
                variant={sortBy === "price" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("price")}
              >
                Price
              </Button>
              <Button
                variant={sortBy === "rarity" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("rarity")}
              >
                Rarity
              </Button>
              <Button
                variant={sortBy === "name" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("name")}
              >
                Name
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const CategoryIcon = categoryIcons[item.category];
          const canAfford = player.currency >= item.price;
          
          return (
            <Card 
              key={item.id}
              className="bg-gradient-empire border-primary shadow-card transition-all hover:shadow-gold"
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
                <p className="text-sm text-muted-foreground">Sold by {item.seller}</p>
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

                {/* Price and Purchase */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="flex items-center gap-1">
                    <Coins className="h-4 w-4 text-currency" />
                    <span className={`font-bold ${canAfford ? 'text-currency' : 'text-destructive'}`}>
                      ${item.price.toLocaleString()}
                    </span>
                  </div>
                  <Button
                    onClick={() => handlePurchase(item)}
                    variant={canAfford ? "luxury" : "outline"}
                    size="sm"
                    disabled={!canAfford}
                  >
                    {canAfford ? "Buy Now" : "Can't Afford"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <Card className="bg-gradient-empire border-primary shadow-card">
          <CardContent className="py-12 text-center">
            <Store className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Items Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or category filters.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Selling Notice */}
      <Card className="bg-gradient-luxury border-accent shadow-card">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <Store className="h-5 w-5 text-accent-foreground" />
            <div>
              <h3 className="font-medium text-accent-foreground">Want to Sell Items?</h3>
              <p className="text-sm text-accent-foreground/80">
                Item selling functionality will be available soon. For now, focus on building your criminal empire!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Marketplace() {
  return (
    <GameLayout>
      <MarketplacePage />
    </GameLayout>
  );
}