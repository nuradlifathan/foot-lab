import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Player } from "@/api"
import { User, Shield, Gauge, Crosshair, Footprints, Dumbbell } from "lucide-react"
import { cn } from "@/lib/utils"

interface PlayerCardProps {
  player: Player
}

const StatBar = ({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: string }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <Icon className="h-3 w-3" /> {label}
      </span>
      <span className={cn("text-xs", value >= 90 ? "text-yellow-500" : "text-foreground")}>{value}</span>
    </div>
    <Progress value={value} className={cn("h-1.5 bg-muted/30", `[&>div]:${color}`)} />
  </div>
)

const PlayerCard = ({ player }: PlayerCardProps) => {
  // Determine card border/glow based on rating tiers
  const getRatingColor = (rating: number) => {
    if (rating >= 90) return "border-yellow-500/50 shadow-yellow-500/10 from-yellow-950/20" // Legendary
    if (rating >= 85) return "border-purple-500/50 shadow-purple-500/10 from-purple-950/20" // Elite
    if (rating >= 80) return "border-blue-500/50 shadow-blue-500/10 from-blue-950/20" // Gold
    if (rating >= 75) return "border-green-500/50 shadow-green-500/10 from-green-950/20" // Silver
    return "border-border from-card" // Base
  }

  const ratingColor = getRatingColor(player.overall)

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
      "bg-gradient-to-br to-background/50",
      ratingColor
    )}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-8 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors" />

      <CardHeader className="pb-2 relative z-10 flex flex-row justify-between items-start space-y-0">
        <div className="flex items-center gap-3">
          <div className={cn(
            "h-12 w-12 rounded-full flex items-center justify-center border-2 shadow-sm",
            "bg-gradient-to-br from-background to-muted",
            player.overall >= 80 ? "border-primary/50" : "border-border"
          )}>
            <User className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
              {player.name}
            </h3>
            <Badge variant="secondary" className="mt-1 text-[10px] font-bold px-1.5 py-0 h-5">
              {player.position}
            </Badge>
          </div>
        </div>
        
        <div className="text-center bg-card/50 backdrop-blur-sm p-1.5 rounded-lg border border-border/50">
          <span className={cn(
            "text-2xl font-black block leading-none tracking-tighter",
            player.overall >= 90 ? "text-yellow-500 drop-shadow-[0_2px_4px_rgba(234,179,8,0.3)]" : 
            player.overall >= 80 ? "text-primary" : "text-foreground"
          )}>
            {player.overall}
          </span>
          <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">OVR</span>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-x-4 gap-y-3 pt-3 relative z-10">
        <StatBar label="PAC" value={player.pace} icon={Gauge} color="bg-blue-500" />
        <StatBar label="SHO" value={player.shooting} icon={Crosshair} color="bg-red-500" />
        <StatBar label="PAS" value={player.passing} icon={Footprints} color="bg-green-500" />
        <StatBar label="DRI" value={player.dribbling} icon={User} color="bg-yellow-500" />
        <StatBar label="DEF" value={player.defending} icon={Shield} color="bg-purple-500" />
        <StatBar label="PHY" value={player.physical} icon={Dumbbell} color="bg-orange-500" />
      </CardContent>
    </Card>
  )
}

export default PlayerCard
