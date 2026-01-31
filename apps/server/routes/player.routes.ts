
import { Hono } from 'hono'
import { createPlayer, getPlayersByClub, updatePlayer, deletePlayer, generateRandomPlayer, generateSquad } from '../controllers/player.controllers'

const player = new Hono()

player.post('/create', createPlayer)
player.post('/generate', generateRandomPlayer)
player.post('/batch-generate', generateSquad)
player.get('/club/:clubId', getPlayersByClub)
player.put('/:id', updatePlayer)
player.delete('/:id', deletePlayer)

export default player
