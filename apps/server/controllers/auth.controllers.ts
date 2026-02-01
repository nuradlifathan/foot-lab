
import { Context } from 'hono'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_dont_use_in_prod'

export const register = async (c: Context) => {
  try {
    const { email, password, name } = await c.req.json()

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400)
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return c.json({ error: 'User already exists' }, 400)
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'USER' // Always default to USER
      }
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return c.json({ message: 'User created successfully', user: userWithoutPassword }, 201)
  } catch (err) {
    console.error(err)
    return c.json({ error: 'Failed to register user' }, 500)
  }
}

export const login = async (c: Context) => {
  try {
    const { email, password } = await c.req.json()

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400)
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    const { password: _, ...userWithoutPassword } = user

    return c.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    })
  } catch (err) {
    console.error(err)
    return c.json({ error: 'Failed to login' }, 500)
  }
}

export const me = async (c: Context) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader) {
      return c.json({ error: 'No token provided' }, 401)
    }

    const token = authHeader.split(' ')[1] // Bearer <token>
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any
      const user = await prisma.user.findUnique({ where: { id: decoded.id } })

      if (!user) {
        return c.json({ error: 'User not found' }, 404)
      }

      const { password: _, ...userWithoutPassword } = user
      return c.json(userWithoutPassword)
    } catch (err) {
      return c.json({ error: 'Invalid token' }, 401)
    }
  } catch (err) {
    console.error(err)
    return c.json({ error: 'Failed to verify user' }, 500)
  }
}
