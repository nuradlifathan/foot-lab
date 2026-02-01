
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useQuery, useMutation } from "@tanstack/react-query"
import { Trophy, User, ArrowRight, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useAuth } from "@/context/AuthContext"
import { api } from "@/api"

const NewGame = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [step, setStep] = useState(1)
  const [managerName, setManagerName] = useState("")
  const [selectedClubId, setSelectedClubId] = useState<number | null>(null)

  // Use user's name as default
  useEffect(() => {
    if (user?.name) setManagerName(user.name)
  }, [user])

  // Fetch Master Clubs
  const { data: clubs, isLoading } = useQuery({
    queryKey: ['master-clubs'],
    queryFn: async () => {
      const res = await api.get('/club') // Currently fetching all, assume they are master if no gameId context? 
      // Actually getAllClubs fetches all. We might need to filter or update backend to support ?type=master
      // For now, assuming listing all is fine as we only have master data seeded initially.
      return res.data
    }
  })

  // Create Game Mutation
  const createGameMutation = useMutation({
    mutationFn: async (data: { managerName: string, clubId: number }) => {
      const res = await api.post('/game', data)
      return res.data
    },
    onSuccess: (data) => {
      // Redirect to the Game Dashboard with the new Game ID
      // We might need to store activeGameId in context, but for now URL param is safer
      // Wait, dashboard route is /dashboard (for user homepage) or /dashboard/:clubId?
      // We need a Game Dashboard Route. Let's send to /game/:gameId/dashboard
      navigate(`/dashboard`) // Temporary fallback
    },
    onError: (err) => {
      console.error(err)
      alert("Failed to start game")
    }
  })

  const handleStartGame = () => {
    if (!managerName || !selectedClubId) return
    createGameMutation.mutate({ managerName, clubId: selectedClubId })
  }

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center">
      <div className="max-w-4xl w-full space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">New Career</h1>
          <p className="text-muted-foreground">Begin your journey as a football manager</p>
        </div>

        {/* Steps Progress */}
        <div className="flex justify-center gap-4">
          <div className={`h-2 w-20 rounded-full transition-colors ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`h-2 w-20 rounded-full transition-colors ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
        </div>

        {/* Step 1: Manager Profile */}
        {step === 1 && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-md mx-auto space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><User className="text-primary" /> Manager Profile</CardTitle>
                <CardDescription>How should the press address you?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input 
                    placeholder="e.g. Pep Guardiola" 
                    value={managerName} 
                    onChange={(e) => setManagerName(e.target.value)}
                  />
                </div>
                <Button 
                  className="w-full" 
                  disabled={!managerName}
                  onClick={() => setStep(2)}
                >
                  Next Step <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Club Selection */}
        {step === 2 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Trophy className="text-yellow-500" /> Select Your Team
              </h2>
              <Button 
                size="lg"
                disabled={!selectedClubId || createGameMutation.isPending}
                onClick={handleStartGame}
              >
                {createGameMutation.isPending ? "Setting up Database..." : "Start Career"}
              </Button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-40 bg-muted/20 animate-pulse rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {clubs?.map((club:any) => (
                  <div 
                    key={club.id}
                    onClick={() => setSelectedClubId(club.id)}
                    className={`relative cursor-pointer group border rounded-xl overflow-hidden transition-all duration-200
                      ${selectedClubId === club.id 
                        ? 'ring-2 ring-primary border-transparent scale-105 shadow-lg bg-primary/5' 
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'}
                    `}
                  >
                     {/* Selection Checkmark */}
                     {selectedClubId === club.id && (
                       <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1 z-10">
                         <Check className="h-3 w-3" />
                       </div>
                     )}

                     {/* Club Card Content */}
                     <div className="p-4 flex flex-col items-center gap-3 text-center h-full">
                       <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-2xl shadow-inner">
                         {/* Placeholder Logo if no image */}
                         {club.name.substring(0, 1)}
                       </div>
                       <div>
                         <h3 className="font-bold leading-tight">{club.name}</h3>
                         <p className="text-xs text-muted-foreground mt-1">{club.city}</p>
                       </div>
                       
                       {/* Color Strip */}
                       <div className="w-full h-2 rounded-full mt-auto flex overflow-hidden">
                          <div style={{ backgroundColor: club.primaryColor }} className="flex-1" />
                          <div style={{ backgroundColor: club.secondaryColor || '#fff' }} className="flex-1" />
                       </div>
                     </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

      </div>
    </div>
  )
}

export default NewGame
