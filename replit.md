# Criminal Game Project

## Overview
This is a criminal-themed PvP game application originally developed with Lovable that is being migrated to the Replit environment. The game features player battles, inventory management, marketplace trading, and leaderboards.

## Recent Changes
- 2025-01-24: Started Lovable to Replit migration
- Created progress tracker for migration steps
- Identified missing dependencies that need to be installed

## Project Architecture
- **Frontend**: React with TypeScript, Vite, TailwindCSS, shadcn/ui components
- **Backend**: Express.js with TypeScript 
- **Database**: Originally Supabase, migrating to PostgreSQL with Drizzle ORM
- **Routing**: Originally React Router, needs migration to Wouter
- **State Management**: React Query for server state, local state with React hooks

## Current Migration Status
- Phase 1: Install missing dependencies
- Phase 2: Replace Supabase with PostgreSQL/Drizzle
- Phase 3: Replace React Router with Wouter
- Phase 4: Move client-side database calls to server API routes

## User Preferences
- Prefers clear progress updates during migration
- Wants all checklist items marked as completed with [x]