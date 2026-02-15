
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useQuery, useMutation } from "@tanstack/react-query"
import { Trophy, User, ArrowRight, Check, Globe } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

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
  const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(null) // State for League

  // ... (useEffect for manager name)

  // Fetch Leagues
  const { data: leagues, isLoading: isLoadingLeagues } = useQuery({
    queryKey: ['leagues'],
    queryFn: api.getLeagues
  })

  // Fetch Master Clubs
  const { data: rawClubs, isLoading } = useQuery({
    queryKey: ['master-clubs-v4'], // Bump to v4
    queryFn: async () => {
      const res = await api.getAllClubs() 
      return res 
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always'
  })

  // Client-side filtering to remove zombie data (ID < 100)
  const clubs = rawClubs?.filter((c: any) => c.id >= 100)

  // Create Game Mutation
  const createGameMutation = useMutation({
    mutationFn: async (data: { managerName: string, clubId: number }) => {
      const res = await api.post('/game', data)
      return res.data
    },
    onSuccess: (data) => {
      // Redirect to the Club Dashboard directly
      if (data.managedClubId) {
        navigate(`/dashboard/${data.managedClubId}`)
      } else {
        navigate('/dashboard')
      }
    },
    onError: (err: any) => {
      console.error(err)
      // Show specific error from backend if available
      const msg = err.response?.data?.error || "Failed to start game"
      alert(msg)
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

        {/* Step 2: League Selection */}
        {step === 2 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Globe className="text-blue-500" /> Select League
              </h2>
            </div>
            
            {isLoadingLeagues ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {leagues?.map((league: any) => (
                  <div 
                    key={league.id}
                    onClick={() => {
                      if (league.name === 'Premier League') {
                        setSelectedLeagueId(league.id)
                        setStep(3)
                      } else {
                        alert("Coming Soon! Only Premier League is available.")
                      }
                    }}
                    className={`
                      relative cursor-pointer group border rounded-xl overflow-hidden transition-all duration-200 p-6 flex items-center gap-4
                      ${selectedLeagueId === league.id 
                        ? 'ring-2 ring-primary border-transparent bg-primary/5' 
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'}
                    `}
                  >
                    <div className="text-4xl">{league.country?.flag}</div>
                    <div className="flex-1">
                       <h3 className="font-bold text-lg">{league.name}</h3>
                       <p className="text-sm text-muted-foreground">{league.country?.name}</p>
                    </div>
                    {/* League Logo */}
                    {league.logo && (
                      <img src={league.logo} alt={league.name} className="w-12 h-12 object-contain grayscale group-hover:grayscale-0 transition-all" />
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <Button variant="ghost" onClick={() => setStep(1)} className="mt-4">Back</Button>
          </motion.div>
        )}

        {/* Step 3: Club Selection */}
        {step === 3 && (
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
                {clubs?.filter((c:any) => c.leagueId === selectedLeagueId || !c.leagueId).map((club:any) => (
                  <div 
                    key={club.id}
                  // ... rest of club card
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
                         {/* Logo or Placeholder */}
                         {club.logo ? (
                            <img 
                              src={club.logo} 
                              alt={club.name} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-contain p-2"
                              onError={(e) => {
                                // Fallback if image fails
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                         ) : (
                           <span className="text-2xl font-bold">{club.name.substring(0, 1)}</span>
                         )}
                         {/* Fallback Element (Hidden by default, shown on error) */}
                         <span className="hidden text-2xl font-bold absolute">{club.name.substring(0, 1)}</span>
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
