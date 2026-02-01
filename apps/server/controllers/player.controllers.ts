import { Context } from 'hono'
import { PrismaClient } from '@prisma/client'
import { generateStats, generatePreferredFoot } from '../lib/generators/stats'

const prisma = new PrismaClient()

// Helper to random pick from db results
const pickRandom = <T>(arr: T[]): T | null => arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : null

// New Helper: Fetch random name from DB
const getRandomName = async (country: string) => {
  // fetching all names for country (efficient enough for <1000 rows per country)
  const firstNames = await prisma.nameAsset.findMany({ where: { country, type: 'FIRST' } })
  const lastNames = await prisma.nameAsset.findMany({ where: { country, type: 'LAST' } })

  // Fallback to EN if empty
  if (firstNames.length === 0 || lastNames.length === 0) {
    if (country !== 'EN') return getRandomName('EN')
    return { first: 'John', last: 'Doe' }
  }

  const first = pickRandom(firstNames)?.value || 'Unknown'
  const last = pickRandom(lastNames)?.value || 'Player'
  return { first, last }
}

// Generate Random Player
export const generateRandomPlayer = async (c: Context) => {
  try {
    const { clubId, position, country } = await c.req.json()

    if (!clubId || !position) {
      return c.json({ error: 'Missing clubId or position' }, 400)
    }

    // 1. Resolve Country
    let selectedCountry = country || 'EN' // Default
    
    // 2. Fetch Name from DB
    const { first, last } = await getRandomName(selectedCountry)
    const fullName = `${first} ${last}`

    // 3. Generate Stats
    const stats = generateStats(position)
    
    // 4. Preferred Foot (Note: Temporarily removed from DB schema, but kept in logic for future)
    // const preferredFoot = generatePreferredFoot()

    // 5. Create Player in DB
    const player = await prisma.player.create({
      data: {
        clubId: Number(clubId),
        name: fullName,
        position,
        // preferredFoot, // Removed from schema
        ...stats
      }
    })

    return c.json({ ...player, country: selectedCountry })
  } catch (err) {
    console.error(err)
    return c.json({ error: 'Failed to generate player' }, 500)
  }
}

// Bulk Generate Squad
export const generateSquad = async (c: Context) => {
  try {
    const { clubId, country } = await c.req.json()

    if (!clubId) {
      return c.json({ error: 'Missing clubId' }, 400)
    }

    // Squad Composition (25 Players)
    const roles = [
      'GK', 'GK', 'GK',
      'CB', 'CB', 'CB', 'CB', 'LB', 'LB', 'RB', 'RB',
      'CDM', 'CDM', 'CM', 'CM', 'CM', 'CM', 'CAM', 'CAM',
      'LW', 'LW', 'RW', 'RW', 'ST', 'ST'
    ]

    // 1. Resolve Country
    const selectedCountry = country || 'EN'

    // 2. Fetch All Names for this country Once
    const firstNames = await prisma.nameAsset.findMany({ where: { country: selectedCountry, type: 'FIRST' } })
    const lastNames = await prisma.nameAsset.findMany({ where: { country: selectedCountry, type: 'LAST' } })
    
    // Fallback if empty
    const validFirst = firstNames.length > 0 ? firstNames : [{ value: 'John' }]
    const validLast = lastNames.length > 0 ? lastNames : [{ value: 'Doe' }]

    // 3. Generate Data
    const playersData = roles.map(position => {
      // Pick random from memory array
      const fm = validFirst[Math.floor(Math.random() * validFirst.length)].value
      const lm = validLast[Math.floor(Math.random() * validLast.length)].value
      
      const fullName = `${fm} ${lm}`
      const stats = generateStats(position)
      // const preferredFoot = generatePreferredFoot() // Removed from schema

      return {
        clubId: Number(clubId),
        name: fullName,
        position,
        // preferredFoot,
        ...stats
      }
    })

    // 4. Insert Batch
    await prisma.player.createMany({
      data: playersData
    })

    // 5. Fetch & Return
    const newSquad = await prisma.player.findMany({
      where: { clubId: Number(clubId) }
    })

    return c.json({ 
      message: `Successfully recruited ${playersData.length} players from ${selectedCountry}!`,
      squad: newSquad 
    })

  } catch (err) {
    console.error(err)
    return c.json({ error: 'Failed to generate squad' }, 500)
  }
}

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
