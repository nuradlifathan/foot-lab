
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Copy-pasted config from seed-clean-real.ts
const plClubs2425 = [
  { 
    id: 1, name: 'Arsenal', code: 'ARS', city: 'London', 
    color: '#EF0107', sec: '#FFFFFF', stadium: 'Emirates Stadium', capacity: 60704,
  },
  { 
    id: 2, name: 'Aston Villa', code: 'AVL', city: 'Birmingham', 
    color: '#95BFE5', sec: '#670E36', stadium: 'Villa Park', capacity: 42682,
  },
  { 
    id: 3, name: 'Bournemouth', code: 'BOU', city: 'Bournemouth', 
    color: '#DA291C', sec: '#000000', stadium: 'Vitality Stadium', capacity: 11329,
  },
  { 
    id: 4, name: 'Brentford', code: 'BRE', city: 'London', 
    color: '#E30613', sec: '#FFFFFF', stadium: 'Gtech Community Stadium', capacity: 17250,
  },
  { 
    id: 5, name: 'Brighton', code: 'BHA', city: 'Brighton', 
    color: '#0057B8', sec: '#FFFFFF', stadium: 'Amex Stadium', capacity: 31800,
  },
  { 
    id: 6, name: 'Chelsea', code: 'CHE', city: 'London', 
    color: '#034694', sec: '#FFFFFF', stadium: 'Stamford Bridge', capacity: 40341,
  },
  { 
    id: 7, name: 'Crystal Palace', code: 'CRY', city: 'London', 
    color: '#1B458F', sec: '#C4122E', stadium: 'Selhurst Park', capacity: 25486,
  },
  { 
    id: 8, name: 'Everton', code: 'EVE', city: 'Liverpool', 
    color: '#003399', sec: '#FFFFFF', stadium: 'Goodison Park', capacity: 39572,
  },
  { 
    id: 9, name: 'Fulham', code: 'FUL', city: 'London', 
    color: '#FFFFFF', sec: '#000000', stadium: 'Craven Cottage', capacity: 25700,
  },
  { 
    id: 10, name: 'Ipswich Town', code: 'IPS', city: 'Ipswich', 
    color: '#3A64A3', sec: '#FFFFFF', stadium: 'Portman Road', capacity: 29673,
  },
  { 
    id: 11, name: 'Leicester City', code: 'LEI', city: 'Leicester', 
    color: '#0053A0', sec: '#FFFFFF', stadium: 'King Power Stadium', capacity: 32261,
  },
  { 
    id: 12, name: 'Liverpool', code: 'LIV', city: 'Liverpool', 
    color: '#C8102E', sec: '#FFFFFF', stadium: 'Anfield', capacity: 61276,
  },
  { 
    id: 13, name: 'Man City', code: 'MCI', city: 'Manchester', 
    color: '#6CABDD', sec: '#1C2C5B', stadium: 'Etihad Stadium', capacity: 53400,
  },
  { 
    id: 14, name: 'Man Utd', code: 'MUN', city: 'Manchester', 
    color: '#DA291C', sec: '#FBE122', stadium: 'Old Trafford', capacity: 74310,
  },
  { 
    id: 15, name: 'Newcastle', code: 'NEW', city: 'Newcastle', 
    color: '#241F20', sec: '#FFFFFF', stadium: 'St. James\' Park', capacity: 52305,
  },
  { 
    id: 16, name: 'Nottm Forest', code: 'NFO', city: 'Nottingham', 
    color: '#DD0000', sec: '#FFFFFF', stadium: 'City Ground', capacity: 30445,
  },
  { 
    id: 17, name: 'Southampton', code: 'SOU', city: 'Southampton', 
    color: '#D71920', sec: '#FFFFFF', stadium: 'St. Mary\'s Stadium', capacity: 32384,
  },
  { 
    id: 18, name: 'Tottenham', code: 'TOT', city: 'London', 
    color: '#FFFFFF', sec: '#132257', stadium: 'Tottenham Hotspur Stadium', capacity: 62850,
  },
  { 
    id: 19, name: 'West Ham', code: 'WHU', city: 'London', 
    color: '#7A263A', sec: '#1BB1E7', stadium: 'London Stadium', capacity: 62500,
  },
  { 
    id: 20, name: 'Wolves', code: 'WOL', city: 'Wolverhampton', 
    color: '#FDB913', sec: '#231F20', stadium: 'Molineux', capacity: 31750,
  }
]

async function main() {
  console.log('🏟️  Starting Stadium Backfill...')

  // Map Name -> Stadium Data
  const stadiumMap = new Map()
  plClubs2425.forEach(c => {
    stadiumMap.set(c.name, { stadium: c.stadium, capacity: c.capacity })
  })

  // Get ALL clubs (Master + Saves)
  // We want to update everything that matches the name
  const allClubs = await prisma.club.findMany({
      select: { id: true, name: true, stadiumName: true }
  })

  console.log(`🧐 Scanning ${allClubs.length} clubs...`)

  let updatedCount = 0
  for (const club of allClubs) {
    const data = stadiumMap.get(club.name)
    if (data) {
       // Only update if it looks like default
       if (club.stadiumName === 'Municipal Stadium' || club.stadiumName === 'Unknown') {
           await prisma.club.update({
               where: { id: club.id },
               data: { 
                   stadiumName: data.stadium,
                   stadiumCap: data.capacity
               }
           })
           updatedCount++
           process.stdout.write('.')
       }
    }
  }

  console.log(`\n🎉 Done! Updated stadiums for ${updatedCount} clubs.`)
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
