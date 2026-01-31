
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- VERIFYING DATABASE DATA ---')
  
  const userCount = await prisma.user.count()
  console.log(`✅ Users Found: ${userCount}`)
  
  if (userCount > 0) {
    const users = await prisma.user.findMany({ select: { name: true, email: true, role: true }})
    console.table(users)
  }

  const clubCount = await prisma.club.count()
  console.log(`✅ Clubs Found: ${clubCount}`)

  const playerCount = await prisma.player.count()
  console.log(`✅ Players Found: ${playerCount}`)
  
  if (playerCount > 0) {
    const sample = await prisma.player.findFirst({ include: { club: true } })
    console.log(`   Sample Player: ${sample?.name} (${sample?.position}) - ${sample?.club.team}`)
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
