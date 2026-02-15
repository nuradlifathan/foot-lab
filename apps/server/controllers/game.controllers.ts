
import { Context } from 'hono'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Create New Game (Start Career)
export const createGame = async (c: Context) => {
  try {
    const userId = c.get('jwtPayload')?.id
    const { managerName, clubId } = await c.req.json()

    if (!userId) return c.json({ error: 'Unauthorized' }, 401)
    if (!managerName || !clubId) return c.json({ error: 'Manager name and Club are required' }, 400)

    // Validate if the Club ID exists in Master Data first
    const targetMasterClub = await prisma.club.findUnique({
      where: { id: Number(clubId) }
    })
    
    if (!targetMasterClub || targetMasterClub.gameId !== null) {
      console.warn(`❌ Rejected Invalid Club Creation. User sent ID: ${clubId}. Master Found: ${targetMasterClub?.id} (GameId: ${targetMasterClub?.gameId})`)
      return c.json({ error: `Selected Club (ID: ${clubId}) is invalid or outdated. Hard Refresh to fix.` }, 400)
    }

    console.log(`🎮 Creating new save for user ${userId} managing club ${clubId}...`)

    // 1. Create Game Record
    const game = await prisma.game.create({
      data: {
        userId,
        managerName,
        currentDate: new Date('2024-07-01'), // Season start
        managedClubId: Number(clubId) // Will link to the *cloned* club ID later? No, usually manage the Game version.
        // Wait, we need to create the game FIRST to get the gameId. 
        // Then we clone everything.
        // Then we update managedClubId to point to the NEW club record (not the master one).
      }
    })

    const gameId = game.id
    console.log(`✅ Game ID created: ${gameId}`)

    // 2. Clone Logic
    // Strategy: Reuse Master Country & League (World Constants).
    // Only Clone Clubs & Players (Stateful Entities).
    
    // Fetch Master Clubs
    const masterClubs = await prisma.club.findMany({
      where: { gameId: null },
      include: { players: { where: { gameId: null } } }
    })

    console.log(`📦 Cloning ${masterClubs.length} clubs and their players...`)

    let newManagedClubId: number | null = null

    for (const club of masterClubs) {
      // Create Club Clone
      const newClub = await prisma.club.create({
        data: {
          name: club.name,
          nickname: club.nickname,
          city: club.city,
          yearFounded: club.yearFounded,
          stadiumName: club.stadiumName,
          stadiumCap: club.stadiumCap,
          primaryColor: club.primaryColor,
          secondaryColor: club.secondaryColor,
          balance: club.balance,
          reputation: club.reputation,
          formation: club.formation,
          
          gameId: gameId, // Belong to this save
          
          leagueId: club.leagueId, // Link to Shared Master League
          countryId: club.countryId, // Link to Shared Master Country
          
          // Reset Season Stats
          menang: 0, seri: 0, kalah: 0,
          goal_masuk: 0, goal_kemasukan: 0, point: 0
        }
      })

      // Check if this is the user's chosen club
      if (club.id === Number(clubId)) {
        newManagedClubId = newClub.id
      }

      // Clone Players for this Club
      if (club.players && club.players.length > 0) {
        const playerData = club.players.map(p => ({
            gameId, // Belong to this save
            clubId: newClub.id,
            countryId: p.countryId, // Link to Shared Master Country
            
            name: p.name,
            position: p.position,
            age: p.age,
            dob: p.dob,
            
            pace: p.pace,
            shooting: p.shooting,
            passing: p.passing,
            dribbling: p.dribbling,
            defending: p.defending,
            physical: p.physical,
            stamina: p.stamina,
            overall: p.overall,
            potential: p.potential,
            
            marketValue: p.marketValue
        }))

        await prisma.player.createMany({
          data: playerData
        })
      }
    }

    // 3. Update Game with the NEW Managed Club ID
    if (newManagedClubId) {
      await prisma.game.update({
        where: { id: gameId },
        data: { managedClubId: newManagedClubId }
      })
    } else {
      console.warn('⚠️ Warning: Managed Club ID not found in cloned data')
    }

    console.log('🎉 Game Generation Complete!')
    
    return c.json({ 
      message: 'New Game Started', 
      gameId, 
      managedClubId: newManagedClubId 
    })

  } catch (err) {
    console.error(err)
    return c.json({ error: 'Failed to create game' }, 500)
  }
}

// Load List of Games
export const getMyGames = async (c: Context) => {
  try {
    const userId = c.get('jwtPayload')?.id
    if (!userId) return c.json({ error: 'Unauthorized' }, 401)

    const games = await prisma.game.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        // We can't include relation easily if it's dynamic, 
        // but we can fetch the club name manually or if relation exists
        // managedClubId is Int, but no direct relation in schema yet? 
        // Let's check schema.
      }
    })

    // Manual fetch of club names for the UI?
    // Or just return basic info first
    
    // Enrich with club name
    const enrichedGames = await Promise.all(games.map(async (g) => {
      let clubName = 'Unemployed'
      if (g.managedClubId) {
        const club = await prisma.club.findUnique({ where: { id: g.managedClubId } })
        if (club) clubName = club.name
      }
      return { ...g, clubName }
    }))

    return c.json(enrichedGames)
  } catch (err) {
    console.error(err)
    return c.json({ error: 'Failed to fetch games' }, 500)
  }
}

// Get Single Game State (Load Game)
// Save Game (Update Last Played)
export const saveGame = async (c: Context) => {
  try {
    const gameId = c.req.param('id')
    const userId = c.get('jwtPayload')?.id
    
    // Authorization check
    const game = await prisma.game.findFirst({
        where: { id: gameId, userId }
    })
    
    if (!game) return c.json({ error: 'Game not found or unauthorized' }, 404)

    await prisma.game.update({
        where: { id: gameId },
        data: { updatedAt: new Date() } // Just touch the timestamp
    })

    return c.json({ message: 'Game Saved Successfully', savedAt: new Date() })
  } catch (err) {
    console.error(err)
    return c.json({ error: 'Failed to save game' }, 500)
  }
}

export const loadGame = async (c: Context) => {
    // Return game meta
    return c.json({ message: 'Load logic here' })
}

// Delete Game (Hard Delete)
export const deleteGame = async (c: Context) => {
    try {
        const gameId = c.req.param('id')
        const userId = c.get('jwtPayload')?.id
        
        // Authorization check
        const game = await prisma.game.findFirst({
            where: { id: gameId, userId }
        })
        
        if (!game) return c.json({ error: 'Game not found or unauthorized' }, 404)
    
        // Hard Delete (Cascade will handle related data)
        await prisma.game.delete({
            where: { id: gameId }
        })
    
        return c.json({ message: 'Game Deleted Successfully' })
    } catch (err) {
        console.error(err)
        return c.json({ error: 'Failed to delete game' }, 500)
    }
}
