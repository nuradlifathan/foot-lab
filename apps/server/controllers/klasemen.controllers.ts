import { Context } from 'hono'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const createClubs = async (c: Context) => {
  try {
    const { name } = await c.req.json()
    const club = await prisma.club.create({
      data: {
        name,
        // main: 0, // Calculated
        menang: 0,
        seri: 0,
        kalah: 0,
        goal_masuk: 0,
        goal_kemasukan: 0,
        point: 0,
      }
    })
    return c.json(club)
  } catch (err) {
    console.error(err)
    return c.json({ error: 'Failed to create club' }, 500)
  }
}

export const inputScore = async (c: Context) => {
  try {
    const { ClubId, opponent_name, score } = await c.req.json()
    console.log({ ClubId, opponent_name, score })

    const club = await prisma.club.findUnique({ where: { id: ClubId } })
    if (!club) {
      return c.json({ message: 'Club not found' }, 404)
    }

    const [homeScore, awayScore] = score.split('-').map(Number)

    // Find the opponent club
    const opponent = await prisma.club.findFirst({ where: { name: opponent_name } })
    if (!opponent) {
      return c.json({ message: 'Opponent not found' }, 404)
    }

    // Deprecated match model? Let's keep it for now as per user request to fix lines
    // But schema says Match.opponent_name exists. 
    await prisma.match.create({
      data: {
        clubId: ClubId,
        opponent_name,
        score,
      }
    })

    // Update home team statistics
    const updatedClub = await prisma.club.update({
      where: { id: ClubId },
      data: {
        // main: club.main + 1, // Derived
        goal_masuk: club.goal_masuk + homeScore,
        goal_kemasukan: club.goal_kemasukan + awayScore,
        menang: homeScore > awayScore ? club.menang + 1 : club.menang,
        seri: homeScore === awayScore ? club.seri + 1 : club.seri,
        kalah: homeScore < awayScore ? club.kalah + 1 : club.kalah,
        point: homeScore > awayScore ? club.point + 3 : (homeScore === awayScore ? club.point + 1 : club.point),
      }
    })

    // Update opponent team statistics
    const updatedOpponent = await prisma.club.update({
      where: { id: opponent.id },
      data: {
        // main: opponent.main + 1, // Derived
        goal_masuk: opponent.goal_masuk + awayScore,
        goal_kemasukan: opponent.goal_kemasukan + homeScore,
        menang: homeScore < awayScore ? opponent.menang + 1 : opponent.menang,
        seri: homeScore === awayScore ? opponent.seri + 1 : opponent.seri,
        kalah: homeScore > awayScore ? opponent.kalah + 1 : opponent.kalah,
        point: homeScore < awayScore ? opponent.point + 3 : (homeScore === awayScore ? opponent.point + 1 : opponent.point),
      }
    })

    return c.json({ club: updatedClub, opponent: updatedOpponent })
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Error inputting score' }, 500)
  }
}

export const viewKlasemen = async (c: Context) => {
  try {
    const clubId = c.req.query('clubId')
    let whereClause = {}

    // If clubId is provided, filter by the game that club belongs to
    if (clubId) {
      const club = await prisma.club.findUnique({
        where: { id: Number(clubId) },
        select: { gameId: true, leagueId: true }
      })
      
      if (club && club.gameId) {
        whereClause = { 
          gameId: club.gameId,
          // leagueId: club.leagueId // Optional: if we have multiple leagues
        } 
      }
    }

    const klasemen = await prisma.club.findMany({
      where: whereClause,
      orderBy: [
        { point: 'desc' },
        { goal_masuk: 'desc' },
        { name: 'asc' },
      ],
    })
    return c.json(
      klasemen.map((club, index) => ({
        no: index + 1,
        id: club.id,
        klub: club.name,
        logo: club.logo,
        main: club.menang + club.seri + club.kalah, // Calculate played matches
        menang: club.menang,
        seri: club.seri,
        kalah: club.kalah,
        goal_masuk: club.goal_masuk,
        goal_kemasukan: club.goal_kemasukan,
        point: club.point,
      }))
    )
  } catch (err) {
    console.error(err)
    return c.json({ error: 'Failed to get klasemen' }, 500)
  }
}

// Phase 2: AI Match Engine
import { simulateMatch } from '../lib/matchEngine'

export const getAllClub = async (c: Context) => {
  try {
    const clubs = await prisma.club.findMany({
      select: { id: true, name: true },
    })
    return c.json(clubs)
  } catch (err) {
    console.error(err)
    return c.json({ error: 'Failed to get clubs' }, 500)
  }
}

export const runMatchSimulation = async (c: Context) => {
  try {
    const { homeId, awayId } = await c.req.json()
    
    if (!homeId || !awayId) {
      return c.json({ error: 'homeId and awayId are required' }, 400)
    }

    const result = await simulateMatch(Number(homeId), Number(awayId))
    
    return c.json(result)
  } catch (err) {
    console.error(`[runMatchSimulation] Error: ${err instanceof Error ? err.message : String(err)}`)
    return c.json({ error: 'Failed to simulate match' }, 500)
  }
}
