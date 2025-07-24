# Yakuzonne: Rise of the Inner Syndicate

**Yakuzonne** is a web-based PvP strategy RPG game Blending the burning inner drive of *Yakihonne* with the ruthless structure of *Yakuza*, this game delivers syndicate-style warfare, item-based progression, and territory domination—all built on a fast Supabase stack with real-time updates and a player-driven marketplace.

> “Only those who know themselves can rule the streets.”

---

## Core Features

- **Inventory System** – Equip powerful weapons, armor, tools, and consumables with stackable effects.
- **Dynamic Marketplace** – Trade, sell, and acquire items from other players in a live economy.
- **PvP Battles** – Challenge other players, win loot, energy, or even kidnap them if they’re out of resources.
- **Item Effects Engine** – Apply passive or active item modifiers in combat, regeneration, and economy systems.
- **XP and Leveling System** – Progress through the underworld ranks with experience gained from daily tasks, PvP, and deals.
- **Daily Regeneration Loop** – Auto-regenerate energy and health with customizable cron-based rules.
- **Event Logging** – Every major action—battles, trades, kidnaps—is logged in a persistent player history.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js + Tailwind CSS |
| Backend | Supabase (PostgreSQL + Auth + Realtime) |
| State | Supabase + React Context |
| Cron Jobs | Supabase Edge Functions |
| Hosting | Vercel / Supabase Hosting |

---

## Gameplay Loop

1. **Start with base stats** (Energy, Health, XP, Currency)
2. **Regenerate daily** via automatic loops
3. **Equip items** to boost abilities or unlock new actions
4. **Fight other players** in PvP to earn currency, XP, or loot
5. **Access Marketplace** to buy/sell powerful gear
6. **Progress through XP tiers** and unlock new privileges
7. **Strategize** using limited energy and item effects to climb the leaderboard

---

## Project Structure

```bash
Yakuzonne/
├── components/
│   ├── Inventory/
│   ├── Marketplace/
│   ├── Battle/
│   └── UI/
├── pages/
│   ├── index.tsx
│   ├── battle.tsx
│   └── marketplace.tsx
├── supabase/
│   ├── schema.sql
│   └── functions/
├── lib/
│   ├── utils.ts
│   └── effects-engine.ts
└── README.md


## Roadmap

[x] Inventory, Marketplace, Leaderboard

[x] PvP Battle System with Win/Loss tracking

[x] XP + Leveling System

[x] Daily Regeneration (Energy & Health)

[x] Admin Analytics Dashboard

[ ] Notifications System

[ ] Achievements + Streaks

[ ] BTC/Sats Payments Integration (Optional Future Update)

[ ] NFT-Backed Unique Items (Experimental)






# 1. Clone the repo
git clone https://github.com/yourusername/yakuzonne.git

# 2. Install dependencies
cd yakuzonne && npm install

# 3. Set up Supabase environment
cp .env.example .env.local
# Add your Supabase keys and project URL

# 4. Run locally
npm run dev