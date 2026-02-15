
import { Hono } from 'hono'
import { createClub, getClubById, getAllClubs, getLeagues, updateTactics } from '../controllers/club.controllers'

const club = new Hono()

club.post('/', createClub)
club.get('/', getAllClubs)
club.get('/leagues', getLeagues) // Add this before :id
club.get('/:id', getClubById)
club.put('/:id/tactics', updateTactics)

export default club
