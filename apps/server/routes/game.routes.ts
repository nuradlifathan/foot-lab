
import { Hono } from 'hono'
import { createGame, getMyGames, loadGame } from '../controllers/game.controllers'

const gameRoutes = new Hono()

gameRoutes.post('/', createGame)
gameRoutes.get('/', getMyGames)
gameRoutes.get('/:id', loadGame)

export default gameRoutes
