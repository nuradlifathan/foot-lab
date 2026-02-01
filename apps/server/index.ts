import 'dotenv/config'
import { serve } from '@hono/node-server'
import app from './app'

// For local development only
const PORT = 8000


serve({
  fetch: app.fetch,
  port: PORT
}, () => {
  console.log('\n┌──────────────────────────────────────────────────┐')
  console.log('│  ⚽ Foot Lab Server Started                      │')
  console.log('├──────────────────────────────────────────────────┤')
  console.log(`│  🚀 Frontend : http://localhost:3000             │`)
  console.log(`│  ⚙️  Backend  : http://localhost:${PORT}             │`)
  console.log(`│  💾 Database : Neon Postgres (Port 5432)         │`)
  console.log(`│  🗄️  Prisma   : http://localhost:5555             │`)
  console.log('└──────────────────────────────────────────────────┘\n')
})

