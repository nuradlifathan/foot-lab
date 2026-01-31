import { Hono } from 'hono'
import { createPlayer, getPlayersByClub, updatePlayer, deletePlayer } from '../controllers/player.controllers'

const player = new Hono()

player.post('/create', createPlayer)
player.get('/club/:clubId', getPlayersByClub)
player.put('/:id', updatePlayer)
player.delete('/:id', deletePlayer)

export default player
