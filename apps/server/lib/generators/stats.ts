
interface PlayerStats {
  pace: number
  shooting: number
  passing: number
  dribbling: number
  defending: number
  physical: number
  stamina: number
  overall: number
}

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Helper to bias random towards higher numbers for key stats
const getWeightedRandom = (min: number, max: number, bias: number = 1) => {
  const range = max - min
  const raw = Math.pow(Math.random(), bias) // bias < 1 results in higher numbers
  return Math.floor(raw * (range + 1)) + min
}

export const generateStats = (position: string): PlayerStats => {
  let stats: PlayerStats

  // Wonderkid chance (5%) -> boost all stats by 10-15
  const isWonderkid = Math.random() < 0.05
  const boost = isWonderkid ? getRandomInt(10, 15) : 0

  switch (position) {
    case 'GK':
      stats = {
        pace: getRandomInt(30, 60),
        shooting: getRandomInt(20, 50), // Kicking
        passing: getRandomInt(40, 75),
        dribbling: getRandomInt(30, 60), // Agility
        defending: getWeightedRandom(70, 95, 0.5), // Reflexes/Handling
        physical: getRandomInt(60, 85),
        stamina: getRandomInt(60, 80), // GKs run less
        overall: 0
      }
      break

    case 'DEF':
      stats = {
        pace: getRandomInt(50, 85),
        shooting: getRandomInt(30, 65),
        passing: getRandomInt(50, 80),
        dribbling: getRandomInt(40, 70),
        defending: getWeightedRandom(75, 95, 0.3), // Key stat
        physical: getWeightedRandom(70, 95, 0.5), // Key stat
        stamina: getRandomInt(70, 95),
        overall: 0
      }
      break

    case 'MID':
      stats = {
        pace: getRandomInt(60, 85),
        shooting: getRandomInt(50, 85),
        passing: getWeightedRandom(75, 95, 0.3), // Key stat
        dribbling: getWeightedRandom(70, 90, 0.5),
        defending: getRandomInt(50, 80),
        physical: getRandomInt(60, 85),
        stamina: getWeightedRandom(80, 99, 0.3), // Mids run the most
        overall: 0
      }
      break

    case 'ATK':
      stats = {
        pace: getWeightedRandom(70, 95, 0.5),
        shooting: getWeightedRandom(75, 97, 0.3), // Key stat
        passing: getRandomInt(50, 80),
        dribbling: getWeightedRandom(70, 95, 0.5),
        defending: getRandomInt(20, 50),
        physical: getRandomInt(60, 85),
        stamina: getRandomInt(70, 90),
        overall: 0
      }
      break

    default:
      stats = {
        pace: 50, shooting: 50, passing: 50, dribbling: 50, defending: 50, physical: 50, stamina: 50, overall: 50
      }
  }

  // Apply Wonderkid boost (capped at 99)
  if (isWonderkid) {
     (Object.keys(stats) as Array<keyof PlayerStats>).forEach(key => {
       if (key !== 'overall') {
         stats[key] = Math.min(99, stats[key] + boost)
       }
     })
  }

  // Calculate Overall
  const weights = {
    GK: { def: 0.8, phy: 0.1, pas: 0.1 },
    DEF: { def: 0.5, phy: 0.3, pac: 0.1, pas: 0.1 },
    MID: { pas: 0.4, dri: 0.3, sho: 0.1, def: 0.2 },
    ATK: { sho: 0.5, pac: 0.2, dri: 0.2, phy: 0.1 }
  }

  const w = weights[position as keyof typeof weights] || weights.MID // default
  
  if (position === 'GK') {
    stats.overall = Math.round(stats.defending * 0.8 + stats.physical * 0.1 + stats.passing * 0.1)
  } else if (position === 'DEF') {
    stats.overall = Math.round(stats.defending * 0.5 + stats.physical * 0.3 + stats.pace * 0.1 + stats.passing * 0.1)
  } else if (position === 'MID') {
    stats.overall = Math.round(stats.passing * 0.4 + stats.dribbling * 0.3 + stats.shooting * 0.1 + stats.defending * 0.2)
  } else {
    stats.overall = Math.round(stats.shooting * 0.5 + stats.pace * 0.2 + stats.dribbling * 0.2 + stats.physical * 0.1)
  }

  return stats
}
