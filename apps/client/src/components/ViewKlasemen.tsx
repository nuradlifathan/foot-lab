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
  main: number
  menang: number
  seri: number
  kalah: number
  goal_masuk: number
  goal_kemasukan: number
  point: number
}

const ViewKlasemen = () => {
  const { data: klasemen, isLoading, error } = useQuery<KlasemenItem[]>({
    queryKey: ["klasemen"],
    queryFn: api.getKlasemen,
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
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Custom League</CardTitle>
              <Badge variant="secondary" className="mt-1">
                Your League
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12">#</TableHead>
                <TableHead>Club</TableHead>
                <TableHead className="text-center">P</TableHead>
                <TableHead className="text-center">W</TableHead>
                <TableHead className="text-center">D</TableHead>
                <TableHead className="text-center">L</TableHead>
                <TableHead className="text-center">GF</TableHead>
                <TableHead className="text-center">GA</TableHead>
                <TableHead className="text-center font-bold">Pts</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {klasemen?.map((club, index) => (
                <TableRow
                  key={club.no}
                  className={cn(
                    "transition-colors",
                    index === 0 && "bg-yellow-500/10 hover:bg-yellow-500/20"
                  )}
                >
                  <TableCell className="font-bold">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : club.no}
                  </TableCell>
                  <TableCell className="font-medium">{club.klub}</TableCell>
                  <TableCell className="text-center">{club.main}</TableCell>
                  <TableCell className="text-center text-green-600">{club.menang}</TableCell>
                  <TableCell className="text-center text-yellow-600">{club.seri}</TableCell>
                  <TableCell className="text-center text-red-600">{club.kalah}</TableCell>
                  <TableCell className="text-center">{club.goal_masuk}</TableCell>
                  <TableCell className="text-center">{club.goal_kemasukan}</TableCell>
                  <TableCell className="text-center font-bold text-lg">{club.point}</TableCell>
                  <TableCell>
                    <Link to={`/squad/${club.id}`}>
                      <Button variant="ghost" size="icon" title="Manage Squad">
                        <Users className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default ViewKlasemen
