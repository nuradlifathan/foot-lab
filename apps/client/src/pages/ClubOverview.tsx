
import { useOutletContext } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  DollarSign, 
  MapPin, 
  Users, 
  TrendingUp, 
  Flag,
  Calendar
} from "lucide-react"

export default function ClubOverview() {
  const { club } = useOutletContext<any>()

  if (!club) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-black tracking-tight">{club.team}</h1>
           <p className="text-muted-foreground flex items-center gap-2">
             <MapPin className="w-4 h-4" /> {club.city} • Founded {club.yearFounded}
           </p>
        </div>
        <div className="flex gap-2">
           <Badge variant="outline" className="text-lg px-4 py-1 border-primary/20 bg-primary/5">
             <DollarSign className="w-4 h-4 mr-1 text-green-600" />
             ${club.balance?.toLocaleString()}
           </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Stadium Capacity</CardTitle>
             <Users className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">{club.stadiumCap?.toLocaleString()}</div>
             <p className="text-xs text-muted-foreground">{club.stadiumName}</p>
           </CardContent>
        </Card>
        
        <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">League Position</CardTitle>
             <TrendingUp className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">#{club.point > 0 ? "5" : "-"}</div>
             <p className="text-xs text-muted-foreground">{club.point} Points</p>
           </CardContent>
        </Card>

        <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Tactical Style</CardTitle>
             <Flag className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">{club.formation || "4-4-2"}</div>
             <p className="text-xs text-muted-foreground">Standard</p>
           </CardContent>
        </Card>
        
        <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Next Match</CardTitle>
             <Calendar className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">vs ARS</div>
             <p className="text-xs text-muted-foreground">Home Game</p>
           </CardContent>
        </Card>
      </div>

      {/* Kit Preview Section */}
      <Card>
        <CardHeader>
           <CardTitle>Club Identity</CardTitle>
           <CardDescription>Primary and secondary kit colors.</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-8">
           <div className="space-y-2 text-center">
              <div 
                className="w-24 h-24 rounded-full shadow-lg border-4 border-white mx-auto flex items-center justify-center"
                style={{ backgroundColor: club.primaryColor }}
              >
                <div className="w-8 h-8 rounded-full bg-white opacity-20" />
              </div>
              <p className="text-sm font-semibold">Home Kit</p>
           </div>
           
           <div className="space-y-2 text-center">
              <div 
                className="w-24 h-24 rounded-full shadow-lg border-4 border-white mx-auto flex items-center justify-center"
                style={{ backgroundColor: club.secondaryColor }}
              >
                <div className="w-8 h-8 rounded-full bg-black opacity-10" />
              </div>
              <p className="text-sm font-semibold">Away Kit</p>
           </div>
        </CardContent>
      </Card>
    </div>
  )
}
