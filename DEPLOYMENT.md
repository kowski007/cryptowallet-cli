# Deployment Guide

Deploy the Crypto Wallet Generator to production in various environments.

## Quick Deploy to Vercel (Recommended)

Vercel is the creator of Next.js and provides the optimal hosting environment.

### Option 1: Using Vercel CLI (5 minutes)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel (opens browser)
vercel login

# Deploy from project directory
vercel

# Follow prompts:
# - Link to existing project or create new
# - Confirm project directory
# - Ready! Your app is live
```

Your app will be live at `https://your-project-name.vercel.app`

### Option 2: GitHub Integration (Automatic Deployments)

1. Push your code to GitHub:
```bash
git add .
git commit -m "Add web UI for wallet generator"
git push origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Select your GitHub repository
5. Click "Deploy"
6. Automatic deployments on every push!

### Option 3: Vercel Dashboard

1. Visit [vercel.com/new](https://vercel.com/new)
2. Connect your GitHub account
3. Select the cryptowallet-cli repository
4. Click "Deploy"

## Deploy to Other Platforms

### Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Build Next.js app
COPY . .
RUN npm run build

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]
```

Build and run:
```bash
# Build image
docker build -t wallet-generator .

# Run container
docker run -p 3000:3000 wallet-generator
```

### AWS Deployment

#### Option A: AWS Amplify

```bash
# Install AWS Amplify CLI
npm install -g @aws-amplify/cli

# Initialize project
amplify init

# Deploy
amplify publish
```

#### Option B: AWS EC2

1. Launch an EC2 instance (Ubuntu 20.04+)
2. SSH into instance
3. Install Node.js:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. Clone and build:
```bash
git clone <your-repo>
cd cryptowallet-cli
npm install
npm run build
npm start
```

5. Use PM2 to keep it running:
```bash
npm install -g pm2
pm2 start "npm start"
pm2 startup
pm2 save
```

#### Option C: AWS Lambda + API Gateway

For serverless deployment, use `serverless` framework:
```bash
npm install -g serverless
serverless create --template aws-nodejs
# Configure and deploy
```

### Google Cloud Run

```bash
# Create Dockerfile (see above)

# Build and push to Google Container Registry
docker build -t gcr.io/PROJECT_ID/wallet-generator .
docker push gcr.io/PROJECT_ID/wallet-generator

# Deploy to Cloud Run
gcloud run deploy wallet-generator \
  --image gcr.io/PROJECT_ID/wallet-generator \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### DigitalOcean App Platform

1. Push code to GitHub
2. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
3. Click "Create App"
4. Select GitHub repository
5. Configure environment
6. Click "Deploy"

### Heroku (Legacy, but still works)

```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login

# Create app
heroku create wallet-generator

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Self-Hosted (Linux Server)

1. **Prerequisites**:
   - Node.js 18+
   - Nginx or Apache (reverse proxy)
   - SSL certificate (Let's Encrypt)

2. **Setup**:
```bash
# SSH to server
ssh user@your-server.com

# Clone repo
git clone <your-repo>
cd cryptowallet-cli

# Install dependencies
npm install

# Build
npm run build

# Create .env.local if needed
echo "NODE_ENV=production" > .env.local
```

3. **Nginx Configuration**:

Create `/etc/nginx/sites-available/wallet-generator`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/wallet-generator /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

4. **Start Application**:

Use PM2:
```bash
npm install -g pm2
pm2 start npm --name "wallet-generator" -- start
pm2 startup
pm2 save
```

5. **SSL with Let's Encrypt**:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Environment Variables

### Development (`.env.local`)
```env
NODE_ENV=development
```

### Production

Set these in your deployment platform:

**Vercel Dashboard**:
1. Project Settings → Environment Variables
2. Add variables
3. Redeploy

**Other Platforms**:
- AWS: System Manager → Parameter Store
- GCP: Cloud Build → Build Step Environment Variables
- Docker: Pass with `-e` flag or `.env` file
- Heroku: `heroku config:set VAR_NAME=value`

## Performance Optimization

### For Production

1. **Enable Compression**:
```javascript
// next.config.js
module.exports = {
  compress: true,
};
```

2. **Image Optimization**:
Next.js handles automatic image optimization

3. **API Caching**:
The chains list rarely changes, consider caching:
```typescript
// In route.ts
export const revalidate = 3600; // Cache for 1 hour
```

## Monitoring

### Vercel Analytics
- Automatic performance monitoring
- Error tracking
- Real-time logs

### Self-Hosted Monitoring

Install PM2 Plus:
```bash
pm2 plus
```

Use DataDog, New Relic, or Sentry for error tracking.

## Scaling for High Traffic

### Database of Wallets (Optional)

If you need to store generated wallets:
1. Add database (PostgreSQL, MongoDB)
2. Add authentication
3. Implement wallet storage and retrieval
4. Add rate limiting

### Rate Limiting

For production, add rate limiting:
```typescript
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 h'),
});

export async function POST(request) {
  const { success } = await ratelimit.limit(request.ip);
  if (!success) {
    return NextResponse.json({ error: 'Rate limited' }, { status: 429 });
  }
  // ... rest of handler
}
```

## Backup & Recovery

### Backup Strategy

Your application is stateless, so:
- **Code**: Backup via GitHub (push regularly)
- **Configuration**: Store `.env` in secure location
- **User Data**: Not applicable (stateless)

### Recovery Steps

1. Code recovery: `git clone` and redeploy
2. Configuration recovery: Restore `.env` variables
3. No database to recover

## SSL/HTTPS

- **Vercel**: Automatic SSL for all deployments
- **AWS**: Use AWS Certificate Manager
- **GCP**: Managed certificates built-in
- **Self-hosted**: Use Let's Encrypt (free)
- **DigitalOcean**: Automatic with domain

## Domain Setup

### For Vercel
1. Project Settings → Domains
2. Add your domain
3. Update DNS records at registrar

### For Other Platforms
Standard CNAME or A record pointing to your app

## Troubleshooting Deployment

### Port Already in Use
```bash
# Kill process on port 3000
lsof -i :3000
kill -9 <PID>
```

### Out of Memory
Increase Node.js memory:
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm start
```

### Slow Wallet Generation
- Check server CPU/RAM
- Reduce wallet generation batch size
- Scale to more powerful instance

### Build Failures
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

## Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Environment variables configured
- [ ] `.env.local` created locally (not in git)
- [ ] Build succeeds: `npm run build`
- [ ] Dev server works: `npm run dev`
- [ ] Test wallet generation
- [ ] Test export (CSV/TXT)
- [ ] SSL certificate valid
- [ ] Domain configured
- [ ] Monitoring enabled
- [ ] Backups configured (code/config)

## Support

For deployment issues:
1. Check logs in your platform dashboard
2. Run `npm run build` locally to catch errors
3. Review Next.js documentation
4. Check Node.js version compatibility (18+)

## Next.js Deployment Documentation

For more details, see [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
