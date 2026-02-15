
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('👥 User Diagnostic...')

  const users = await prisma.user.findMany({
      include: {
          _count: {
              select: { games: true }
          }
      }
  })

  console.log(`Found ${users.length} users:`)
  users.forEach(u => {
      console.log(`- [${u.id}] ${u.name} (${u.email}) | Games: ${u._count.games}`)
  })
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
