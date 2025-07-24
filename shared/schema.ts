import { pgTable, text, serial, integer, boolean, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Main users table (for authentication)
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// Game profiles table (extends users with game data)
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  username: text("username").notNull().unique(),
  level: integer("level").default(1).notNull(),
  xp: integer("xp").default(0).notNull(),
  health: integer("health").default(100).notNull(),
  max_health: integer("max_health").default(100).notNull(),
  energy: integer("energy").default(100).notNull(),
  max_energy: integer("max_energy").default(100).notNull(),
  currency: integer("currency").default(1000).notNull(),
  is_kidnapped: boolean("is_kidnapped").default(false).notNull(),
  kidnap_release_at: timestamp("kidnap_release_at"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Game items table
export const gameItems = pgTable("game_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // weapon, armor, utility, consumable, special
  effect: jsonb("effect").default({}).notNull(),
  price: integer("price").default(0).notNull(),
  rarity: text("rarity").notNull(), // common, rare, epic, legendary
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// User items table (inventory)
export const userItems = pgTable("user_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  item_id: uuid("item_id").references(() => gameItems.id, { onDelete: "cascade" }).notNull(),
  equipped: boolean("equipped").default(false).notNull(),
  quantity: integer("quantity").default(1).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// Battles table
export const battles = pgTable("battles", {
  id: uuid("id").primaryKey().defaultRandom(),
  attacker_id: uuid("attacker_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  defender_id: uuid("defender_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  winner_id: uuid("winner_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  attacker_snapshot: jsonb("attacker_snapshot").notNull(),
  defender_snapshot: jsonb("defender_snapshot").notNull(),
  reward_currency: integer("reward_currency").default(0).notNull(),
  reward_item_id: uuid("reward_item_id").references(() => gameItems.id),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// Marketplace listings table
export const marketplaceListings = pgTable("marketplace_listings", {
  id: uuid("id").primaryKey().defaultRandom(),
  item_id: uuid("item_id").references(() => gameItems.id, { onDelete: "cascade" }).notNull(),
  seller_id: uuid("seller_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  price: integer("price").notNull(),
  active: boolean("active").default(true).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// Zod schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertGameItemSchema = createInsertSchema(gameItems).omit({
  id: true,
  created_at: true,
});

export const insertUserItemSchema = createInsertSchema(userItems).omit({
  id: true,
  created_at: true,
});

export const insertBattleSchema = createInsertSchema(battles).omit({
  id: true,
  created_at: true,
});

export const insertMarketplaceListingSchema = createInsertSchema(marketplaceListings).omit({
  id: true,
  created_at: true,
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type GameItem = typeof gameItems.$inferSelect;
export type InsertGameItem = z.infer<typeof insertGameItemSchema>;
export type UserItem = typeof userItems.$inferSelect;
export type InsertUserItem = z.infer<typeof insertUserItemSchema>;
export type Battle = typeof battles.$inferSelect;
export type InsertBattle = z.infer<typeof insertBattleSchema>;
export type MarketplaceListing = typeof marketplaceListings.$inferSelect;
export type InsertMarketplaceListing = z.infer<typeof insertMarketplaceListingSchema>;
