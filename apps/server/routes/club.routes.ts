
import { Hono } from 'hono'
import { createClub, getClubById, getAllClubs } from '../controllers/club.controllers'

const club = new Hono()

club.post('/', createClub)
club.get('/', getAllClubs)
club.get('/:id', getClubById)

export default club
