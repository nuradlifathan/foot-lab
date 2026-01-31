
import { Hono } from 'hono'
import { createPlayer, getPlayersByClub, updatePlayer, deletePlayer, generateRandomPlayer } from '../controllers/player.controllers'

const player = new Hono()

player.post('/create', createPlayer)
player.post('/generate', generateRandomPlayer)
player.get('/club/:clubId', getPlayersByClub)
player.put('/:id', updatePlayer)
player.delete('/:id', deletePlayer)

export default player
