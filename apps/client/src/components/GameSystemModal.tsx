
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../api"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Save, Download, LogOut, CheckCircle2, Loader2, Calendar, User, Shield } from "lucide-react"

interface GameSystemModalProps {
  children: React.ReactNode
}

// Simple TimeAgo helper
function timeAgo(dateParam: string | Date) {
  if (!dateParam) return null;
  const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
  const today = new Date();
  const seconds = Math.round((today.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const months = Math.round(days / 30);
  const years = Math.round(days / 365);

  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds} seconds ago`;
  if (seconds < 90) return 'a minute ago';
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  if (days < 30) return `${days} days ago`;
  if (months < 12) return `${months} months ago`;
  return `${years} years ago`;
}

interface GameSystemModalProps {
  children: React.ReactNode
  gameId?: string
}

// ... timeAgo function ...

export const GameSystemModal = ({ children, gameId: propGameId }: GameSystemModalProps) => {
  const { gameId: paramGameId } = useParams()
  const gameId = propGameId || paramGameId // Prioritize prop, fallback to param
  
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("save")

  // Fetch all games for Load tab
  const { data: games, isLoading: isLoadingGames, refetch: refetchGames } = useQuery({
    queryKey: ['my-games'],
    queryFn: api.getMyGames,
    enabled: open && activeTab === 'load' // Only fetch when load tab is active
  })

  // Save Mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!gameId) throw new Error("No game ID")
      return api.saveGame(gameId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-games'] })
      // Verify saved state?
      // Optional: Show toast or visual feedback
    }
  })

  // Handle Load Game
  const handleLoad = (targetGameId: string) => {
    // If loading same game, just close? Or force reload?
    if (targetGameId === gameId) {
      setOpen(false)
      window.location.reload() // Hard reload to be safe
    } else {
      setOpen(false)
      // Navigate to dashboard of that game
      // Force reload to clear any state from previous game
      window.location.href = `/dashboard/${targetGameId}/overview`
    }
  }

  // Handle Exit
  const handleExit = () => {
    navigate('/dashboard')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Game System</DialogTitle>
          <DialogDescription>
            Manage your save files and game session.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="save" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="save">Save Game</TabsTrigger>
            <TabsTrigger value="load">Load Game</TabsTrigger>
          </TabsList>
          
          {/* SAVE TAB */}
          <TabsContent value="save" className="space-y-4 py-4">
            <Card className="bg-muted/50 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                <div className="p-4 bg-primary/10 rounded-full">
                   <Save className="h-10 w-10 text-primary" />
                </div>
                <div>
                   <h3 className="text-xl font-bold">Current Session</h3>
                   <p className="text-muted-foreground text-sm">Save your progress for {new Date().toLocaleDateString()}</p>
                </div>
                
                {saveMutation.isSuccess ? (
                    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                        <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
                        <p className="text-green-600 font-bold">Game Saved Successfully!</p>
                        <p className="text-xs text-muted-foreground">Last saved: {new Date().toLocaleTimeString()}</p>
                        <Button variant="outline" size="sm" onClick={() => saveMutation.reset()} className="mt-4">
                           Save Again
                        </Button>
                    </div>
                ) : (
                    <Button 
                        size="lg" 
                        onClick={() => saveMutation.mutate()} 
                        disabled={saveMutation.isPending}
                        className="w-full max-w-xs"
                    >
                        {saveMutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Game"
                        )}
                    </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* LOAD TAB */}
          <TabsContent value="load" className="space-y-4 py-4">
            <div className="h-[300px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {isLoadingGames ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : games?.length === 0 ? (
                    <p className="text-center text-muted-foreground py-10">No saved games found.</p>
                ) : (
                    games?.map((game: any) => (
                        <Card 
                            key={game.id} 
                            className={`cursor-pointer transition-all hover:border-primary/50 hover:bg-muted/50 ${game.id === gameId ? 'border-primary bg-primary/5' : ''}`}
                            onClick={() => handleLoad(game.id)}
                        >
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-bold">{game.managerName}</span>
                                        {game.id === gameId && <Badge variant="default" className="text-[10px]">Current</Badge>}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Shield className="h-3 w-3" />
                                        <span>{game.clubName || "Unemployed"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Calendar className="h-3 w-3" />
                                        <span>Last played: {timeAgo(game.updatedAt)}</span>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon">
                                    <Download className="h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="border-t pt-4">
          <Button variant="destructive" onClick={handleExit} className="gap-2">
            <LogOut className="h-4 w-4" />
            Exit to Main Menu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
