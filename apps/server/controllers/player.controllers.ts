import { Context } from 'hono'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Create a new player
export const createPlayer = async (c: Context) => {
  try {
    const data = await c.req.json()
    
    // Validate required fields
    if (!data.clubId || !data.name || !data.position) {
      return c.json({ error: 'Missing required fields: clubId, name, position' }, 400)
    }

    const player = await prisma.player.create({
      data: {
        clubId: Number(data.clubId),
        name: data.name,
        position: data.position,
        pace: data.pace,
        shooting: data.shooting,
        passing: data.passing,
        dribbling: data.dribbling,
        defending: data.defending,
        physical: data.physical,
        stamina: data.stamina,
        overall: data.overall
      }
    })
    
    return c.json(player)
  } catch (err) {
    console.error(err)
    return c.json({ error: 'Failed to create player' }, 500)
  }
}

// Get all players for a specific club
export const getPlayersByClub = async (c: Context) => {
  try {
    const clubIdParam = c.req.param('clubId')
    const clubId = Number(clubIdParam)

    if (isNaN(clubId)) {
      console.error(`[getPlayersByClub] Invalid clubId: ${clubIdParam}`)
      return c.json({ error: 'Invalid Club ID' }, 400)
    }

    console.log(`[getPlayersByClub] Fetching players for clubId: ${clubId}`)
    
    // Check if club exists first? Optional but good for debugging
    
    const players = await prisma.player.findMany({
      where: { clubId },
      orderBy: { position: 'asc' }
    })
    
    console.log(`[getPlayersByClub] Found ${players.length} players`)
    return c.json(players)
  } catch (err) {
    // Clean log for terminal readability
    console.error(`[getPlayersByClub] ❌ Error: ${err instanceof Error ? err.message : String(err)}`)
    
    return c.json({ 
      error: 'Failed to fetch players', 
      details: err instanceof Error ? err.message : String(err) 
    }, 500)
  }
}

// Update player stats
export const updatePlayer = async (c: Context) => {
  try {
    const id = c.req.param('id')
    const data = await c.req.json()

    const player = await prisma.player.update({
      where: { id: Number(id) },
      data: {
        name: data.name,
        position: data.position,
        pace: data.pace,
        shooting: data.shooting,
        passing: data.passing,
        dribbling: data.dribbling,
        defending: data.defending,
        physical: data.physical,
        stamina: data.stamina,
        overall: data.overall
      }
    })

    return c.json(player)
  } catch (err) {
    console.error(err)
    return c.json({ error: 'Failed to update player' }, 500)
  }
}

// Delete player
export const deletePlayer = async (c: Context) => {
  try {
    const id = c.req.param('id')
    
    await prisma.player.delete({
      where: { id: Number(id) }
    })
    
    return c.json({ message: 'Player deleted successfully' })
  } catch (err) {
    console.error(err)
    return c.json({ error: 'Failed to delete player' }, 500)
  }
}
