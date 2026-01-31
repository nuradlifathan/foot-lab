
import { Hono } from 'hono'
import * as authController from '../controllers/auth.controllers'

const router = new Hono()

router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/me', authController.me)

export default router
