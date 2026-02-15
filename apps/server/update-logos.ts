
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Starting Logo Backfill...')

  // 1. Get all Master Clubs (with Logos)
  const masterClubs = await prisma.club.findMany({
    where: { gameId: null, logo: { not: null } },
    select: { name: true, logo: true }
  })

  console.log(`✅ Found ${masterClubs.length} master clubs with logos.`)

  // 2. Map name -> logo
  const logoMap = new Map<string, string>()
  masterClubs.forEach(c => {
    if (c.logo) logoMap.set(c.name, c.logo)
  })

  // 3. Find clubs with missing logos
  const targetClubs = await prisma.club.findMany({
    where: { logo: null }
  })

  console.log(`🧐 Found ${targetClubs.length} clubs missing logos. Updating...`)

  let updatedCount = 0
  for (const club of targetClubs) {
    const validLogo = logoMap.get(club.name)
    if (validLogo) {
      await prisma.club.update({
        where: { id: club.id },
        data: { logo: validLogo }
      })
      updatedCount++
      process.stdout.write('.')
    }
  }

  console.log(`\n🎉 Done! Updated ${updatedCount} clubs.`)
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
