
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

export const generatePreferredFoot = (): string => {
  const roll = Math.random()
  if (roll < 0.7) return 'Right'
  if (roll < 0.9) return 'Left'
  return 'Both'
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
        defending: getWeightedRandom(75, 95, 0.4), // Reflexes
        physical: getRandomInt(60, 85),
        stamina: getRandomInt(60, 80),
        overall: 0
      }
      break

    case 'CB': // Centre Back (Def + Phy)
      stats = {
        pace: getRandomInt(50, 75),
        shooting: getRandomInt(30, 60),
        passing: getRandomInt(50, 75),
        dribbling: getRandomInt(40, 65),
        defending: getWeightedRandom(75, 95, 0.3),
        physical: getWeightedRandom(75, 95, 0.3),
        stamina: getRandomInt(70, 90),
        overall: 0
      }
      break
    
    case 'LB': // Fullbacks (Pace + Def + Pass)
    case 'RB':
      stats = {
        pace: getWeightedRandom(70, 90, 0.5),
        shooting: getRandomInt(40, 70),
        passing: getRandomInt(60, 80),
        dribbling: getRandomInt(60, 80),
        defending: getWeightedRandom(65, 85, 0.5),
        physical: getRandomInt(60, 80),
        stamina: getWeightedRandom(80, 95, 0.4),
        overall: 0
      }
      break

    case 'CDM': // Def Mid (Def + Phy + Pass)
      stats = {
        pace: getRandomInt(55, 75),
        shooting: getRandomInt(50, 75),
        passing: getWeightedRandom(70, 90, 0.4),
        dribbling: getRandomInt(60, 80),
        defending: getWeightedRandom(70, 90, 0.4),
        physical: getWeightedRandom(70, 90, 0.4),
        stamina: getWeightedRandom(80, 99, 0.3),
        overall: 0
      }
      break

    case 'CM': // Box to Box (Balanced)
      stats = {
        pace: getRandomInt(60, 80),
        shooting: getRandomInt(60, 80),
        passing: getWeightedRandom(75, 90, 0.4),
        dribbling: getRandomInt(65, 85),
        defending: getRandomInt(60, 80),
        physical: getRandomInt(65, 85),
        stamina: getWeightedRandom(85, 99, 0.3),
        overall: 0
      }
      break

    case 'CAM': // Playmaker (Pass + Drib + Shoot)
      stats = {
        pace: getRandomInt(65, 85),
        shooting: getWeightedRandom(70, 85, 0.5),
        passing: getWeightedRandom(80, 95, 0.3),
        dribbling: getWeightedRandom(75, 95, 0.4),
        defending: getRandomInt(30, 60),
        physical: getRandomInt(50, 70),
        stamina: getRandomInt(70, 90),
        overall: 0
      }
      break

    case 'LW': // Wingers (Pace + Drib)
    case 'RW':
      stats = {
        pace: getWeightedRandom(80, 97, 0.3),
        shooting: getWeightedRandom(65, 85, 0.5),
        passing: getRandomInt(60, 80),
        dribbling: getWeightedRandom(75, 95, 0.4),
        defending: getRandomInt(20, 50),
        physical: getRandomInt(50, 75),
        stamina: getRandomInt(70, 90),
        overall: 0
      }
      break

    case 'ST': // Striker (Shoot + Phy/Pace)
      stats = {
        pace: getWeightedRandom(70, 90, 0.5),
        shooting: getWeightedRandom(80, 97, 0.3),
        passing: getRandomInt(50, 75),
        dribbling: getRandomInt(60, 85),
        defending: getRandomInt(20, 45),
        physical: getWeightedRandom(70, 90, 0.5),
        stamina: getRandomInt(70, 90),
        overall: 0
      }
      break

    default: // Fallback
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

  // Calculate Overall (Simplified Weighted Average)
  let ovr = 0
  switch (position) {
    case 'GK': ovr = (stats.defending * 0.5) + (stats.physical * 0.2) + (stats.passing * 0.1) + (stats.pace * 0.2); break
    case 'CB': ovr = (stats.defending * 0.5) + (stats.physical * 0.3) + (stats.passing * 0.1) + (stats.pace * 0.1); break
    case 'LB': 
    case 'RB': ovr = (stats.defending * 0.3) + (stats.pace * 0.3) + (stats.passing * 0.2) + (stats.dribbling * 0.1); break
    case 'CDM': ovr = (stats.defending * 0.4) + (stats.passing * 0.3) + (stats.physical * 0.2) + (stats.stamina * 0.1); break
    case 'CM': ovr = (stats.passing * 0.3) + (stats.dribbling * 0.2) + (stats.defending * 0.2) + (stats.shooting * 0.1) + (stats.stamina * 0.2); break
    case 'CAM': ovr = (stats.passing * 0.4) + (stats.dribbling * 0.3) + (stats.shooting * 0.2) + (stats.pace * 0.1); break
    case 'LW':
    case 'RW': ovr = (stats.pace * 0.4) + (stats.dribbling * 0.3) + (stats.shooting * 0.2) + (stats.passing * 0.1); break
    case 'ST': ovr = (stats.shooting * 0.5) + (stats.physical * 0.2) + (stats.pace * 0.2) + (stats.dribbling * 0.1); break
    default: ovr = 50
  }

  stats.overall = Math.round(ovr)
  return stats
}
