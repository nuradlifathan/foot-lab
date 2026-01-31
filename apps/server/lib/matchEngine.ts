import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface TeamStats {
  attack: number
  midfield: number
  defense: number
  goalkeeping: number
  overall: number
}

// Weights for calculating sector strength
const WEIGHTS = {
  ATK: { shooting: 0.4, pace: 0.2, dribbling: 0.2, physical: 0.1, passing: 0.1 },
  MID: { passing: 0.4, dribbling: 0.2, vision: 0.2, stamina: 0.1, defending: 0.1 }, // Note: vision n/a, using pace/shooting adjustments
  DEF: { defending: 0.5, physical: 0.3, pace: 0.1, passing: 0.1 },
  GK: { goalkeeping: 1.0 } // Simplified for now since we don't have detailed GK stats yet, assuming 'defending' acts as proxy or new stat
}

// Calculate team strength based on players
export const calculateTeamStrength = async (clubId: number): Promise<TeamStats> => {
  const players = await prisma.player.findMany({
    where: { clubId }
  })

  if (!players || players.length === 0) {
    return { attack: 50, midfield: 50, defense: 50, goalkeeping: 50, overall: 50 }
  }

  const stats = {
    attack: [] as number[],
    midfield: [] as number[],
    defense: [] as number[],
    goalkeeping: [] as number[]
  }

  players.forEach(p => {
    // Determine contribution based on position
    // Simple logic: Forward -> Attack, Mid -> Midfield, Defender -> Defense, GK -> Goalkeeping
    
    // We use 'overall' as base, but could be more specific
    if (p.position.includes('Forward') || p.position.includes('Striker') || p.position.includes('Winger') || p.position === 'Attacker' || p.position === 'ATK') {
       // Attackers contribute heavily to attack strength
       stats.attack.push(p.overall)
    } else if (p.position.includes('Midfielder') || p.position === 'MID') {
       stats.midfield.push(p.overall)
    } else if (p.position.includes('Defender') || p.position === 'DEF') {
       stats.defense.push(p.overall)
    } else if (p.position.includes('Goalkeeper') || p.position === 'GK') {
       stats.goalkeeping.push(p.overall)
    }
  })

  // Helper to get average or default
  const getAvg = (arr: number[]) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 60 // Default 60 if empty sector

  return {
    attack: getAvg(stats.attack),
    midfield: getAvg(stats.midfield),
    defense: getAvg(stats.defense),
    goalkeeping: getAvg(stats.goalkeeping),
    overall: (getAvg(stats.attack) + getAvg(stats.midfield) + getAvg(stats.defense) + getAvg(stats.goalkeeping)) / 4
  }
}

// Simulate a match between two teams
export const simulateMatch = async (homeId: number, awayId: number) => {
  const homeStats = await calculateTeamStrength(homeId)
  const awayStats = await calculateTeamStrength(awayId)

  // -- SIMULATION LOGIC --
  
  // 1. Possession Battle (Midfield)
  // Higher midfield = slightly more chances
  const midfieldDiff = homeStats.midfield - awayStats.midfield
  const baseChances = 10
  const homeChances = baseChances + (midfieldDiff / 2) // e.g. +5 strength = +2.5 chances
  const awayChances = baseChances - (midfieldDiff / 2)

  // 2. Scoring Calculation
  // Home Attack vs Away Defense
  const homeAdvantage = 1.1 // Home team buff
  const homeAttackPower = (homeStats.attack * homeAdvantage) - awayStats.defense
  const awayAttackPower = awayStats.attack - (homeStats.defense * homeAdvantage) // Home defense also buffed? usually home adv is overall
  
  // Scoring probability per chance base 15%
  // Power diff of +10 increases conversion by 5%
  // Low power (diff -10) decreases conversion
  const getConversionRate = (powerDiff: number) => {
      let rate = 0.15 // Base 15%
      rate += (powerDiff * 0.01) 
      return Math.max(0.01, Math.min(0.8, rate)) // Clamp between 1% and 80%
  }

  let homeScore = 0
  let awayScore = 0
  const matchEvents: string[] = []

  // Simulate Home Chances
  for (let i = 0; i < Math.floor(homeChances); i++) {
     if (Math.random() < getConversionRate(homeAttackPower)) {
        homeScore++
        const minute = Math.floor(Math.random() * 90) + 1
        matchEvents.push(`${minute}' GOAL! Home Team scores.`)
     }
  }

  // Simulate Away Chances
  for (let i = 0; i < Math.floor(awayChances); i++) {
     if (Math.random() < getConversionRate(awayAttackPower)) {
        awayScore++
        const minute = Math.floor(Math.random() * 90) + 1
        matchEvents.push(`${minute}' GOAL! Away Team scores.`)
     }
  }

  // Sort events by minute
  matchEvents.sort((a, b) => {
      const timeA = parseInt(a.split("'")[0])
      const timeB = parseInt(b.split("'")[0])
      return timeA - timeB
  })

  return {
    homeScore,
    awayScore,
    homeStats,
    awayStats,
    events: matchEvents
  }
}
