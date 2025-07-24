# YakuzHonne - Deployment Guide

## Overview
This deployment guide covers how to deploy the YakuzHonne criminal game to various platforms, with specific focus on YakiHonne Smart Widget integration and Replit deployment.

## Prerequisites

### For All Deployments
- Node.js 18+ 
- PostgreSQL database
- Environment variables configured

### For YakiHonne Smart Widget Deployment
- YakiHonne platform account
- Nostr keypair for widget signing
- Domain for hosting the widget
- YakiHonne SDK integration (already included)

## Environment Configuration

Create the following environment variables:

```bash
# Database (auto-configured in Replit)
DATABASE_URL=postgresql://username:password@host:port/database
PGHOST=your-pg-host
PGPORT=5432
PGDATABASE=your-database-name
PGUSER=your-username
PGPASSWORD=your-password

# Application
NODE_ENV=production
PORT=5000

# YakiHonne Smart Widget (optional)
YAKIHONNE_WIDGET_ID=your-widget-id
NOSTR_PRIVATE_KEY=your-nostr-private-key
YAKIHONNE_RELAY_URL=wss://relay.yakihonne.com
```

## Replit Deployment

### 1. Database Setup
The PostgreSQL database is automatically provisioned in Replit with all necessary environment variables.

### 2. Initialize Database Schema
```bash
npm run db:push
```

This command will:
- Create all necessary tables
- Set up relationships and indexes
- Apply any schema migrations

### 3. Deploy via Replit Deployments
1. Click the "Deploy" button in the Replit interface
2. Configure domain settings (optional)
3. Set up custom domain if needed
4. Monitor deployment status

The application will be available at:
- `https://your-repl-name.your-username.replit.app`
- Custom domain (if configured)

### 4. Health Checks
Replit automatically configures:
- Health check endpoints
- SSL/TLS certificates
- Load balancing
- Auto-scaling

## YakiHonne Smart Widget Deployment

### 1. Widget Registration
Register your widget with YakiHonne platform:

```json
{
  "name": "YakuzHonne Criminal Game",
  "description": "Build your criminal empire in this strategic PvP game",
  "version": "1.0.0",
  "author": "Your Name",
  "categories": ["game", "strategy", "pvp"],
  "iframe_url": "https://your-domain.com",
  "permissions": [
    "nostr:sign",
    "nostr:publish",
    "lightning:pay",
    "user:profile"
  ]
}
```

### 2. Smart Widget Configuration
The application includes built-in YakiHonne SDK integration:

```typescript
// Already implemented in components/yakihonne/YakiHonneProvider.tsx
import { YakiHonneProvider } from '@/components/yakihonne/YakiHonneProvider';

// Wrap your app
<YakiHonneProvider>
  <App />
</YakiHonneProvider>
```

### 3. Nostr Event Configuration
The game publishes these event types:
- Kind 1: Game updates and achievements
- Kind 30023: Game state snapshots
- Kind 31001: Battle results
- Custom kinds: Item transactions, leaderboard updates

### 4. Widget Deployment Steps
1. **Build Production Assets**
   ```bash
   npm run build
   ```

2. **Upload to CDN/Hosting**
   - Use any static hosting provider
   - Ensure HTTPS is enabled
   - Configure CORS headers for iframe embedding

3. **Update Widget Metadata**
   - Set iframe_url to your hosted domain
   - Configure required permissions
   - Test widget functionality

4. **Submit for Review**
   - Submit widget to YakiHonne marketplace
   - Wait for approval process
   - Monitor widget performance

## Self-Hosted Deployment

### 1. Server Requirements
- **CPU**: 2+ cores recommended
- **RAM**: 4GB+ recommended
- **Storage**: 20GB+ SSD
- **OS**: Ubuntu 20.04+ or CentOS 8+

### 2. Installation
```bash
# Clone repository
git clone <repository-url>
cd yakuzhonne-game

# Install dependencies
npm install

# Build application
npm run build

# Set up database
npm run db:push
```

### 3. Process Management
Use PM2 for production process management:

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start npm --name "yakuzhonne" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

### 4. Reverse Proxy (Nginx)
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Database Deployment

### 1. Production Database Setup
For production deployments, consider:
- **Managed PostgreSQL** (recommended): AWS RDS, Google Cloud SQL, or DigitalOcean Managed Databases
- **Self-hosted**: PostgreSQL 14+ with proper backup and monitoring

### 2. Database Migration
```bash
# Production schema deployment
NODE_ENV=production npm run db:push

# Verify tables and data
npm run db:studio
```

### 3. Backup Strategy
```bash
# Automated daily backups
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Restore from backup
psql $DATABASE_URL < backup-20240124.sql
```

## Performance Optimization

### 1. Frontend Optimization
```bash
# Build with optimization
npm run build

# Analyze bundle size
npm run analyze
```

### 2. Backend Optimization
- Enable database connection pooling
- Implement Redis caching for session data
- Use CDN for static assets
- Enable gzip compression

### 3. Database Optimization
```sql
-- Create indexes for performance
CREATE INDEX idx_user_items_user_id ON user_items(user_id);
CREATE INDEX idx_battles_attacker_id ON battles(attacker_id);
CREATE INDEX idx_battles_defender_id ON battles(defender_id);
CREATE INDEX idx_battles_timestamp ON battles(timestamp);
```

## Monitoring and Logging

### 1. Application Monitoring
- **Uptime monitoring**: Use services like Pingdom or StatusCake
- **Performance monitoring**: Implement New Relic or DataDog
- **Error tracking**: Use Sentry for error monitoring

### 2. Database Monitoring
- Monitor connection pool usage
- Track slow queries
- Set up alerts for high CPU/memory usage

### 3. Logging Configuration
```javascript
// Production logging setup
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## Security Considerations

### 1. Environment Security
- Never commit `.env` files
- Use secrets management (Replit Secrets, AWS Secrets Manager)
- Rotate API keys regularly

### 2. Database Security
- Use connection pooling with SSL
- Implement Row Level Security (RLS)
- Regular security updates

### 3. Application Security
- HTTPS only in production
- CORS configuration for iframe embedding
- Input validation and sanitization
- Rate limiting for API endpoints

## Troubleshooting

### Common Issues

**Database Connection Errors**
```bash
# Check connection
npm run db:check

# Reset connection pool
npm run db:reset
```

**Build Failures**
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

**YakiHonne SDK Issues**
- Verify iframe permissions in YakiHonne dashboard
- Check Nostr relay connectivity
- Validate event signing configuration

### Performance Issues
- Monitor database query performance
- Check for memory leaks in long-running processes
- Optimize bundle size and loading times

## Maintenance

### Regular Tasks
1. **Weekly**: Monitor logs and performance metrics
2. **Monthly**: Update dependencies and security patches
3. **Quarterly**: Review and optimize database performance
4. **Annually**: Security audit and penetration testing

### Backup and Recovery
- Automated daily database backups
- Test restore procedures monthly
- Document recovery procedures
- Maintain offsite backup copies

## Support and Documentation

### Resources
- **YakiHonne Developer Docs**: [yakihonne.com/docs](https://yakihonne.com/docs)
- **Replit Deployments**: [docs.replit.com/deployments](https://docs.replit.com/deployments)
- **PostgreSQL Documentation**: [postgresql.org/docs](https://postgresql.org/docs)

### Getting Help
- YakiHonne Discord community
- Replit community forums
- GitHub issues for bug reports
- Stack Overflow for technical questions

---

**Last Updated**: January 24, 2025
**Version**: 1.0.0