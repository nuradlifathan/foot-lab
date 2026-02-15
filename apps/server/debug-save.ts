
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🕵️‍♀️ DIAGNOSTIC START')

  // 1. List all Games and their Managed Club
  const games = await prisma.game.findMany({
    include: {
      clubs: {
        where: { name: { in: ['Arsenal', 'Brentford'] } },
        select: { id: true, name: true, gameId: true }
      }
    }
  })

  console.log(`\nFound ${games.length} save games:`)
  
  for (const game of games) {
    console.log(`\n🎮 Game ID: ${game.id}`)
    console.log(`   Manager: ${game.managerName}`)
    console.log(`   Managed Club ID: ${game.managedClubId}`)
    
    // Find name of managed club
    const managedClub = await prisma.club.findUnique({
        where: { id: game.managedClubId || 0 },
        select: { id: true, name: true }
    })
    console.log(`   => ACTUAL Managed Club: ${managedClub?.name} (ID: ${managedClub?.id})`)

    console.log(`   Clubs in this save:`)
    game.clubs.forEach(c => {
        console.log(`     - ${c.name}: ID ${c.id}`)
    })
  }

  // 2. Check explicitly IDs 300 and 303 if they exist
  console.log('\n🔍 Checking specfic IDs:')
  const c300 = await prisma.club.findUnique({ where: { id: 300 }, select: { id: true, name: true, gameId: true } })
  const c303 = await prisma.club.findUnique({ where: { id: 303 }, select: { id: true, name: true, gameId: true } })
  
  console.log(`   ID 300: ${c300?.name} (Game: ${c300?.gameId})`)
  console.log(`   ID 303: ${c303?.name} (Game: ${c303?.gameId})`)
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
