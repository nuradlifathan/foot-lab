import { useState } from "react"
import { toast } from "sonner"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { API, api } from "../api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart3, Plus, Trash2, Send, BrainCircuit, Loader2 } from "lucide-react"

// ... imports

interface Match {
  ClubId: string
  opponent_name: string
  score: string
}

interface Club {
  id: number
  team: string
}

const InputScoreForm = () => {
  const [matches, setMatches] = useState<Match[]>([
    { ClubId: "", opponent_name: "", score: "" },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()

  const { data: clubs, isLoading: clubsLoading } = useQuery<Club[]>({
    queryKey: ["clubs"],
    queryFn: api.getAllClubs,
  })

  const handleMatchChange = (index: number, key: keyof Match, value: string) => {
    const updatedMatches = [...matches]
    updatedMatches[index][key] = value
    setMatches(updatedMatches)
  }

  const addMatch = () => {
    setMatches([...matches, { ClubId: "", opponent_name: "", score: "" }])
  }

  const removeMatch = (index: number) => {
    if (matches.length > 1) {
      setMatches(matches.filter((_, i) => i !== index))
    }
  }

  const handleSaveClick = async () => {
    setIsLoading(true)
    try {
      for (const match of matches) {
        await API.post("/klub/input-score", {
          ClubId: parseInt(match.ClubId),
          opponent_name: match.opponent_name,
          score: match.score,
        })
      }
      setMatches([{ ClubId: "", opponent_name: "", score: "" }])
      queryClient.invalidateQueries({ queryKey: ["klasemen"] })
      toast.success("Match results saved successfully!")
    } catch (err) {
      console.error(err)
      toast.error("Failed to save match results")
    } finally {
      setIsLoading(false)
    }
  }

  const isSaveDisabled = matches.some(
    (match) => !match.ClubId || !match.opponent_name || !match.score
  ) || isLoading

  const handleSimulate = async (index: number) => {
    const match = matches[index]
    if (!match.ClubId || !match.opponent_name) {
      toast.error("Please select both clubs first")
      return
    }

    // Find opponent ID
    const opponent = clubs?.find(c => c.team === match.opponent_name)
    if (!opponent) return

    try {
      const loadingToast = toast.loading("Simulating match...")
      
      const res = await API.post("/klub/simulate", {
        homeId: match.ClubId,
        awayId: opponent.id
      })
      
      const { homeScore, awayScore, events } = res.data
      
      handleMatchChange(index, "score", `${homeScore}-${awayScore}`)
      
      toast.dismiss(loadingToast)
      toast.success(`Simulation complete!`, {
        description: `${events.length} important events generated.`
      })
    } catch (err) {
      console.error(err)
      toast.error("Simulation failed")
    }
  }

  if (clubsLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-500/10">
              <BarChart3 className="h-8 w-8 text-green-500" />
            </div>
            <div>
              <CardTitle className="text-2xl">Input Match Results</CardTitle>
              <CardDescription>Record match results for your custom league</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Matches */}
      <div className="space-y-4">
        {matches.map((match, index) => (
          <Card key={index} className="animate-fade-in">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Match {index + 1}</CardTitle>
                {matches.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMatch(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Home Club</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={match.ClubId}
                    onChange={(e) => handleMatchChange(index, "ClubId", e.target.value)}
                  >
                    <option value="">Select club...</option>
                    {clubs?.map((club) => (
                      <option key={club.id} value={club.id}>
                        {club.team}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Away Club</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={match.opponent_name}
                    onChange={(e) => handleMatchChange(index, "opponent_name", e.target.value)}
                  >
                    <option value="">Select opponent...</option>
                    {clubs?.map((club) => (
                      <option key={club.id} value={club.team}>
                        {club.team}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Score</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g. 3-1"
                      value={match.score}
                      onChange={(e) => handleMatchChange(index, "score", e.target.value)}
                    />
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      onClick={() => handleSimulate(index)}
                      title="Simulate with AI"
                      disabled={!match.ClubId || !match.opponent_name}
                    >
                      <BrainCircuit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={addMatch}>
          <Plus className="h-4 w-4 mr-2" />
          Add Match
        </Button>
        <Button onClick={handleSaveClick} disabled={isSaveDisabled} isLoading={isLoading}>
          <Send className="h-4 w-4 mr-2" />
          Save Results
        </Button>
      </div>
    </div>
  )
}

export default InputScoreForm