# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Servers

**Terminal 1 - Partykit:**
```bash
npm run party:dev
```

**Terminal 2 - Next.js:**
```bash
npm run dev
```

### 3. Open Browser
Go to http://localhost:4000

### 4. Test Multiplayer
1. Click "Create Game" on one browser/device
2. Copy the room code from the URL
3. Open another browser/device
4. Go to the same URL but change `?role=host` to `?role=guest`
5. Both players enter names and start playing!

## 📝 Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_PARTYKIT_HOST=localhost:1999
PARTYKIT_PROJECT_ID=your-project-id
```

## 🎮 How to Play

1. **Host** creates a game room
2. **Host** shares the room link with guest
3. Both players enter their names
4. Host starts the game
5. Play through 3 rounds:
   - **Mr & Mrs**: Answer questions about your partner
   - **Confidence Trivia**: Guess numbers with tyre strategy
   - **What Happened Next?**: Watch F1 clips and predict outcomes
6. Player with most Pit Coins wins!

## 🔧 Host Controls

Host has access to admin panel (🔧 button):
- Jump to any round/question
- Adjust coin totals
- Reset power-ups
- Skip questions
- Force reveal answers
- End game early

## 🚀 Deploy to Production

See `DEPLOYMENT.md` for full instructions.

Quick version:
1. Deploy Partykit: `npm run party:deploy`
2. Get Partykit host URL
3. Deploy to Vercel with environment variables
4. Done!

## 🐛 Common Issues

**Can't connect to game:**
- Make sure Partykit dev server is running
- Check `NEXT_PUBLIC_PARTYKIT_HOST` in `.env.local`

**State not syncing:**
- Refresh both browsers
- Check browser console for errors
- Verify both players are in same room

**Build errors:**
- Run `npm install` again
- Delete `node_modules` and `.next` folder, then reinstall

