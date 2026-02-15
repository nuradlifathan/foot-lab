
import { PrismaClient } from '@prisma/client'
import { generateStats } from './lib/generators/stats'

const prisma = new PrismaClient()

// Logo Source: Wikimedia (Hotlink Safe)
const plClubs2425 = [
  { 
    id: 1, name: 'Arsenal', code: 'ARS', city: 'London', 
    color: '#EF0107', sec: '#FFFFFF', stadium: 'Emirates Stadium', capacity: 60704,
    logo: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg'
  },
  { 
    id: 2, name: 'Aston Villa', code: 'AVL', city: 'Birmingham', 
    color: '#95BFE5', sec: '#670E36', stadium: 'Villa Park', capacity: 42682,
    logo: 'https://upload.wikimedia.org/wikipedia/en/f/f9/Aston_Villa_FC_crest_%282016%29.svg'
  },
  { 
    id: 3, name: 'Bournemouth', code: 'BOU', city: 'Bournemouth', 
    color: '#DA291C', sec: '#000000', stadium: 'Vitality Stadium', capacity: 11329,
    logo: 'https://upload.wikimedia.org/wikipedia/en/e/e5/AFC_Bournemouth_%282013%29.svg'
  },
  { 
    id: 4, name: 'Brentford', code: 'BRE', city: 'London', 
    color: '#E30613', sec: '#FFFFFF', stadium: 'Gtech Community Stadium', capacity: 17250,
    logo: 'https://upload.wikimedia.org/wikipedia/en/2/2a/Brentford_FC_crest.svg'
  },
  { 
    id: 5, name: 'Brighton', code: 'BHA', city: 'Brighton', 
    color: '#0057B8', sec: '#FFFFFF', stadium: 'Amex Stadium', capacity: 31800,
    logo: 'https://upload.wikimedia.org/wikipedia/en/f/fd/Brighton_%26_Hove_Albion_FC_logo.svg'
  },
  { 
    id: 6, name: 'Chelsea', code: 'CHE', city: 'London', 
    color: '#034694', sec: '#FFFFFF', stadium: 'Stamford Bridge', capacity: 40341,
    logo: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg'
  },
  { 
    id: 7, name: 'Crystal Palace', code: 'CRY', city: 'London', 
    color: '#1B458F', sec: '#C4122E', stadium: 'Selhurst Park', capacity: 25486,
    logo: 'https://upload.wikimedia.org/wikipedia/en/a/a2/Crystal_Palace_FC_logo_%282022%29.svg'
  },
  { 
    id: 8, name: 'Everton', code: 'EVE', city: 'Liverpool', 
    color: '#003399', sec: '#FFFFFF', stadium: 'Goodison Park', capacity: 39572,
    logo: 'https://upload.wikimedia.org/wikipedia/en/7/7c/Everton_FC_logo.svg'
  },
  { 
    id: 9, name: 'Fulham', code: 'FUL', city: 'London', 
    color: '#FFFFFF', sec: '#000000', stadium: 'Craven Cottage', capacity: 25700,
    logo: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Fulham_FC_%28shield%29.svg'
  },
  { 
    id: 10, name: 'Ipswich Town', code: 'IPS', city: 'Ipswich', 
    color: '#3A64A3', sec: '#FFFFFF', stadium: 'Portman Road', capacity: 29673,
    logo: 'https://upload.wikimedia.org/wikipedia/en/4/43/Ipswich_Town.svg'
  },
  { 
    id: 11, name: 'Leicester City', code: 'LEI', city: 'Leicester', 
    color: '#0053A0', sec: '#FFFFFF', stadium: 'King Power Stadium', capacity: 32261,
    logo: 'https://upload.wikimedia.org/wikipedia/en/2/2d/Leicester_City_crest.svg'
  },
  { 
    id: 12, name: 'Liverpool', code: 'LIV', city: 'Liverpool', 
    color: '#C8102E', sec: '#FFFFFF', stadium: 'Anfield', capacity: 61276,
    logo: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg'
  },
  { 
    id: 13, name: 'Man City', code: 'MCI', city: 'Manchester', 
    color: '#6CABDD', sec: '#1C2C5B', stadium: 'Etihad Stadium', capacity: 53400,
    logo: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg'
  },
  { 
    id: 14, name: 'Man Utd', code: 'MUN', city: 'Manchester', 
    color: '#DA291C', sec: '#FBE122', stadium: 'Old Trafford', capacity: 74310,
    logo: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg'
  },
  { 
    id: 15, name: 'Newcastle', code: 'NEW', city: 'Newcastle', 
    color: '#241F20', sec: '#FFFFFF', stadium: 'St. James\' Park', capacity: 52305,
    logo: 'https://upload.wikimedia.org/wikipedia/en/5/56/Newcastle_United_Logo.svg'
  },
  { 
    id: 16, name: 'Nottm Forest', code: 'NFO', city: 'Nottingham', 
    color: '#DD0000', sec: '#FFFFFF', stadium: 'City Ground', capacity: 30445,
    logo: 'https://upload.wikimedia.org/wikipedia/en/e/e5/Nottingham_Forest_F.C._logo.svg'
  },
  { 
    id: 17, name: 'Southampton', code: 'SOU', city: 'Southampton', 
    color: '#D71920', sec: '#FFFFFF', stadium: 'St. Mary\'s Stadium', capacity: 32384,
    logo: 'https://upload.wikimedia.org/wikipedia/en/c/c9/FC_Southampton_logo.svg'
  },
  { 
    id: 18, name: 'Tottenham', code: 'TOT', city: 'London', 
    color: '#FFFFFF', sec: '#132257', stadium: 'Tottenham Hotspur Stadium', capacity: 62850,
    logo: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg'
  },
  { 
    id: 19, name: 'West Ham', code: 'WHU', city: 'London', 
    color: '#7A263A', sec: '#1BB1E7', stadium: 'London Stadium', capacity: 62500,
    logo: 'https://upload.wikimedia.org/wikipedia/en/c/c2/West_Ham_United_FC_logo.svg'
  },
  { 
    id: 20, name: 'Wolves', code: 'WOL', city: 'Wolverhampton', 
    color: '#FDB913', sec: '#231F20', stadium: 'Molineux', capacity: 31750,
    logo: 'https://upload.wikimedia.org/wikipedia/en/f/fc/Wolverhampton_Wanderers.svg'
  }
]

