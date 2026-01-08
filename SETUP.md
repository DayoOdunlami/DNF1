# Setup Instructions

## Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm
- GitHub account
- Vercel account (free tier works)
- Partykit account (free tier works)

## Initial Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_PARTYKIT_HOST=localhost:1999
   PARTYKIT_PROJECT_ID=your-project-id
   ```

3. **Start development servers:**

   Terminal 1 (Partykit):
   ```bash
   npm run party:dev
   ```

   Terminal 2 (Next.js):
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to http://localhost:4000

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── page.tsx           # Landing page (Create/Join)
│   ├── game/[roomId]/     # Game room page
│   └── layout.tsx          # Root layout
├── components/
│   └── game/              # Game components
│       ├── Lobby.tsx
│       ├── GameBoard.tsx
│       ├── Scoreboard.tsx
│       ├── PowerupsPanel.tsx
│       ├── AdminPanel.tsx
│       ├── Results.tsx
│       └── rounds/         # Round-specific components
├── lib/                    # Utilities and game logic
│   ├── types.ts           # TypeScript types
│   ├── questions.ts       # Game questions data
│   ├── gameState.ts       # State management
│   ├── gameLogic.ts       # Point calculations
│   └── utils.ts           # Helper functions
├── party/                  # Partykit server
│   └── index.ts          # Real-time game server
└── public/                 # Static assets
```

## Key Features

✅ Real-time multiplayer via Partykit
✅ Room-based game system with shareable links
✅ Host admin controls
✅ Three game rounds (Mr & Mrs, Confidence Trivia, Video)
✅ Power-up system
✅ F1-themed design
✅ Mobile responsive

## Next Steps

1. Deploy Partykit server (see DEPLOYMENT.md)
2. Deploy to Vercel (see DEPLOYMENT.md)
3. Test with two devices/browsers
4. Customize questions in `lib/questions.ts`
5. Adjust styling in `tailwind.config.ts` and components

## Troubleshooting

**Port already in use:**
- Change Next.js port: `npm run dev -- -p 3001`
- Change Partykit port: Update `party.json` or use `--port` flag

**WebSocket connection fails:**
- Check that Partykit dev server is running
- Verify `NEXT_PUBLIC_PARTYKIT_HOST` is correct
- Check browser console for errors

**Type errors:**
- Run `npm install` to ensure all types are installed
- Check that TypeScript version matches package.json

