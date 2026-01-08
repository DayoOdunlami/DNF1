# Date Night Grand Prix 🏎️

A real-time multiplayer F1-themed couples quiz game built with Next.js and Partykit.

## Features

- 🎮 Real-time multiplayer gameplay
- 🏎️ F1-themed design with night-race aesthetic
- 🎯 Three unique game rounds (Mr & Mrs, Confidence Trivia, What Happened Next)
- ⚡ Power-ups system (DRS, Safety Car, Red Flag, Hard Tyres, Undercut, Team Radio)
- 👑 Host admin controls
- 📱 Mobile-responsive design

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Partykit** (Real-time sync)
- **Vercel** (Deployment)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm

### Installation

```bash
npm install
```

### Development

Run the Next.js dev server:
```bash
npm run dev
```

Run Partykit dev server (in a separate terminal):
```bash
npm run party:dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_PARTYKIT_HOST=localhost:1999
PARTYKIT_PROJECT_ID=your-project-id
```

For production, set:
```env
NEXT_PUBLIC_PARTYKIT_HOST=your-party.username.partykit.dev
```

## Deployment

### Step 1: Deploy Partykit Server

1. Sign up at [partykit.dev](https://partykit.dev)
2. Run `npx partykit login` to authenticate
3. Deploy the Partykit server:
   ```bash
   npm run party:deploy
   ```
4. Copy your Partykit host URL (e.g., `your-party.username.partykit.dev`)

### Step 2: Deploy to Vercel

1. Push your code to GitHub (connect to https://github.com/DayoOdunlami/DNF1)
2. Import the repository in [Vercel](https://vercel.com)
3. Set environment variables in Vercel:
   - `NEXT_PUBLIC_PARTYKIT_HOST` = your Partykit host URL (from Step 1)
   - `PARTYKIT_PROJECT_ID` = your Partykit project ID
4. Deploy!

### Environment Variables

**Local Development (.env.local):**
```env
NEXT_PUBLIC_PARTYKIT_HOST=localhost:1999
PARTYKIT_PROJECT_ID=your-project-id
```

**Production (Vercel):**
```env
NEXT_PUBLIC_PARTYKIT_HOST=your-party.username.partykit.dev
PARTYKIT_PROJECT_ID=your-project-id
```

## How to Play

1. **Host** creates a game room and gets a shareable link
2. **Guest** joins via the link
3. Both players enter their names
4. Host starts the game
5. Play through 3 rounds of questions
6. Player with most Pit Coins wins!

## License

MIT

