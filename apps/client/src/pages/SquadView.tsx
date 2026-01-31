import { useParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/api"
import PlayerCard from "@/components/PlayerCard"
import { Button } from "@/components/ui/button"
import { UserPlus, ArrowLeft, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"

const SquadView = () => {
  const { clubId } = useParams()
  
  const { data: players, isLoading } = useQuery({
    queryKey: ["players", clubId],
    queryFn: () => api.getPlayersByClub(Number(clubId)),
    enabled: !!clubId
  })

  // We might want to fetch club details too for the header name
  const { data: clubs } = useQuery({
    queryKey: ["clubs"],
    queryFn: api.getAllClubs
  })

  const clubName = clubs?.find((c: any) => c.id === Number(clubId))?.team || "Club Squad"

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        <div>
          {/* Back link removed for dashboard layout */}

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl font-black tracking-tight flex items-center gap-3"
              >
                <span className="text-4xl">🛡️</span> {clubName}
              </motion.h1>
              <p className="text-muted-foreground mt-2 text-lg">Manage your squad depth and player development.</p>
            </div>
            
            <Link to={`/create-player/${clubId}`}>
              <Button size="lg" className="shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                <UserPlus className="mr-2 h-5 w-5" /> Recruit Player
              </Button>
            </Link>
          </div>
        </div>

      </div>

      {!players || players.length === 0 ? (
        <div className="text-center py-20 border rounded-lg bg-muted/20 border-dashed">
          <p className="text-muted-foreground mb-4">No players found in this squad.</p>
          <div className="flex gap-4 justify-center">
            <Link to={`/create-player/${clubId}`}>
               <Button variant="outline">Create First Player</Button>
            </Link>
            <Button 
              variant="default" 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={async () => {
                if (!clubId) return
                try {
                  toast.loading("Scouting 25 players...")
                  await api.generateSquad({ clubId: Number(clubId), country: 'EN' })
                  toast.dismiss()
                  toast.success("Squad recruited successfully! ⚽")
                  window.location.reload() // Quick refresh to show players
                } catch (e) {
                  toast.dismiss()
                  toast.error("Failed to recruit squad")
                }
              }}
            >
              🚀 Auto-Recruit Full Squad
            </Button>
          </div>
        </div>
      ) : (
        <motion.div 
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {players.map((player) => (
            <motion.div key={player.id} variants={item}>
              <PlayerCard player={player} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

export default SquadView
