import { 
  users, profiles, gameItems, userItems, battles, marketplaceListings,
  type User, type InsertUser, type Profile, type InsertProfile, 
  type GameItem, type InsertGameItem, type UserItem, type InsertUserItem,
  type Battle, type InsertBattle, type MarketplaceListing, type InsertMarketplaceListing
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Profiles
  getProfile(userId: string): Promise<Profile | undefined>;
  getProfileByUsername(username: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile>;
  getAllProfiles(): Promise<Profile[]>;
  
  // Game Items
  getGameItem(id: string): Promise<GameItem | undefined>;
  getAllGameItems(): Promise<GameItem[]>;
  createGameItem(item: InsertGameItem): Promise<GameItem>;
  
  // User Items
  getUserItems(userId: string): Promise<UserItem[]>;
  createUserItem(userItem: InsertUserItem): Promise<UserItem>;
  updateUserItem(id: string, updates: Partial<UserItem>): Promise<UserItem>;
  
  // Battles
  getBattlesByUser(userId: string): Promise<Battle[]>;
  createBattle(battle: InsertBattle): Promise<Battle>;
  
  // Marketplace
  getActiveMarketplaceListings(): Promise<MarketplaceListing[]>;
  createMarketplaceListing(listing: InsertMarketplaceListing): Promise<MarketplaceListing>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private profiles: Map<string, Profile>;
  private gameItems: Map<string, GameItem>;
  private userItems: Map<string, UserItem>;
  private battles: Map<string, Battle>;
  private marketplaceListings: Map<string, MarketplaceListing>;
  
  constructor() {
    this.users = new Map();
    this.profiles = new Map();
    this.gameItems = new Map();
    this.userItems = new Map();
    this.battles = new Map();
    this.marketplaceListings = new Map();
    
    // Seed with initial data
    this.seedInitialData();
  }

  private seedInitialData() {
    // Create initial game items
    const initialItems: GameItem[] = [
      {
        id: "item-1",
        name: "Tommy Gun",
        description: "Classic 1920s submachine gun. Devastating in close combat.",
        category: "weapon",
        effect: { attack_power: 15, energy_boost: 2 },
        price: 5000,
        rarity: "rare",
        created_at: new Date(),
      },
      {
        id: "item-2", 
        name: "Bulletproof Vest",
        description: "Military-grade protection against small arms fire.",
        category: "armor",
        effect: { defense_boost: 10, max_health: 20 },
        price: 3500,
        rarity: "epic",
        created_at: new Date(),
      },
      {
        id: "item-3",
        name: "Lucky Coin",
        description: "An old coin that brings fortune in battles.",
        category: "utility",
        effect: { steal_chance: 5, xp_multiplier: 1.1 },
        price: 8000,
        rarity: "legendary",
        created_at: new Date(),
      }
    ];
    
    initialItems.forEach(item => this.gameItems.set(item.id, item));

    // Create sample user and profile
    const sampleUser: User = {
      id: "user-1",
      username: "DonCorleone",
      password: "hashedpassword",
      created_at: new Date(),
    };
    
    const sampleProfile: Profile = {
      id: "profile-1",
      user_id: "user-1",
      username: "DonCorleone",
      level: 5,
      xp: 750,
      health: 85,
      max_health: 100,
      energy: 7,
      max_energy: 10,
      currency: 25000,
      is_kidnapped: false,
      kidnap_release_at: null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.users.set(sampleUser.id, sampleUser);
    this.profiles.set(sampleProfile.id, sampleProfile);

    // Create sample opponents
    const opponents = [
      {
        id: "user-2",
        username: "ScarfaceAl",
        password: "hashedpassword",
        created_at: new Date(),
      },
      {
        id: "user-3", 
        username: "LuckyLuciano",
        password: "hashedpassword",
        created_at: new Date(),
      }
    ];

    const opponentProfiles: Profile[] = [
      {
        id: "profile-2",
        user_id: "user-2",
        username: "ScarfaceAl",
        level: 4,
        xp: 600,
        health: 70,
        max_health: 95,
        energy: 3,
        max_energy: 8,
        currency: 15000,
        is_kidnapped: false,
        kidnap_release_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "profile-3",
        user_id: "user-3",
        username: "LuckyLuciano", 
        level: 6,
        xp: 900,
        health: 100,
        max_health: 110,
        energy: 5,
        max_energy: 12,
        currency: 35000,
        is_kidnapped: false,
        kidnap_release_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      }
    ];

    opponents.forEach(user => this.users.set(user.id, user));
    opponentProfiles.forEach(profile => this.profiles.set(profile.id, profile));

    // Create sample user items
    const sampleUserItems: UserItem[] = [
      {
        id: "ui-1",
        user_id: "user-1",
        item_id: "item-1",
        equipped: true,
        quantity: 1,
        created_at: new Date(),
      },
      {
        id: "ui-2",
        user_id: "user-1", 
        item_id: "item-2",
        equipped: false,
        quantity: 1,
        created_at: new Date(),
      }
    ];

    sampleUserItems.forEach(item => this.userItems.set(item.id, item));
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = `user-${Date.now()}`;
    const user: User = { 
      ...insertUser, 
      id, 
      created_at: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  // Profiles
  async getProfile(userId: string): Promise<Profile | undefined> {
    return Array.from(this.profiles.values()).find(profile => profile.user_id === userId);
  }

  async getProfileByUsername(username: string): Promise<Profile | undefined> {
    return Array.from(this.profiles.values()).find(profile => profile.username === username);
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const id = `profile-${Date.now()}`;
    const profile: Profile = {
      id,
      user_id: insertProfile.user_id,
      username: insertProfile.username,
      level: insertProfile.level || 1,
      xp: insertProfile.xp || 0,
      health: insertProfile.health || 100,
      max_health: insertProfile.max_health || 100,
      energy: insertProfile.energy || 100,
      max_energy: insertProfile.max_energy || 100,
      currency: insertProfile.currency || 1000,
      is_kidnapped: insertProfile.is_kidnapped || false,
      kidnap_release_at: insertProfile.kidnap_release_at || null,
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.profiles.set(id, profile);
    return profile;
  }

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    const existingProfile = await this.getProfile(userId);
    if (!existingProfile) throw new Error("Profile not found");
    
    const updated: Profile = {
      ...existingProfile,
      ...updates,
      updated_at: new Date(),
    };
    this.profiles.set(existingProfile.id, updated);
    return updated;
  }

  async getAllProfiles(): Promise<Profile[]> {
    return Array.from(this.profiles.values()).sort((a, b) => b.xp - a.xp);
  }

  // Game Items
  async getGameItem(id: string): Promise<GameItem | undefined> {
    return this.gameItems.get(id);
  }

  async getAllGameItems(): Promise<GameItem[]> {
    return Array.from(this.gameItems.values());
  }

  async createGameItem(insertItem: InsertGameItem): Promise<GameItem> {
    const id = `item-${Date.now()}`;
    const item: GameItem = {
      id,
      name: insertItem.name,
      description: insertItem.description || null,
      category: insertItem.category,
      effect: insertItem.effect || {},
      price: insertItem.price || 0,
      rarity: insertItem.rarity,
      created_at: new Date(),
    };
    this.gameItems.set(id, item);
    return item;
  }

  // User Items
  async getUserItems(userId: string): Promise<UserItem[]> {
    return Array.from(this.userItems.values()).filter(item => item.user_id === userId);
  }

  async createUserItem(insertUserItem: InsertUserItem): Promise<UserItem> {
    const id = `ui-${Date.now()}`;
    const userItem: UserItem = {
      id,
      user_id: insertUserItem.user_id,
      item_id: insertUserItem.item_id,
      equipped: insertUserItem.equipped || false,
      quantity: insertUserItem.quantity || 1,
      created_at: new Date(),
    };
    this.userItems.set(id, userItem);
    return userItem;
  }

  async updateUserItem(id: string, updates: Partial<UserItem>): Promise<UserItem> {
    const existing = this.userItems.get(id);
    if (!existing) throw new Error("User item not found");
    
    const updated: UserItem = { ...existing, ...updates };
    this.userItems.set(id, updated);
    return updated;
  }

  // Battles
  async getBattlesByUser(userId: string): Promise<Battle[]> {
    return Array.from(this.battles.values())
      .filter(battle => battle.attacker_id === userId || battle.defender_id === userId)
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
  }

  async createBattle(insertBattle: InsertBattle): Promise<Battle> {
    const id = `battle-${Date.now()}`;
    const battle: Battle = {
      id,
      attacker_id: insertBattle.attacker_id,
      defender_id: insertBattle.defender_id,
      winner_id: insertBattle.winner_id,
      attacker_snapshot: insertBattle.attacker_snapshot,
      defender_snapshot: insertBattle.defender_snapshot,
      reward_currency: insertBattle.reward_currency || 0,
      reward_item_id: insertBattle.reward_item_id || null,
      created_at: new Date(),
    };
    this.battles.set(id, battle);
    return battle;
  }

  // Marketplace
  async getActiveMarketplaceListings(): Promise<MarketplaceListing[]> {
    return Array.from(this.marketplaceListings.values()).filter(listing => listing.active);
  }

  async createMarketplaceListing(insertListing: InsertMarketplaceListing): Promise<MarketplaceListing> {
    const id = `listing-${Date.now()}`;
    const listing: MarketplaceListing = {
      id,
      item_id: insertListing.item_id,
      seller_id: insertListing.seller_id,
      price: insertListing.price,
      active: insertListing.active || true,
      created_at: new Date(),
    };
    this.marketplaceListings.set(id, listing);
    return listing;
  }
}

export const storage = new MemStorage();
