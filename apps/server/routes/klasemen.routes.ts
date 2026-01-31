import { Hono } from 'hono'
import * as klasemenControllers from '../controllers/klasemen.controllers'

const router = new Hono()

// Create Club
router.post('/create', klasemenControllers.createClubs)
// Input Score
router.post('/input-score', klasemenControllers.inputScore)
// View Klasemen
router.get('/klasemen', klasemenControllers.viewKlasemen)
// Get All Club
router.get('/', klasemenControllers.getAllClub)
// Simulate Match
router.post('/simulate', klasemenControllers.runMatchSimulation)

export default router
