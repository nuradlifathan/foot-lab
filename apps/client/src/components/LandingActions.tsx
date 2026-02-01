
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Shield, ChevronRight, Users, PlayCircle, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/api"

export const LandingActions = ({ isAuthenticated, user }: { isAuthenticated: boolean, user: any }) => {
  const navigate = useNavigate()

  // Fetch only if authenticated
  const { data: games, isLoading: isLoadingGames } = useQuery({
    queryKey: ['my-games'],
    queryFn: api.getMyGames,
    enabled: isAuthenticated
  })

  // Determine latest game
  const latestGame = games && games.length > 0 ? games[0] : null

  if (!isAuthenticated) {
    return (
      <Card className="max-w-md mx-auto border-primary/20 shadow-2xl bg-card/60 backdrop-blur-xl hover:shadow-primary/10 transition-shadow duration-500">
        <CardHeader>
          <CardTitle>Start Your Career</CardTitle>
          <CardDescription>Join the world of football management</CardDescription>
        </CardHeader>
        <CardContent>
             <Button 
               size="lg" 
               className="w-full h-14 text-lg relative overflow-hidden group" 
               onClick={() => navigate('/login')}
             >
               <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
               <div className="flex items-center gap-3">
                 <Users className="h-5 w-5" />
                 Login / Register
               </div>
               <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
             </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto border-primary/20 shadow-2xl bg-card/60 backdrop-blur-xl hover:shadow-primary/10 transition-shadow duration-500">
      <CardHeader>
        <CardTitle>Welcome back, {user?.name?.split(' ')[0]}!</CardTitle>
        <CardDescription>
            {isLoadingGames ? "Loading save files..." : (latestGame ? "Ready for change?" : "No active career found")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoadingGames ? (
            <div className="h-14 w-full bg-muted/20 animate-pulse rounded-md" />
        ) : latestGame ? (
            // Continue Button
             <Button 
               size="lg" 
               className="w-full h-16 text-lg relative overflow-hidden group flex flex-col items-start px-6"
               onClick={() => navigate('/dashboard')}
             >
               <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
               <div className="flex w-full items-center justify-between">
                   <div className="flex flex-col items-start">
                       <span className="text-xs text-primary-foreground/70 uppercase font-bold tracking-wider">Continue Career</span>
                       <span className="flex items-center gap-2 font-bold">
                           <Shield className="h-4 w-4" /> {latestGame.clubName || "Unemployed"}
                       </span>
                   </div>
                   <PlayCircle className="h-8 w-8 text-white/90" />
               </div>
             </Button>
        ) : (
            // New Game Button (If no save found)
             <Button 
               size="lg" 
               className="w-full h-14 text-lg relative overflow-hidden group bg-emerald-600 hover:bg-emerald-700"
               onClick={() => navigate('/new-game')}
             >
               <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
               <div className="flex items-center gap-3">
                 <PlusCircle className="h-5 w-5" />
                 Start New Career
               </div>
               <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
             </Button>
        )}
        
        {/* Secondary Action: Go to Main Menu */}
        <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground" onClick={() => navigate('/dashboard')}>
            Go to Main Menu
        </Button>

      </CardContent>
    </Card>
  )
}
