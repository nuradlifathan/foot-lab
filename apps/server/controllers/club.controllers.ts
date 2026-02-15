
import { Context } from 'hono'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Create a new club (FM Style)
export const createClub = async (c: Context) => {
  try {
    const data = await c.req.json()
    
    // Basic validation
    if (!data.name) {
      return c.json({ error: 'Club name is required' }, 400)
    }

    const club = await prisma.club.create({
      data: {
        name: data.name,
        nickname: data.nickname, 
        city: data.city || 'Unknown',
        yearFounded: Number(data.yearFounded) || 2024,
        stadiumName: data.stadiumName || `${data.name} Stadium`,
        stadiumCap: Number(data.stadiumCap) || 5000,
        primaryColor: data.primaryColor || '#000000',
        secondaryColor: data.secondaryColor || '#ffffff',
        formation: data.formation || '4-4-2',
        
        // Initial values
        menang: 0, seri: 0, kalah: 0,
        goal_masuk: 0, goal_kemasukan: 0, point: 0,
        balance: 1000000
      }
    })
    return c.json(club)
  } catch (err) {
    console.error(err)
    return c.json({ error: 'Failed to create club' }, 500)
  }
}

// Get Club Details (Dashboard/Overview)
export const getClubById = async (c: Context) => {
  try {
    const id = Number(c.req.param('id'))
    if (isNaN(id)) return c.json({ error: 'Invalid ID' }, 400)

    const club = await prisma.club.findUnique({
      where: { id },
      include: {
        _count: { select: { players: true } }
      }
    })

    if (!club) return c.json({ error: 'Club not found' }, 404)
    return c.json(club)
  } catch (err) {
    console.error(err)
    return c.json({ error: 'Failed to fetch club' }, 500)
  }
}

// Get All Clubs (Dropdowns/List)
export const getAllClubs = async (c: Context) => {
  try {
    const clubs = await prisma.club.findMany({
      where: { gameId: null }, // Only fetch Master Data (Real Clubs)
      select: { 
        id: true, 
        name: true, 
        city: true, 
        primaryColor: true, 
        secondaryColor: true, 
        logo: true,
        leagueId: true 
      },
      orderBy: { name: 'asc' }
    })
    return c.json(clubs)
  } catch (err) {
    console.error(err)
    return c.json({ error: 'Failed to fetch clubs' }, 500)
  }
}
// Get Leagues with Country info
export const getLeagues = async (c: Context) => {
  try {
    const leagues = await prisma.league.findMany({
      include: { country: true },
      orderBy: { tier: 'asc' }
    })
    return c.json(leagues)
  } catch (err) {
    console.error(err)
    return c.json({ error: 'Failed to fetch leagues' }, 500)
  }
}
// Update Tactics (Formation & Lineup)
export const updateTactics = async (c: Context) => {
  try {
    const clubId = Number(c.req.param('id'))
    const { formation, lineup } = await c.req.json() // lineup: { playerId: number, lineupPos: string }[]

    if (isNaN(clubId)) return c.json({ error: 'Invalid Club ID' }, 400)

    // 1. Update Club Formation
    if (formation) {
      await prisma.club.update({
        where: { id: clubId },
        data: { formation }
      })
    }

    // 2. Update Players Lineup (Bulk)
    if (lineup && Array.isArray(lineup)) {
      // First, reset all players in this club to bench (or null) if we want strict control?
      // Better: Just update the ones sent.
      // But how to handle players moved TO bench? They should have lineupPos: null
      
      // Transaction to ensure consistency
      await prisma.$transaction(
        lineup.map((p: any) => 
          prisma.player.update({
            where: { id: p.playerId },
            data: { lineupPos: p.lineupPos }
          })
        )
      )
    }

    return c.json({ success: true })
  } catch (err) {
    console.error(err)
    return c.json({ error: 'Failed to update tactics' }, 500)
  }
}
