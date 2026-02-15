
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🕵️‍♀️ Investigating active saves...')

  // 1. Find the game where the user is managing Brentford (or ID 303)
  // We'll look for any game where the managed club is named "Brentford"
  // OR just look for the game with managedClubId = 303 mentioned by user
  
  // Let's search by the ID 303 first to be sure
  const brentfordClone = await prisma.club.findUnique({
      where: { id: 303 },
      include: { game: true }
  })

  if (!brentfordClone || !brentfordClone.gameId) {
      console.log('❌ Could not find a game/club with ID 303. Trying generic search...')
  } else {
      console.log(`✅ Found Save Game! ID: ${brentfordClone.gameId}`)
      console.log(`   User is currently managing: ${brentfordClone.name} (ID: ${brentfordClone.id})`)

      // 2. Find Arsenal in this SAME game
      const arsenalClone = await prisma.club.findFirst({
          where: {
              gameId: brentfordClone.gameId,
              name: 'Arsenal'
          }
      })

      if (arsenalClone) {
          console.log(`   Found Arsenal Clone: ID ${arsenalClone.id}`)
          
          // 3. Swap!
          await prisma.game.update({
              where: { id: brentfordClone.gameId },
              data: { managedClubId: arsenalClone.id }
          })
          
          console.log(`🎉 SWAPPED! User is now managing Arsenal (ID: ${arsenalClone.id}).`)
          console.log(`PLEASE REDIRECT USER TO: /dashboard/${arsenalClone.id}`)
      } else {
          console.error("❌ Arsenal clone not found in this save file.")
      }
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