async function getRandomName(type: 'FIRST' | 'LAST', country: string) {
  const count = await prisma.nameAsset.count({ where: { type, country } })
  if (count === 0) return type === 'FIRST' ? 'Player' : 'Unknown'
  
  const skip = Math.floor(Math.random() * count)
  const result = await prisma.nameAsset.findFirst({
    where: { type, country },
    skip: skip
  })
  return result?.value || (type === 'FIRST' ? 'John' : 'Doe')
}

// Stats Generator
const generatePlayerStats = (position: string) => {
    // Just a wrapper or alias, but we can import generateStats directly
    return generateStats(position)
}

async function main() {
  console.log('🧹 CLEANING & SEEDING Real Data (Premier League 24/25 + Top 5 Nations)...')

  // 0. CLEANUP (Only Master Data)
  console.log('   Deleting existing MASTER data (gameId = null)...')
  
  // Delete Players first (FK constraint)
  await prisma.player.deleteMany({ where: { gameId: null } })
  
  // Delete Clubs
  await prisma.club.deleteMany({ where: { gameId: null } })
  
  // Delete Leagues & Countries (We want a fresh start to avoid duplicates)
  try {
    // We can't easily delete all leagues/countries if they are used by Games.
    // BUT since we are identifying "Master Data" usually by GameId=null, 
    // And League/Country don't have GameId, they are shared.
    // So if we delete them, we break existing saves.
    // BETTER APPROACH: Find and update them, or delete if not referenced.
    // For now, let's just UPSERT them. The duplicates in clubs are the main issue.
    // Club duplicates are solved by `deleteMany({ where: { gameId: null } })`.
  } catch (e) {
    console.warn("   Skipping League/Country deletion to protect saves.")
  }

  console.log('✅ Cleanup Complete.')

  // 1. Define Top 5 Nations & Leagues
  const nations = [
    { name: 'England', code: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', league: 'Premier League', logo: 'https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg', id: 39 },
    { name: 'Spain', code: 'ESP', flag: '🇪🇸', league: 'La Liga', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/LaLiga_logo_2023.svg', id: 140 },
    { name: 'Germany', code: 'GER', flag: '🇩🇪', league: 'Bundesliga', logo: 'https://upload.wikimedia.org/wikipedia/en/d/df/Bundesliga_logo_%282017%29.svg', id: 78 },
    { name: 'Italy', code: 'ITA', flag: '🇮🇹', league: 'Serie A', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Serie_A_logo_2022.svg', id: 135 },
    { name: 'France', code: 'FRA', flag: '🇫🇷', league: 'Ligue 1', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Ligue_1_McDonald%27s_logo.svg', id: 61 }
  ]

  let plLeagueId = 0
  let engCountryId = 0

  for (const n of nations) {
    // Upsert Country
    const country = await prisma.country.upsert({
        where: { name: n.name },
        update: { flag: n.flag, code: n.code },
        create: { name: n.name, code: n.code, region: 'Europe', flag: n.flag }
    })
    
    // Upsert League
    // Use findFirst to avoid unique constraint issues if id auto-increments differently
    let league = await prisma.league.findFirst({ where: { name: n.league, countryId: country.id } })
    
    if (league) {
        league = await prisma.league.update({
            where: { id: league.id },
            data: { logo: n.logo, tier: 1 }
        })
    } else {
        league = await prisma.league.create({
            data: {
                name: n.league,
                countryId: country.id,
                tier: 1,
                logo: n.logo
            }
        })
    }

    console.log(`✅ ${n.name} - ${n.league} Updated.`)

    if (n.name === 'England') {
        plLeagueId = league.id
        engCountryId = country.id
    }
  }

  // 3. Create Clubs & Generate Players (Only for PL for now)
  for (const clubData of plClubs2425) {
    // Create new (Names should be unique now after cleanup)
    const club = await prisma.club.create({
        data: {
            name: clubData.name,
            nickname: clubData.code,
            city: clubData.city,
            primaryColor: clubData.color,
            secondaryColor: clubData.sec,
            stadiumName: clubData.stadium,
            stadiumCap: clubData.capacity,
            logo: clubData.logo, // Use Wikimedia Logo
            leagueId: plLeagueId,
            countryId: engCountryId,
            reputation: Math.floor(Math.random() * 2000) + 7000,
            balance: 50000000,
        }
    })
    
    console.log(`   Created Club: ${club.name}`)

    // 4. Generate Squad
    const positions = ['GK', 'GK', 'GK', 
                        'CB', 'CB', 'CB', 'CB', 'LB', 'LB', 'RB', 'RB', 
                        'CDM', 'CDM', 'CM', 'CM', 'CM', 'CAM', 'CAM', 
                        'LW', 'LW', 'RW', 'RW', 'ST', 'ST', 'ST']
    
    for (const pos of positions) {
        const firstName = await getRandomName('FIRST', 'EN')
        const lastName = await getRandomName('LAST', 'EN')
        const stats = generateStats(pos)
        
        await prisma.player.create({
        data: {
            name: `${firstName} ${lastName}`,
            position: pos,
            age: Math.floor(Math.random() * (35 - 17) + 17),
            clubId: club.id,
            countryId: engCountryId,
            gameId: null, // Master Data
            ...stats,
            marketValue: stats.overall * 1000000 
        }
        })
    }
  }

  console.log('✅ Real Data & Logos Seeded Successfully (Wikimedia)!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
