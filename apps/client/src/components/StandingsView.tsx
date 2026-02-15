import { useQuery } from "@tanstack/react-query"
import { api } from "../api"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Trophy, Users } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

interface KlasemenItem {
  no: number
  id: number
  klub: string
  logo?: string | null
  main: number
  menang: number
  seri: number
  kalah: number
  goal_masuk: number
  goal_kemasukan: number
  point: number
}

import { useParams } from "react-router-dom"

const ViewKlasemen = () => {
  const { clubId } = useParams()
  
  const { data: klasemen, isLoading, error } = useQuery<KlasemenItem[]>({
    queryKey: ["klasemen", clubId], 
    queryFn: () => api.getKlasemen(clubId ? Number(clubId) : undefined),
    enabled: !!clubId
  })

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-12 w-64" />
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Card className="text-center p-8">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-xl font-bold mb-2">Failed to load klasemen</h2>
          <p className="text-muted-foreground">Please try again later</p>
        </Card>
      </div>
    )
  }

  const isEmpty = !klasemen || klasemen.length === 0

  if (isEmpty) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Card className="text-center p-8 max-w-md">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-xl font-bold mb-2">No clubs yet</h2>
          <p className="text-muted-foreground">
            Start by creating clubs and inputting match results to see the standings here.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <Card className="border-0 bg-gradient-to-r from-[#38003c] to-[#00ff85] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-20 transform rotate-12 scale-150">
           <img src="https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg" className="w-64 h-64 grayscale brightness-200" />
        </div>
        <CardHeader className="relative z-10">
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 bg-white rounded-2xl flex items-center justify-center shadow-xl p-4">
               <img src="https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg" className="w-full h-full object-contain" />
            </div>
            <div>
              <CardTitle className="text-5xl font-extrabold tracking-tight text-white drop-shadow-md">Premier League</CardTitle>
              <div className="flex items-center gap-3 mt-2 text-white font-medium">
                 <Badge variant="secondary" className="bg-[#e90052] text-white border-none hover:bg-[#e90052]">Season 2024/25</Badge>
                 <span className="opacity-80">•</span>
                 <span className="opacity-80">Matchday {Math.max(...(klasemen?.map(c => c.main) || [0]), 0)}</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-xl overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted border-none">
                <TableHead className="w-16 text-center">Pos</TableHead>
                <TableHead>Club</TableHead>
                <TableHead className="text-center w-12">P</TableHead>
                <TableHead className="text-center w-12">W</TableHead>
                <TableHead className="text-center w-12">D</TableHead>
                <TableHead className="text-center w-12">L</TableHead>
                <TableHead className="text-center w-16">GF</TableHead>
                <TableHead className="text-center w-16">GA</TableHead>
                <TableHead className="text-center w-16">GD</TableHead>
                <TableHead className="text-center w-20 font-bold bg-primary/5">Pts</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {klasemen?.map((club, index) => {
                // Determine Position status
                let statusColor = ""
                let statusBorder = ""
                
                if (club.no <= 4) {
                    statusColor = "bg-green-500/5 hover:bg-green-500/10"
                    statusBorder = "border-l-4 border-l-green-500"
                } else if (club.no === 5) {
                    statusColor = "bg-orange-500/5 hover:bg-orange-500/10"
                    statusBorder = "border-l-4 border-l-orange-500"
                } else if (club.no >= 18) {
                    statusColor = "bg-red-500/5 hover:bg-red-500/10"
                    statusBorder = "border-l-4 border-l-red-500"
                }

                return (
                <TableRow
                  key={club.no}
                  className={cn(
                    "cursor-pointer transition-all hover:scale-[1.002] active:scale-[0.998]",
                    statusColor,
                    statusBorder
                  )}
                  onClick={() => window.location.href = `/dashboard/${club.id}`}
                >
                  <TableCell className="text-center font-bold text-muted-foreground">
                    <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs",
                        club.no <= 4 ? "bg-green-100 text-green-700 font-extrabold" :
                        club.no >= 18 ? "bg-red-100 text-red-700 font-extrabold" : ""
                    )}>
                        {club.no}
                    </div>
                  </TableCell>
                  <TableCell>
                      <div className="flex items-center gap-4">
                          {club.logo ? (
                              <img 
                                src={club.logo} 
                                alt={club.klub} 
                                className="w-10 h-10 object-contain drop-shadow-sm" 
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                  (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                          ) : null}
                          {/* Fallback Icon */}
                          <div className={cn(
                              "w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-lg shadow-sm border",
                              club.logo ? "hidden" : ""
                          )}>
                              {club.klub.substring(0, 1)}
                          </div>
                          <div>
                              <span className="font-bold text-base block">{club.klub}</span>
                              {club.no <= 4 && <span className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Champions League</span>}
                              {club.no === 5 && <span className="text-[10px] text-orange-600 font-bold uppercase tracking-wider">Europa League</span>}
                              {club.no >= 18 && <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider">Relegation</span>}
                          </div>
                      </div>
                  </TableCell>
                  <TableCell className="text-center font-medium text-muted-foreground">{club.main}</TableCell>
                  <TableCell className="text-center font-medium text-green-600 bg-green-50">{club.menang}</TableCell>
                  <TableCell className="text-center font-medium text-amber-600 bg-amber-50">{club.seri}</TableCell>
                  <TableCell className="text-center font-medium text-red-600 bg-red-50">{club.kalah}</TableCell>
                  <TableCell className="text-center">{club.goal_masuk}</TableCell>
                  <TableCell className="text-center">{club.goal_kemasukan}</TableCell>
                  <TableCell className={cn(
                      "text-center font-bold",
                      (club.goal_masuk - club.goal_kemasukan) > 0 ? "text-green-600" : 
                      (club.goal_masuk - club.goal_kemasukan) < 0 ? "text-red-600" : "text-gray-500"
                  )}>
                      {club.goal_masuk - club.goal_kemasukan > 0 ? "+" : ""}
                      {club.goal_masuk - club.goal_kemasukan}
                  </TableCell>
                  <TableCell className="text-center font-extrabold text-xl bg-primary/5 text-primary">{club.point}</TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Footer Legend */}
      <div className="flex gap-6 justify-center text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Champions League</span>
          </div>
          <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span>Europa League</span>
          </div>
          <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Relegation</span>
          </div>
      </div>
    </div>
  )
}

export default ViewKlasemen
