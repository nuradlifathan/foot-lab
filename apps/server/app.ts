import 'dotenv/config'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import klasemenRoutes from './routes/klasemen.routes'
import footballRoutes from './routes/football.routes'
import playerRoutes from './routes/player.routes'

const app = new Hono().basePath('/api')

app.use('*', cors())
app.route('/klub', klasemenRoutes)
app.route('/football', footballRoutes)
app.route('/player', playerRoutes)

// Health check
app.get('/health', (c) => c.json({ status: 'ok' }))

export default app
