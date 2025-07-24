import { useState, useEffect } from "react";
import { GameUser, GameItem, UserItem, Battle, MarketplaceListing } from "@/types/game";

// Mock data for development - will be replaced with Supabase integration
const mockPlayer: GameUser = {
  id: "player-1",
  username: "DonCorleone",
  level: 5,
  xp: 750,
  health: 85,
  max_health: 100,
  energy: 7,
  max_energy: 10,
  currency: 25000,
  is_kidnapped: false,
};

const mockItems: GameItem[] = [
  {
    id: "item-1",
    name: "Tommy Gun",
    description: "Classic 1920s submachine gun. Devastating in close combat.",
    category: "weapon",
    effect: { attack_power: 15, energy_boost: 2 },
    price: 5000,
    rarity: "rare",
  },
  {
    id: "item-2",
    name: "Bulletproof Vest",
    description: "Military-grade protection against small arms fire.",
    category: "armor",
    effect: { defense_boost: 10, max_health: 20 },
    price: 3500,
    rarity: "epic",
  },
  {
    id: "item-3",
    name: "Lucky Coin",
    description: "An old coin that brings fortune in battles.",
    category: "utility",
    effect: { steal_chance: 5, xp_multiplier: 1.1 },
    price: 8000,
    rarity: "legendary",
  },
];

const mockUserItems: UserItem[] = [
  {
    id: "ui-1",
    user_id: "player-1",
    item_id: "item-1",
    equipped: true,
    item: mockItems[0],
  },
  {
    id: "ui-2",
    user_id: "player-1",
    item_id: "item-2",
    equipped: false,
    item: mockItems[1],
  },
];

const mockOpponents: GameUser[] = [
  {
    id: "player-2",
    username: "ScarfaceAl",
    level: 4,
    xp: 600,
    health: 70,
    max_health: 95,
    energy: 3,
    max_energy: 8,
    currency: 15000,
    is_kidnapped: false,
  },
  {
    id: "player-3",
    username: "LuckyLuciano",
    level: 6,
    xp: 900,
    health: 100,
    max_health: 110,
    energy: 5,
    max_energy: 12,
    currency: 35000,
    is_kidnapped: false,
  },
];

const mockLeaderboard: GameUser[] = [
  mockOpponents[1],
  mockPlayer,
  mockOpponents[0],
];

export function useGameData() {
  const [player, setPlayer] = useState<GameUser>(mockPlayer);
  const [userItems, setUserItems] = useState<UserItem[]>(mockUserItems);
  const [opponents, setOpponents] = useState<GameUser[]>(mockOpponents);
  const [leaderboard, setLeaderboard] = useState<GameUser[]>(mockLeaderboard);
  const [battles, setBattles] = useState<Battle[]>([]);
  const [marketplace, setMarketplace] = useState<MarketplaceListing[]>([]);

  // Simulate energy/health regeneration
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayer(prev => ({
        ...prev,
        health: Math.min(prev.health + 5, prev.max_health),
        energy: Math.min(prev.energy + 1, prev.max_energy),
      }));
    }, 60000); // 1 minute for demo (real game would be 10 minutes)

    return () => clearInterval(interval);
  }, []);

  const equipItem = (itemId: string) => {
    setUserItems(prev => prev.map(ui => ({
      ...ui,
      equipped: ui.item_id === itemId ? !ui.equipped : ui.equipped
    })));
  };

  const attackPlayer = (defenderId: string) => {
    if (player.energy < 1) return false;

    // Simple battle simulation
    const defender = opponents.find(o => o.id === defenderId);
    if (!defender) return false;

    const attackerPower = userItems
      .filter(ui => ui.equipped)
      .reduce((power, ui) => power + (ui.item?.effect.attack_power || 0), player.level * 5);
    
    const defenderPower = defender.level * 5;
    const victory = attackerPower > defenderPower || Math.random() > 0.5;

    const battle: Battle = {
      id: `battle-${Date.now()}`,
      attacker_id: player.id,
      defender_id: defenderId,
      winner_id: victory ? player.id : defenderId,
      attacker_snapshot: { level: player.level, power: attackerPower },
      defender_snapshot: { level: defender.level, power: defenderPower },
      reward_currency: victory ? 500 : 0,
      timestamp: new Date().toISOString(),
    };

    setBattles(prev => [battle, ...prev].slice(0, 10));

    if (victory) {
      setPlayer(prev => ({
        ...prev,
        energy: prev.energy - 1,
        xp: prev.xp + defender.level * 20,
        currency: prev.currency + 500,
      }));
    } else {
      setPlayer(prev => ({
        ...prev,
        energy: prev.energy - 1,
        health: Math.max(prev.health - 20, 0),
      }));
    }

    return true;
  };

  return {
    player,
    userItems,
    opponents,
    leaderboard,
    battles,
    marketplace,
    equipItem,
    attackPlayer,
  };
}