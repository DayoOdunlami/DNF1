# Deployment Guide

## Quick Start

This app requires two deployments:
1. **Partykit** - Real-time game server
2. **Vercel** - Next.js frontend

## Step-by-Step Deployment

### 1. Deploy Partykit Server

```bash
# Install Partykit CLI globally (if not already installed)
npm install -g partykit

# Login to Partykit
npx partykit login

# Deploy the server
npm run party:deploy
```

After deployment, you'll get a host URL like: `your-party.username.partykit.dev`

### 2. Set Up GitHub Repository

1. Initialize git (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Connect to your GitHub repo:
   ```bash
   git remote add origin https://github.com/DayoOdunlami/DNF1.git
   git branch -M main
   git push -u origin main
   ```

### 3. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository (`DayoOdunlami/DNF1`)
4. Configure environment variables:
   - `NEXT_PUBLIC_PARTYKIT_HOST` = Your Partykit host URL
   - `PARTYKIT_PROJECT_ID` = Your Partykit project ID
5. Click "Deploy"

### 4. Update Partykit Configuration (if needed)

If your Vercel domain changes, you may need to update CORS settings in Partykit dashboard.

## Testing Locally

1. Start Partykit dev server:
   ```bash
   npm run party:dev
   ```

2. In another terminal, start Next.js:
   ```bash
   npm run dev
   ```

3. Open http://localhost:3000

## Troubleshooting

### Connection Issues

- Make sure `NEXT_PUBLIC_PARTYKIT_HOST` is set correctly
- Check that Partykit server is running
- Verify WebSocket connections aren't blocked by firewall

### State Not Syncing

- Check browser console for WebSocket errors
- Verify Partykit server logs
- Ensure both players are connected to the same room

### Build Errors

- Run `npm install` to ensure all dependencies are installed
- Check that TypeScript types are correct
- Verify all environment variables are set

