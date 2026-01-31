# Foot Lab

Modern football league manager & live standings app.

## Tech Stack
- **Frontend**: Vite + React + TypeScript + shadcn/ui
- **Backend**: Hono (Node.js)
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **UI**: shadcn/ui + Tailwind CSS
- **Form**: React Hook Form + Zod
- **Data Fetching**: TanStack Query

## Features
- 🏆 Real Premier League standings (Football-Data.org API)
- 📝 Custom league management
- 🌙 Dark mode
- 📱 PWA support

## Development

```bash
# Install dependencies
pnpm install

# Run both client and server
pnpm dev

# Run client only (port 3000)
pnpm dev:client

# Run server only (port 8000)
pnpm dev:server
```

## Environment Variables

### Server (.env)
```
DATABASE_URL=postgresql://...
FOOTBALL_API_KEY=your_api_key
```

## Deployment
- **Client**: Vercel
- **Server**: Railway/Render
- **Database**: Neon PostgreSQL
