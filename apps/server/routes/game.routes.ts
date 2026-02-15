
import { Hono } from 'hono'
import { createGame, getMyGames, loadGame, saveGame, deleteGame } from '../controllers/game.controllers'

const gameRoutes = new Hono()

gameRoutes.post('/', createGame)
gameRoutes.get('/', getMyGames)
gameRoutes.get('/:id', loadGame)
gameRoutes.put('/:id/save', saveGame)
gameRoutes.delete('/:id', deleteGame)

export default gameRoutes
