import { Link, useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, PlusCircle, BarChart3, Zap, Shield, Loader2, User, Calendar, Download, Trash2 } from "lucide-react"
import { motion } from "framer-motion"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/api"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const Homepage = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: games, isLoading: isLoadingGames } = useQuery({
    queryKey: ['my-games'],
    queryFn: api.getMyGames
  })

  return (
    <div className="p-6 space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 space-y-4">
        <motion.h1 
          className="text-4xl md:text-6xl font-bold tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to{" "}
          <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent inline-block">
            Foot Lab
          </span>
        </motion.h1>
        <motion.p 
          className="text-muted-foreground text-lg max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Create custom leagues, track standings, and follow real Premier League data in one place.
        </motion.p>
      </div>

      {/* Quick Actions */}
      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        
        {/* Career Section (Focus) */}
        <div className="lg:col-span-2 space-y-6">
           <h2 className="text-2xl font-bold flex items-center gap-2">
             <Shield className="h-6 w-6 text-primary" />
             Career Mode
           </h2>
           <motion.div 
             variants={container}
             initial="hidden"
             animate="show"
             className="grid gap-4 md:grid-cols-2"
           >
            <Link to="/new-game">
                <Card className="h-full border-primary/50 bg-gradient-to-br from-card to-primary/5 hover:shadow-primary/20 hover:shadow-lg transition-all cursor-pointer group">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <PlusCircle className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                      New Game
                    </CardTitle>
                    <CardDescription>Start a new managerial career with real clubs.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">Start Career</Button>
                  </CardContent>
                </Card>
              </Link>

              {/* Load Game with Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="h-full border-muted bg-card/50 hover:bg-card/80 transition-all cursor-pointer hover:border-primary/50 group">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                          <Shield className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                          Load Game
                        </CardTitle>
                        <CardDescription>Continue your existing save file.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline" className="w-full">
                           {isLoadingGames ? "Loading..." : `${games?.length || 0} Saves Found`}
                        </Button>
                      </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Load Saved Game</DialogTitle>
                    <DialogDescription>Select a save file to continue your journey.</DialogDescription>
                  </DialogHeader>
                  <div className="h-[400px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                      {isLoadingGames ? (
                          <div className="flex justify-center py-10">
                              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                          </div>
                      ) : games?.length === 0 ? (
                          <div className="text-center py-10 space-y-4">
                             <p className="text-muted-foreground">No saved games found.</p>
                             <Button onClick={() => navigate('/new-game')}>Start New Game</Button>
                          </div>
                      ) : (
                          games?.map((game: any) => (
                              <Card 
                                  key={game.id} 
                                  className="cursor-pointer transition-all hover:border-primary/50 hover:bg-muted/50"
                                  onClick={() => {
                                      if (game.managedClubId) {
                                          window.location.href = `/dashboard/${game.managedClubId}/overview`
                                      } else {
                                          // Fallback for unemployed or error state?
                                          // For now, let's assume they have a club or handle it elsewhere
                                          console.error("No managed club ID found for game", game.id)
                                          alert("Error: This save file seems to be missing a club assignment.")
                                      }
                                  }}
                              >
                                  <CardContent className="p-4 flex items-center justify-between group/card">
                                      <div className="space-y-1">
                                          <div className="flex items-center gap-2">
                                              <User className="h-4 w-4 text-muted-foreground" />
                                              <span className="font-bold">{game.managerName}</span>
                                          </div>
                                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                              <Shield className="h-3 w-3" />
                                              <span>{game.clubName || "Unemployed"}</span>
                                          </div>
                                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                              <Calendar className="h-3 w-3" />
                                              <span>
                                                Last played: {new Date(game.updatedAt).toLocaleDateString()} at {new Date(game.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                              </span>
                                          </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <AlertDialog>
                                          <AlertDialogTrigger asChild>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="text-destructive opacity-0 group-hover/card:opacity-100 transition-opacity hover:bg-destructive/10"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </AlertDialogTrigger>
                                          <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                                            <AlertDialogHeader>
                                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                              <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete the save file 
                                                <span className="font-bold text-foreground"> "{game.managerName} - {game.clubName || "Unemployed"}" </span>
                                                and remove all associated data from the database.
                                              </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                                              <AlertDialogAction 
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                onClick={() => {
                                                    api.deleteGame(game.id).then(() => {
                                                        queryClient.invalidateQueries({ queryKey: ['my-games'] })
                                                    })
                                                }}
                                              >
                                                Delete Permanently
                                              </AlertDialogAction>
                                            </AlertDialogFooter>
                                          </AlertDialogContent>
                                        </AlertDialog>

                                        <Button variant="ghost" size="icon">
                                            <Download className="h-4 w-4" />
                                        </Button>
                                      </div>
                                  </CardContent>
                              </Card>
                          ))
                      )}
                  </div>
                </DialogContent>
              </Dialog>
           </motion.div>

           <h2 className="text-2xl font-bold flex items-center gap-2 mt-8">
             <Trophy className="h-6 w-6 text-yellow-500" />
             League Tools
           </h2>
           <div className="grid gap-4 md:grid-cols-2">
              <Link to="/view-klasemen">
                <Card className="hover:border-yellow-500/50 transition-all cursor-pointer hover:shadow-md">
                   <CardHeader className="flex flex-row items-center gap-4 pb-2">
                      <div className="p-2 rounded-lg bg-yellow-500/10">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div>
                        <CardTitle className="text-base">Custom League Standings</CardTitle>
                      </div>
                   </CardHeader>
                   <CardContent>
                     <p className="text-sm text-muted-foreground">View and manage standings for your custom tournaments.</p>
                   </CardContent>
                </Card>
              </Link>

              <Link to="/input-match">
                <Card className="hover:border-green-500/50 transition-all cursor-pointer hover:shadow-md">
                   <CardHeader className="flex flex-row items-center gap-4 pb-2">
                      <div className="p-2 rounded-lg bg-green-500/10">
                        <BarChart3 className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <CardTitle className="text-base">Input Match Result</CardTitle>
                      </div>
                   </CardHeader>
                   <CardContent>
                     <p className="text-sm text-muted-foreground">Manually record scores for custom league matches.</p>
                   </CardContent>
                </Card>
              </Link>
           </div>
        </div>

        {/* Live Data Sidebar */}
        <div className="space-y-6">
           <h2 className="text-2xl font-bold flex items-center gap-2">
             <Zap className="h-6 w-6 text-blue-500" />
             Live Data
           </h2>
           <Card className="border-blue-500/20 bg-blue-500/5">
              <CardHeader>
                <CardTitle className="text-lg">Premier League Live</CardTitle>
                <CardDescription>Real-time standings integration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <p className="text-sm text-muted-foreground">
                   Check the latest EPL table without leaving your dashboard.
                 </p>
                 <Link to="/real-klasemen">
                   <Button variant="outline" className="w-full border-blue-500/50 hover:bg-blue-500/10 text-blue-500">
                     Open Live Standings
                   </Button>
                 </Link>
              </CardContent>
           </Card>
        </div>

      </div>

      {/* Feature Highlight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="glass border-primary/20 bg-gradient-to-br from-card to-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="animate-pulse">⚽</span> Real-time Premier League Data
            </CardTitle>
            <CardDescription>
              Get live standings from Football-Data.org API with team logos and up-to-date stats.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/real-klasemen">
              <Button size="lg" className="w-full sm:w-auto">View Live Standings →</Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default Homepage
