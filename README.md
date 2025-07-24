# YakuzHonne - Criminal Empire Game

A web-based PvP criminal game built for the YakiHonne platform, featuring player battles, inventory management, marketplace trading, and leaderboards.

## 🎮 Game Features

- **Player Management**: User profiles with stats, levels, health, energy, and currency
- **Inventory System**: Collect and equip weapons, armor, and special items
- **PvP Arena**: Battle other players to earn rewards and climb the leaderboard
- **Marketplace**: Buy and sell items with other players
- **Leaderboard**: Compete for the top spots in the criminal underworld
- **Real-time Updates**: Live stats and battle results

## 🏗️ Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side navigation
- **UI Components**: shadcn/ui with Tailwind CSS
- **State Management**: React Query for server state, React hooks for local state
- **Build Tool**: Vite for fast development and building

### Backend
- **Server**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **API**: RESTful endpoints for all game operations
- **Authentication**: YakiHonne SDK integration

### YakiHonne SDK Integration
- **Smart Widget Handler**: Seamless communication with YakiHonne platform
- **Nostr Authentication**: Decentralized identity and signing
- **Payment Integration**: Lightning Network payments
- **Event Publishing**: Nostr event broadcasting

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- YakiHonne platform account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd criminal-game
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Database connection (automatically configured in Replit)
   DATABASE_URL=your_postgresql_connection_string
   ```

4. **Initialize the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: 320px - 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: 1024px+

### Mobile-First Approach
- Touch-friendly interface with appropriately sized buttons
- Collapsible sidebar navigation
- Optimized card layouts for small screens
- Responsive typography and spacing

### Key Responsive Components
- `ResponsiveGameLayout`: Main layout with adaptive header and sidebar
- `ResponsiveWrapper`: Container with mobile-first padding and spacing
- `ResponsiveGrid`: Flexible grid system with device-specific columns
- `ResponsiveCard`: Cards with adaptive padding and margins

## 🎯 YakiHonne SDK Integration

### Authentication Flow
```typescript
import { useYakiHonne } from '@/components/yakihonne/YakiHonneProvider';

function GameComponent() {
  const { user, isReady, signEvent, publishEvent } = useYakiHonne();
  
  // Component automatically receives user data from YakiHonne
  // All Nostr events are handled through the SDK
}
```

### Event Publishing
The game publishes key events to the Nostr network:
- Battle results
- Achievement unlocks
- High scores
- Item acquisitions

### Payment Integration
Lightning Network payments for:
- Premium items
- Battle entry fees
- Tournament participation

## 🗄️ Database Schema

### Core Tables
- **users**: Player profiles and stats
- **items**: Game items with effects and rarity
- **user_items**: Player inventory with equipped status
- **battles**: PvP battle history and results
- **marketplace_listings**: Player-to-player item sales

### Schema Management
```bash
# Push schema changes
npm run db:push

# Generate migrations (if needed)
npm run db:generate

# View database
npm run db:studio
```

## 🔌 API Endpoints

### Authentication
- `GET /api/profile/:userId` - Get user profile
- `POST /api/profile` - Create/update profile

### Inventory
- `GET /api/user-items/:userId` - Get player inventory
- `PATCH /api/user-items/:itemId/equip` - Equip/unequip item

### Combat
- `GET /api/opponents/:userId` - Get available opponents
- `POST /api/battles` - Execute battle
- `GET /api/battles/:userId` - Get battle history

### Marketplace
- `GET /api/marketplace` - Get all listings
- `POST /api/marketplace` - Create listing
- `DELETE /api/marketplace/:listingId` - Remove listing

### Leaderboard
- `GET /api/profiles` - Get all player profiles (ranked)

## 🎨 Theming and Styling

### Color Scheme
```css
:root {
  --primary: hsl(20, 14.3%, 4.1%);      /* Dark empire theme */
  --secondary: hsl(60, 4.5%, 25.9%);    /* Muted gold */
  --accent: hsl(12, 6.5%, 15.1%);       /* Warm dark */
  --rarity-common: hsl(0, 0%, 70%);     /* Gray */
  --rarity-rare: hsl(220, 90%, 60%);    /* Blue */
  --rarity-epic: hsl(270, 90%, 60%);    /* Purple */
  --rarity-legendary: hsl(45, 90%, 60%); /* Gold */
}
```

### Custom Components
- Empire-themed gradients
- Rarity-based item coloring
- Interactive hover effects
- Smooth transitions and animations

## 🚀 Deployment

### Replit Deployment
1. **Project Setup**: Already configured for Replit environment
2. **Database**: PostgreSQL automatically provisioned
3. **Environment**: All secrets managed through Replit
4. **Deploy**: Use Replit's one-click deployment

### YakiHonne Smart Widget Deployment
1. **Build for Production**
   ```bash
   npm run build
   ```

2. **Configure Smart Widget**
   - Register widget with YakiHonne platform
   - Set up Nostr relay connections
   - Configure Lightning payment endpoints

3. **Deploy to YakiHonne**
   - Upload built assets
   - Configure widget metadata
   - Set permissions and access controls

### Environment Variables
```bash
# Database (auto-configured in Replit)
DATABASE_URL=postgresql://...
PGHOST=...
PGPORT=...
PGDATABASE=...
PGUSER=...
PGPASSWORD=...

# Optional: Custom configurations
NODE_ENV=production
PORT=5000
```

## 🔧 Development Guide

### Project Structure
```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Route components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   └── types/         # TypeScript definitions
├── server/                 # Backend Express application
│   ├── routes.ts          # API route handlers
│   ├── storage.ts         # Database abstraction layer
│   ├── db.ts             # Database connection
│   └── index.ts          # Server entry point
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Drizzle database schema
└── docs/                  # Documentation
```

### Adding New Features
1. **Database**: Update `shared/schema.ts` with new tables
2. **API**: Add routes in `server/routes.ts`
3. **Frontend**: Create components and pages
4. **Types**: Update TypeScript definitions
5. **Tests**: Add appropriate test coverage

### Code Style
- TypeScript strict mode enabled
- ESLint and Prettier configured
- Consistent naming conventions
- Comprehensive error handling

## 🧪 Testing

### Unit Tests
```bash
# Run frontend tests
npm run test:client

# Run backend tests  
npm run test:server
```

### Integration Tests
```bash
# Run full test suite
npm test
```

### Manual Testing Checklist
- [ ] User registration and profile creation
- [ ] Item equipping and inventory management
- [ ] Battle system and rewards
- [ ] Marketplace transactions
- [ ] Leaderboard updates
- [ ] Mobile responsiveness
- [ ] YakiHonne SDK integration

## 🐛 Troubleshooting

### Common Issues

**Database Connection Errors**
- Verify `DATABASE_URL` is set correctly
- Check PostgreSQL service status
- Run `npm run db:push` to sync schema

**YakiHonne SDK Issues**
- Ensure widget is properly registered
- Check Nostr relay connectivity
- Verify authentication flow

**Build Errors**
- Clear `node_modules` and reinstall
- Check TypeScript compilation errors
- Verify all dependencies are compatible

**Performance Issues**
- Enable React Query devtools
- Monitor database query performance
- Check bundle size and optimize imports

### Debug Mode
```bash
# Enable verbose logging
DEBUG=* npm run dev

# Database debugging
DEBUG=drizzle:* npm run dev
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

- **YakiHonne Platform**: [yakihonne.com](https://yakihonne.com)
- **Documentation**: [yakihonne.com/docs](https://yakihonne.com/docs)
- **Community**: Join the YakiHonne Discord server

---

Built with ❤️ for the YakiHonne Hackathon