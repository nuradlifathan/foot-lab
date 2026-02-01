import 'dotenv/config'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import klasemenRoutes from './routes/klasemen.routes'
import footballRoutes from './routes/football.routes'
import playerRoutes from './routes/player.routes'
import authRoutes from './routes/auth.routes' // Added authRoutes import

import clubRoutes from './routes/club.routes'
import gameRoutes from './routes/game.routes'
import { jwt } from 'hono/jwt'


const app = new Hono().basePath('/api')

app.use('/*', cors()) // Changed '*' to '/*'
app.route('/klub', klasemenRoutes)
// app.route('/football', footballRoutes) // Removed footballRoutes registration
app.route('/player', playerRoutes)
app.route('/auth', authRoutes) // Added authRoutes registration
app.route('/club', clubRoutes)

// Protected Routes
app.use('/game/*', jwt({ 
  secret: process.env.JWT_SECRET || 'fallback_secret_dont_use_in_prod',
  alg: 'HS256'
}))
app.route('/game', gameRoutes)


// Health check
app.get('/health', (c) => c.json({ status: 'ok' }))

export default app
