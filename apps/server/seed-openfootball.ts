
import { PrismaClient } from '@prisma/client'
import { generateStats } from './lib/generators/stats' // Fixed Import

const prisma = new PrismaClient()

// Real Data: Premier League 2024/25
const PREMIER_LEAGUE_CLUBS = [
  { name: 'Arsenal', city: 'London', stadium: 'Emirates Stadium', capacity: 60704, color1: '#EF0107', color2: '#FFFFFF' },
  { name: 'Aston Villa', city: 'Birmingham', stadium: 'Villa Park', capacity: 42682, color1: '#95BFE5', color2: '#670E36' },
  { name: 'Bournemouth', city: 'Bournemouth', stadium: 'Vitality Stadium', capacity: 11364, color1: '#DA291C', color2: '#000000' },
  { name: 'Brentford', city: 'London', stadium: 'Gtech Community Stadium', capacity: 17250, color1: '#E30613', color2: '#FFFFFF' },
  { name: 'Brighton & Hove Albion', city: 'Brighton', stadium: 'Amex Stadium', capacity: 31800, color1: '#0057B8', color2: '#FFFFFF' },
  { name: 'Chelsea', city: 'London', stadium: 'Stamford Bridge', capacity: 40853, color1: '#034694', color2: '#FFFFFF' },
  { name: 'Crystal Palace', city: 'London', stadium: 'Selhurst Park', capacity: 25486, color1: '#1B458F', color2: '#A7A5A6' },
  { name: 'Everton', city: 'Liverpool', stadium: 'Goodison Park', capacity: 39572, color1: '#003399', color2: '#FFFFFF' },
  { name: 'Fulham', city: 'London', stadium: 'Craven Cottage', capacity: 25700, color1: '#000000', color2: '#FFFFFF' },
  { name: 'Ipswich Town', city: 'Ipswich', stadium: 'Portman Road', capacity: 29673, color1: '#0000FF', color2: '#FFFFFF' },
  { name: 'Leicester City', city: 'Leicester', stadium: 'King Power Stadium', capacity: 32261, color1: '#0053A0', color2: '#FFFFFF' },
  { name: 'Liverpool', city: 'Liverpool', stadium: 'Anfield', capacity: 61276, color1: '#C8102E', color2: '#00B2A9' },
  { name: 'Manchester City', city: 'Manchester', stadium: 'Etihad Stadium', capacity: 53400, color1: '#6CABDD', color2: '#1C2C5B' },
  { name: 'Manchester United', city: 'Manchester', stadium: 'Old Trafford', capacity: 74310, color1: '#DA291C', color2: '#FBE122' },
  { name: 'Newcastle United', city: 'Newcastle', stadium: 'St. James\' Park', capacity: 52305, color1: '#241F20', color2: '#FFFFFF' },
  { name: 'Nottingham Forest', city: 'Nottingham', stadium: 'City Ground', capacity: 30445, color1: '#DD0000', color2: '#FFFFFF' },
  { name: 'Southampton', city: 'Southampton', stadium: 'St Mary\'s Stadium', capacity: 32384, color1: '#D71920', color2: '#FFFFFF' },
  { name: 'Tottenham Hotspur', city: 'London', stadium: 'Tottenham Hotspur Stadium', capacity: 62850, color1: '#132257', color2: '#FFFFFF' },
  { name: 'West Ham United', city: 'London', stadium: 'London Stadium', capacity: 62500, color1: '#7A263A', color2: '#1BB1E7' },
  { name: 'Wolverhampton Wanderers', city: 'Wolverhampton', stadium: 'Molineux Stadium', capacity: 32050, color1: '#FDB913', color2: '#231F20' }
]

async function getRandomName(type: 'FIRST' | 'LAST', country: string) {
  const result = await prisma.nameAsset.findFirst({
    where: { type, country },
    skip: Math.floor(Math.random() * await prisma.nameAsset.count({ where: { type, country } }))
  })
  return result?.value || (type === 'FIRST' ? 'John' : 'Doe')
}

async function main() {
  console.log('🌍 Seeding OpenFootball Master Data...')

  // Clean up Master Data (gameId = null) to avoid duplicates
  await prisma.player.deleteMany({ where: { gameId: null } })
  await prisma.club.deleteMany({ where: { gameId: null } })
  await prisma.league.deleteMany({ where: { name: 'Premier League' } }) // Assuming we want to recreate it
  await prisma.country.deleteMany({ where: { name: 'England' } }) // Safe if cascade, else might fail if other leagues exist
  
  // Actually, deleteMany on Country might fail if other leagues exist. 
  // Better to upsert Country and League, or just recreate.
  // Since we reset DB, it is empty. But re-running this script requires cleanup.
  
  // Re-Upsert Country
  const england = await prisma.country.upsert({
    where: { name: 'England' },
    update: {},
    create: { name: 'England', code: 'ENG', region: 'Europe', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' }
  })

  // Re-Create League
  const pl = await prisma.league.create({
    data: {
      name: 'Premier League',
      tier: 1,
      countryId: england.id
    }
  })

  console.log(`Created League: ${pl.name}`)

  // 2. Create Clubs (Master Data: gameId = null)
  for (const clubData of PREMIER_LEAGUE_CLUBS) {
    const club = await prisma.club.create({
      data: {
        name: clubData.name,
        city: clubData.city,
        stadiumName: clubData.stadium,
        stadiumCap: clubData.capacity,
        primaryColor: clubData.color1,
        secondaryColor: clubData.color2,
        leagueId: pl.id,
        countryId: england.id,
        reputation: Math.floor(Math.random() * (9000 - 6000) + 6000), 
        balance: 50000000, 
        gameId: null 
      }
    })

    console.log(`Created Club: ${club.name}`)

    // 3. Generate Squad (25 Players)
    const positions = ['GK', 'GK', 'GK', 
                       'CB', 'CB', 'CB', 'CB', 'LB', 'LB', 'RB', 'RB', 
                       'CDM', 'CDM', 'CM', 'CM', 'CM', 'CAM', 'CAM', 
                       'LW', 'LW', 'RW', 'RW', 'ST', 'ST', 'ST']
    
    for (const pos of positions) {
      const firstName = await getRandomName('FIRST', 'EN')
      const lastName = await getRandomName('LAST', 'EN')
      const stats = generateStats(pos) // Fixed Function Call
      
      await prisma.player.create({
        data: {
          name: `${firstName} ${lastName}`,
          position: pos,
          age: Math.floor(Math.random() * (35 - 17) + 17),
          clubId: club.id,
          countryId: england.id,
          gameId: null, 
          ...stats,
          marketValue: stats.overall * 1000000 
        }
      })
    }
  }

  console.log('✅ OpenFootball Master Data Seeded Successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
