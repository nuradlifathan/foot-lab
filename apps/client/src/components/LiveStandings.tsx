import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { API } from "../api"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RefreshCw, Clock, AlertCircle, ChevronRight } from "lucide-react"

interface RealKlasemenProps {
  previewMode?: boolean
  sidebarMode?: boolean
}

interface Standing {
  position: number
  team: {
    name: string
    crest: string
  }
  playedGames: number
  won: number
  draw: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  points: number
}

interface StandingsResponse {
  competition: {
    name: string
    emblem: string
  }
  standings: Array<{
    table: Standing[]
  }>
}

const leagues = [
  { code: "PL", name: "Premier League", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", color: "from-purple-600 to-blue-600" },
  { code: "BL1", name: "Bundesliga", flag: "🇩🇪", color: "from-red-600 to-yellow-500" },
  { code: "SA", name: "Serie A", flag: "🇮🇹", color: "from-green-600 to-red-600" },
  { code: "PD", name: "La Liga", flag: "🇪🇸", color: "from-red-600 to-yellow-400" },
  { code: "FL1", name: "Ligue 1", flag: "🇫🇷", color: "from-blue-600 to-red-600" },
  { code: "DED", name: "Eredivisie", flag: "🇳🇱", color: "from-orange-500 to-blue-600" },
  { code: "PPL", name: "Primeira Liga", flag: "🇵🇹", color: "from-green-600 to-red-500" },
  { code: "CL", name: "Champions League", flag: "🏆", color: "from-blue-900 to-blue-500" },
  { code: "EC", name: "Euro", flag: "🇪🇺", color: "from-blue-700 to-yellow-500" },
  { code: "WC", name: "World Cup", flag: "🌍", color: "from-green-600 to-blue-600" },
]

const RealKlasemen = ({ previewMode = false, sidebarMode = false }: RealKlasemenProps) => {
  const [selectedLeague, setSelectedLeague] = useState(leagues[0])
  const [rateLimitCountdown, setRateLimitCountdown] = useState(0)
  const [isRateLimited, setIsRateLimited] = useState(false)

  // Countdown timer for rate limit
  useEffect(() => {
    if (rateLimitCountdown > 0) {
      const timer = setInterval(() => {
        setRateLimitCountdown((prev) => {
          if (prev <= 1) {
            setIsRateLimited(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [rateLimitCountdown])

  const { data, isLoading, error, refetch, isFetching } = useQuery<StandingsResponse>({
    queryKey: ["realStandings", selectedLeague.code],
    queryFn: async () => {
      try {
        const res = await API.get(`/football/standings/${selectedLeague.code}`)
        return res.data
      } catch (err: any) {
        const status = err?.response?.status
        const errorMsg = err?.response?.data?.error || ""
        
        // Check if rate limited (429, 502, or specific error message)
        if (status === 429 || status === 502 || errorMsg.includes('rate') || errorMsg.includes('limit')) {
          setIsRateLimited(true)
          setRateLimitCountdown(60) // 60 seconds cooldown
        }
        throw err
      }
    },
    enabled: !isRateLimited,
    retry: false,
    staleTime: 30000, 
  })

  const handleLeagueChange = (league: typeof leagues[0]) => {
    if (!isRateLimited) {
      setSelectedLeague(league)
    }
  }

  const handleRefresh = () => {
    if (!isRateLimited) {
      refetch()
    }
  }

  if (previewMode) {
    // Simplified render for Landing Page
    return (
       <div className="space-y-4">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
                <span className="text-2xl">🇬🇧</span>
                <span className="font-bold">Premier League Live</span>
             </div>
             {isLoading && <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />}
          </div>

          {!data || isLoading ? (
             <div className="space-y-2">
               {Array.from({ length: 5 }).map((_, i) => (
                 <Skeleton key={i} className="h-10 w-full" />
               ))}
             </div>
          ) : (
            <div className="border rounded-lg overflow-hidden bg-card/50 backdrop-blur-sm">
             <Table>
                <TableHeader>
                   <TableRow>
                     <TableHead className="w-8">#</TableHead>
                     <TableHead>Club</TableHead>
                     <TableHead className="text-right">Pts</TableHead>
                   </TableRow>
                </TableHeader>
                <TableBody>
                   {data.standings[0]?.table.slice(0, 5).map((team) => (
                      <TableRow key={team.position} className="hover:bg-muted/50">
                         <TableCell className="font-bold">{team.position}</TableCell>
                         <TableCell>
                           <div className="flex items-center gap-2">
                              <img src={team.team.crest} className="h-5 w-5 object-contain" />
                              <span className="text-sm font-medium">{team.team.name}</span>
                           </div>
                         </TableCell>
                         <TableCell className="text-right font-bold">{team.points}</TableCell>
                      </TableRow>
                   ))}
                </TableBody>
             </Table>
             <div className="p-3 bg-muted/20 text-center">
                <p className="text-xs text-muted-foreground">Top 5 shown. Sign in for full stats.</p>
             </div>
            </div>
          )}
       </div>
    )
  }

  return (
    <div className={cn("space-y-6", sidebarMode ? "p-3 space-y-3" : "p-6")}>
      {/* Rate Limit Warning */}
      {isRateLimited && (
        <Card className="border-yellow-500 bg-yellow-500/10 animate-fade-in">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-yellow-500/20">
                <Clock className="h-6 w-6 text-yellow-500 animate-pulse" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-600 dark:text-yellow-400">
                  Counting Down
                </h3>
                <div className="text-sm text-yellow-600">
                   {rateLimitCountdown}s until refresh
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* League Selector */}
      {sidebarMode ? (
        <Select 
          value={selectedLeague.code} 
          onValueChange={(val) => {
             const found = leagues.find(l => l.code === val)
             if (found && !isRateLimited) setSelectedLeague(found)
          }}
          disabled={isRateLimited}
        >
          <SelectTrigger className="w-full">
            <SelectValue>
               <span className="mr-2">{selectedLeague.flag}</span>
               {selectedLeague.name}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {leagues.map(l => (
              <SelectItem key={l.code} value={l.code}>
                <span className="mr-2">{l.flag}</span>
                {l.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-muted-foreground">Select League</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-3">
            {leagues.map((league) => (
              <button
                key={league.code}
                onClick={() => handleLeagueChange(league)}
                disabled={isRateLimited}
                className={cn(
                  "relative group p-4 rounded-xl border-2 transition-all duration-300",
                  "hover:scale-105 hover:shadow-lg",
                  selectedLeague.code === league.code
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-border hover:border-primary/50",
                  isRateLimited && "opacity-50 cursor-not-allowed hover:scale-100"
                )}
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl">{league.flag}</span>
                  <span className="text-xs font-medium text-center leading-tight">
                    {league.name}
                  </span>
                </div>
                {selectedLeague.code === league.code && (
                  <div className="absolute -top-1 -right-1">
                    <Badge variant="success" className="text-[10px] px-1">
                      ●
                    </Badge>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Header */}
      <Card className={cn(
        "border-0 overflow-hidden",
        `bg-gradient-to-r ${selectedLeague.color}`
      )}>
        <CardHeader className="text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {data?.competition.emblem && !isLoading ? (
                <img
                  src={data.competition.emblem}
                  alt="League"
                  className="h-16 w-16 object-contain bg-white/20 rounded-lg p-2"
                />
              ) : (
                <div className="h-16 w-16 bg-white/20 rounded-lg animate-pulse" />
              )}
              <div>
                <CardTitle className="text-2xl text-white">
                  {data?.competition.name || selectedLeague.name}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-white/20 text-white border-0">
                    ● LIVE
                  </Badge>
                  <span className="text-white/70 text-sm">2024/25 Season</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isFetching || isRateLimited}
              className="text-white hover:bg-white/20 disabled:opacity-50"
            >
              <RefreshCw className={cn("h-5 w-5", isFetching && "animate-spin")} />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Loading State */}
      {isLoading && !isRateLimited && (
        <Card>
          <CardContent className="p-0">
            <div className="space-y-0">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border-b">
                  <Skeleton className="h-6 w-6" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 flex-1 max-w-[200px]" />
                  <div className="flex gap-2 ml-auto">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <Skeleton key={j} className="h-4 w-8" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && !isLoading && !isRateLimited && (
        <Card className="text-center p-8">
          <div className="text-6xl mb-4">
            <AlertCircle className="h-16 w-16 mx-auto text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold mb-2">Unable to load standings</h2>
          <p className="text-muted-foreground mb-4">
            This competition might not have active data right now, or there's a connection issue.
          </p>
          <Button onClick={handleRefresh} disabled={isRateLimited}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </Card>
      )}

      {/* Table */}
      {!isLoading && !error && data && !isRateLimited && (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead>Club</TableHead>
                  <TableHead className="text-center w-12">P</TableHead>
                  <TableHead className="text-center w-12 text-green-600">W</TableHead>
                  <TableHead className="text-center w-12 text-yellow-600">D</TableHead>
                  <TableHead className="text-center w-12 text-red-600">L</TableHead>
                  <TableHead className="text-center w-12">GF</TableHead>
                  <TableHead className="text-center w-12">GA</TableHead>
                  <TableHead className="text-center w-12">GD</TableHead>
                  <TableHead className="text-center w-16 font-bold">Pts</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.standings[0]?.table.map((team, index) => (
                  <TableRow
                    key={team.position}
                    className={cn(
                      "transition-all duration-200 hover:shadow-md",
                      team.position <= 4 && "bg-green-500/10 hover:bg-green-500/20 border-l-4 border-l-green-500",
                      team.position === 5 && "bg-blue-500/10 hover:bg-blue-500/20 border-l-4 border-l-blue-500",
                      team.position === 6 && "bg-orange-500/10 hover:bg-orange-500/20 border-l-4 border-l-orange-500",
                      team.position >= (data.standings[0].table.length - 2) && "bg-red-500/10 hover:bg-red-500/20 border-l-4 border-l-red-500"
                    )}
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <TableCell className="text-center font-bold">{team.position}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={team.team.crest}
                          alt={team.team.name}
                          className="h-7 w-7 object-contain"
                          loading="lazy"
                        />
                        <span className="font-medium">{team.team.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">{team.playedGames}</TableCell>
                    <TableCell className="text-center font-medium text-green-600">{team.won}</TableCell>
                    <TableCell className="text-center font-medium text-yellow-600">{team.draw}</TableCell>
                    <TableCell className="text-center font-medium text-red-600">{team.lost}</TableCell>
                    <TableCell className="text-center">{team.goalsFor}</TableCell>
                    <TableCell className="text-center">{team.goalsAgainst}</TableCell>
                    <TableCell className={cn(
                      "text-center font-medium",
                      (team.goalsFor - team.goalsAgainst) > 0 ? "text-green-600" : 
                      (team.goalsFor - team.goalsAgainst) < 0 ? "text-red-600" : ""
                    )}>
                      {team.goalsFor - team.goalsAgainst > 0 ? "+" : ""}{team.goalsFor - team.goalsAgainst}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-bold text-lg">{team.points}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      {!isRateLimited && data && (
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-green-500" />
            <span>Champions League</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-blue-500" />
            <span>Europa League</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-orange-500" />
            <span>Conference League</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-red-500" />
            <span>Relegation</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default RealKlasemen
