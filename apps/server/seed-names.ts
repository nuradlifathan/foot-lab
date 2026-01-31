
import { PrismaClient } from '@prisma/client'
import { NAMES_DB } from './lib/generators/names'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Name Assets...')
  
  // Clear existing
  await prisma.nameAsset.deleteMany({})
  console.log('Cleared existing names.')

  let count = 0
  
  // Iterate through country keys
  for (const [country, names] of Object.entries(NAMES_DB)) {
    const firstNames = names.first as string[]
    const lastNames = names.last as string[]

    // Batch insert First Names
    if (firstNames.length > 0) {
      await prisma.nameAsset.createMany({
        data: firstNames.map(name => ({
          type: 'FIRST',
          country,
          value: name
        }))
      })
      count += firstNames.length
    }

    // Batch insert Last Names
    if (lastNames.length > 0) {
      await prisma.nameAsset.createMany({
        data: lastNames.map(name => ({
          type: 'LAST',
          country,
          value: name
        }))
      })
      count += lastNames.length
    }
  }

  console.log(`✅ Successfully seeded ${count} names into the database!`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
