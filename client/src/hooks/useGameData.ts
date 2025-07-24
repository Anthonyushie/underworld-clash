import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GameUser, GameItem, UserItem, Battle, MarketplaceListing } from "@/types/game";
import { apiRequest } from "@/lib/queryClient";

// Current user ID - in a real app this would come from authentication
const CURRENT_USER_ID = "user-1";

export function useGameData() {
  const queryClient = useQueryClient();

  // Query for current player profile
  const { data: player } = useQuery<GameUser>({
    queryKey: ["profile", CURRENT_USER_ID],
    queryFn: () => apiRequest(`/api/profile/${CURRENT_USER_ID}`),
    initialData: {
      id: CURRENT_USER_ID,
      username: "DonCorleone",
      level: 5,
      xp: 750,
      health: 85,
      max_health: 100,
      energy: 7,
      max_energy: 10,
      currency: 25000,
      is_kidnapped: false,
    }
  });

  // Query for user's items
  const { data: userItems = [] } = useQuery<UserItem[]>({
    queryKey: ["user-items", CURRENT_USER_ID],
    queryFn: () => apiRequest(`/api/user-items/${CURRENT_USER_ID}`),
  });

  // Query for opponents
  const { data: opponents = [] } = useQuery<GameUser[]>({
    queryKey: ["opponents", CURRENT_USER_ID],
    queryFn: () => apiRequest(`/api/opponents/${CURRENT_USER_ID}`),
  });

  // Query for leaderboard
  const { data: leaderboard = [] } = useQuery<GameUser[]>({
    queryKey: ["profiles"],
    queryFn: () => apiRequest("/api/profiles"),
  });

  // Query for battles
  const { data: battles = [] } = useQuery<Battle[]>({
    queryKey: ["battles", CURRENT_USER_ID],
    queryFn: () => apiRequest(`/api/battles/${CURRENT_USER_ID}`),
  });

  // Query for marketplace
  const { data: marketplace = [] } = useQuery<MarketplaceListing[]>({
    queryKey: ["marketplace"],
    queryFn: () => apiRequest("/api/marketplace"),
  });

  // Mutation for equipping items
  const equipItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const userItem = userItems.find(ui => ui.item_id === itemId);
      if (!userItem) throw new Error("Item not found");
      
      return apiRequest(`/api/user-items/${userItem.id}/equip`, {
        method: "PATCH",
        body: JSON.stringify({ equipped: !userItem.equipped }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-items", CURRENT_USER_ID] });
    },
  });

  // Mutation for attacking players
  const attackPlayerMutation = useMutation({
    mutationFn: async (defenderId: string) => {
      if (player.energy < 1) throw new Error("Not enough energy");

      const defender = opponents.find(o => o.id.includes(defenderId));
      if (!defender) throw new Error("Defender not found");

      const attackerPower = userItems
        .filter(ui => ui.equipped)
        .reduce((power, ui) => power + (ui.item?.effect.attack_power || 0), player.level * 5);
      
      const defenderPower = defender.level * 5;
      const victory = attackerPower > defenderPower || Math.random() > 0.5;
      const rewardCurrency = victory ? 500 : 0;

      const battleData = {
        attacker_id: CURRENT_USER_ID,
        defender_id: defenderId,
        winner_id: victory ? CURRENT_USER_ID : defenderId,
        attacker_snapshot: { level: player.level, power: attackerPower },
        defender_snapshot: { level: defender.level, power: defenderPower },
        reward_currency: rewardCurrency,
        // Additional fields for updating player stats
        attacker_energy_after: player.energy - 1,
        attacker_xp_after: victory ? player.xp + defender.level * 20 : player.xp,
        attacker_currency_after: victory ? player.currency + rewardCurrency : player.currency,
        attacker_health_after: victory ? player.health : Math.max(player.health - 20, 0),
        defender_health_after: victory ? Math.max(defender.health - 15, 0) : defender.health,
        defender_energy_after: defender.energy,
      };

      return apiRequest("/api/battles", {
        method: "POST",
        body: JSON.stringify(battleData),
      });
    },
    onSuccess: () => {
      // Invalidate relevant queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["profile", CURRENT_USER_ID] });
      queryClient.invalidateQueries({ queryKey: ["battles", CURRENT_USER_ID] });
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
    },
  });

  const equipItem = (itemId: string) => {
    equipItemMutation.mutate(itemId);
  };

  const attackPlayer = (defenderId: string) => {
    attackPlayerMutation.mutate(defenderId);
    return true; // For backwards compatibility
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