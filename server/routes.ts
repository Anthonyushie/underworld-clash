import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProfileSchema, insertBattleSchema, insertUserItemSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Game data routes
  
  // Get current player profile
  app.get("/api/profile/:userId", async (req, res) => {
    try {
      const profile = await storage.getProfile(req.params.userId);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to get profile" });
    }
  });

  // Update player profile
  app.patch("/api/profile/:userId", async (req, res) => {
    try {
      const updates = req.body;
      const profile = await storage.updateProfile(req.params.userId, updates);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // Get all profiles for leaderboard
  app.get("/api/profiles", async (req, res) => {
    try {
      const profiles = await storage.getAllProfiles();
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ error: "Failed to get profiles" });
    }
  });

  // Get opponents (other players for battles)
  app.get("/api/opponents/:userId", async (req, res) => {
    try {
      const allProfiles = await storage.getAllProfiles();
      const opponents = allProfiles.filter(p => p.user_id !== req.params.userId);
      res.json(opponents);
    } catch (error) {
      res.status(500).json({ error: "Failed to get opponents" });
    }
  });

  // Get all game items
  app.get("/api/items", async (req, res) => {
    try {
      const items = await storage.getAllGameItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to get items" });
    }
  });

  // Get user's inventory
  app.get("/api/user-items/:userId", async (req, res) => {
    try {
      const userItems = await storage.getUserItems(req.params.userId);
      
      // Fetch the full item details for each user item
      const itemsWithDetails = await Promise.all(
        userItems.map(async (userItem) => {
          const item = await storage.getGameItem(userItem.item_id);
          return { ...userItem, item };
        })
      );
      
      res.json(itemsWithDetails);
    } catch (error) {
      res.status(500).json({ error: "Failed to get user items" });
    }
  });

  // Equip/unequip an item
  app.patch("/api/user-items/:itemId/equip", async (req, res) => {
    try {
      const { equipped } = req.body;
      const userItem = await storage.updateUserItem(req.params.itemId, { equipped });
      res.json(userItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to update item" });
    }
  });

  // Create a battle
  app.post("/api/battles", async (req, res) => {
    try {
      const battleData = insertBattleSchema.parse(req.body);
      const battle = await storage.createBattle(battleData);
      
      // Update both players' stats after battle
      if (battle.winner_id === battle.attacker_id) {
        // Attacker won - give rewards
        await storage.updateProfile(battle.attacker_id, {
          energy: req.body.attacker_energy_after,
          xp: req.body.attacker_xp_after,
          currency: req.body.attacker_currency_after,
        });
        
        // Defender lost - reduce health/energy
        await storage.updateProfile(battle.defender_id, {
          health: req.body.defender_health_after,
          energy: req.body.defender_energy_after,
        });
      } else {
        // Defender won - attacker loses health/energy
        await storage.updateProfile(battle.attacker_id, {
          health: req.body.attacker_health_after,
          energy: req.body.attacker_energy_after,
        });
      }
      
      res.json(battle);
    } catch (error) {
      res.status(500).json({ error: "Failed to create battle" });
    }
  });

  // Get user's battle history
  app.get("/api/battles/:userId", async (req, res) => {
    try {
      const battles = await storage.getBattlesByUser(req.params.userId);
      res.json(battles);
    } catch (error) {
      res.status(500).json({ error: "Failed to get battles" });
    }
  });

  // Get marketplace listings
  app.get("/api/marketplace", async (req, res) => {
    try {
      const listings = await storage.getActiveMarketplaceListings();
      
      // Fetch item details for each listing
      const listingsWithDetails = await Promise.all(
        listings.map(async (listing) => {
          const item = await storage.getGameItem(listing.item_id);
          const seller = await storage.getProfile(listing.seller_id);
          return { ...listing, item, seller };
        })
      );
      
      res.json(listingsWithDetails);
    } catch (error) {
      res.status(500).json({ error: "Failed to get marketplace listings" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);

  return httpServer;
}
