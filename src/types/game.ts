export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export type ItemCategory = 'weapon' | 'armor' | 'utility' | 'consumable' | 'special';

export interface ItemEffect {
  energy_boost?: number;
  health_boost?: number;
  attack_power?: number;
  defense_boost?: number;
  energy_regen?: number;
  health_regen?: number;
  xp_multiplier?: number;
  steal_chance?: number;
  max_energy?: number;
  max_health?: number;
}

export interface GameItem {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  effect: ItemEffect;
  price: number;
  rarity: Rarity;
}

export interface UserItem {
  id: string;
  user_id: string;
  item_id: string;
  equipped: boolean;
  item?: GameItem;
}

export interface GameUser {
  id: string;
  username: string;
  level: number;
  xp: number;
  health: number;
  max_health: number;
  energy: number;
  max_energy: number;
  currency: number;
  is_kidnapped: boolean;
  kidnap_release_at?: string;
}

export interface Battle {
  id: string;
  attacker_id: string;
  defender_id: string;
  winner_id: string;
  attacker_snapshot: any;
  defender_snapshot: any;
  reward_currency: number;
  reward_item_id?: string;
  timestamp: string;
}

export interface MarketplaceListing {
  id: string;
  item_id: string;
  seller_id: string;
  price: number;
  item?: GameItem;
  seller?: GameUser;
}

export interface EventLog {
  id: string;
  user_id: string;
  type: string;
  details: any;
  created_at: string;
}