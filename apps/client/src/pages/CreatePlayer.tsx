
import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { api } from "@/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Dice5, Save, ArrowLeft, Sparkles, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

// --- Manual Form Schema ---
const playerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  position: z.enum(["GK", "DEF", "MID", "ATK"]),
  pace: z.number().min(1).max(99),
  shooting: z.number().min(1).max(99),
  passing: z.number().min(1).max(99),
  dribbling: z.number().min(1).max(99),
  defending: z.number().min(1).max(99),
  physical: z.number().min(1).max(99),
  stamina: z.number().min(1).max(99),
  overall: z.number().optional()
})

type PlayerFormValues = z.infer<typeof playerSchema>

// --- AI Generator Component ---
const AIGenerator = ({ clubId, onSuccess }: { clubId: string; onSuccess: () => void }) => {
  const [position, setPosition] = useState("ATK")
  const [country, setCountry] = useState("EN")
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const player = await api.generatePlayer({
        clubId: Number(clubId),
        position,
        country
      })
      toast.success(`Generated: ${player.name} (${player.position} - OVR ${player.overall})`)
      onSuccess()
    } catch (err) {
      toast.error("Failed to generate player")
    } finally {
      setLoading(false)
    }
  }

  const countries = [
    { code: "EN", name: "England 🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
    { code: "ES", name: "Spain 🇪🇸" },
    { code: "IT", name: "Italy 🇮🇹" },
    { code: "DE", name: "Germany 🇩🇪" },
    { code: "FR", name: "France 🇫🇷" },
    { code: "BR", name: "Brazil 🇧🇷" },
    { code: "AR", name: "Argentina 🇦🇷" },
    { code: "ID", name: "Indonesia 🇮🇩" },
  ]

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="text-primary h-5 w-5" />
          AI Scout Engine
        </CardTitle>
        <CardDescription>
          Instantly find a talent from specific regions. 
          There is a <span className="font-bold text-primary">5% chance</span> to find a Wonderkid!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
             <label className="text-sm font-medium">Position Needed</label>
             <Select value={position} onValueChange={setPosition}>
               <SelectTrigger className="bg-background">
                 <SelectValue />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="GK">Goalkeeper (GK)</SelectItem>
                 <SelectItem value="DEF">Defender (DEF)</SelectItem>
                 <SelectItem value="MID">Midfielder (MID)</SelectItem>
                 <SelectItem value="ATK">Attacker (ATK)</SelectItem>
               </SelectContent>
             </Select>
          </div>
          
          <div className="space-y-2">
             <label className="text-sm font-medium">Scouting Region</label>
             <Select value={country} onValueChange={setCountry}>
               <SelectTrigger className="bg-background">
                 <SelectValue />
               </SelectTrigger>
               <SelectContent>
                 {countries.map(c => (
                   <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
          </div>
        </div>

        <Button 
          size="lg" 
          className="w-full text-lg h-12 bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 transition-opacity"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Dice5 className="mr-2 h-5 w-5" />
          )}
          {loading ? "Scouting..." : "Generate Player"}
        </Button>
      </CardContent>
    </Card>
  )
}


// --- Main Component ---
const CreatePlayer = () => {
  const { clubId } = useParams()
  const navigate = useNavigate()
  const [isGenerating, setIsGenerating] = useState(false)

  const form = useForm<PlayerFormValues>({
    resolver: zodResolver(playerSchema),
    defaultValues: {
       name: "", position: "MID", pace: 50, shooting: 50, 
       passing: 50, dribbling: 50, defending: 50, physical: 50, stamina: 70
    }
  })

  // Calculate Overall Rating manually for the form
  const calculateOverall = (values: PlayerFormValues) => {
    const { position, pace, shooting, passing, dribbling, defending, physical } = values
    let ovr = 0
    switch (position) {
      case "GK": ovr = (defending * 0.4) + (physical * 0.3) + (passing * 0.1) + (pace * 0.2); break
      case "DEF": ovr = (defending * 0.4) + (physical * 0.3) + (pace * 0.15) + (passing * 0.15); break
      case "MID": ovr = (passing * 0.35) + (dribbling * 0.25) + (defending * 0.2) + (shooting * 0.1) + (pace * 0.1); break
      case "ATK": ovr = (shooting * 0.4) + (pace * 0.25) + (dribbling * 0.25) + (physical * 0.1); break
    }
    return Math.round(ovr)
  }

  // Legacy local randomizer for the form
  const fillRandomForm = () => {
    setIsGenerating(true)
    setTimeout(() => {
      const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
      const position = form.getValues("position")
      let stats = { pace: rand(40,90), shooting: rand(30,85), passing: rand(40,88), dribbling: rand(40,90), defending: rand(30,85), physical: rand(50,90), stamina: rand(60,95) }
      
      if (position === "ATK") { stats.shooting = rand(70,95); stats.pace = rand(70,95) }
      else if (position === "MID") { stats.passing = rand(75,95); stats.dribbling = rand(70,90) }
      else if (position === "DEF") { stats.defending = rand(75,95); stats.physical = rand(70,95) }
      else if (position === "GK") { stats.defending = rand(75,95); stats.pace = rand(30,60); stats.shooting = rand(10,40) }

      form.setValue("pace", stats.pace); form.setValue("shooting", stats.shooting)
      form.setValue("passing", stats.passing); form.setValue("dribbling", stats.dribbling)
      form.setValue("defending", stats.defending); form.setValue("physical", stats.physical)
      form.setValue("stamina", stats.stamina)
      setIsGenerating(false)
      toast.success("Form filled with random stats!")
    }, 400)
  }

  const onSubmit = async (values: PlayerFormValues) => {
    try {
      const overall = calculateOverall(values)
      await api.createPlayer({
        clubId: Number(clubId),
        ...values,
        overall
      })
      toast.success(`Player ${values.name} recruited successfully!`)
      navigate(`/squad/${clubId}`)
    } catch (error) {
      toast.error("Failed to create player")
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Squad
        </Button>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Tabs defaultValue="ai" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="ai">🤖 AI Generator</TabsTrigger>
            <TabsTrigger value="manual">✍️ Manual Input</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ai">
            <AIGenerator clubId={clubId!} onSuccess={() => navigate(`/squad/${clubId}`)} />
          </TabsContent>
          
          <TabsContent value="manual">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Manual Scouting</CardTitle>
                    <CardDescription>Design your player attribute by attribute.</CardDescription>
                  </div>
                   <Button variant="outline" size="sm" onClick={fillRandomForm} disabled={isGenerating}>
                    <Dice5 className={`mr-2 h-3 w-3 ${isGenerating ? "animate-spin" : ""}`} />
                    Quick Fill
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Player Name</FormLabel><FormControl><Input placeholder="Name" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="position" render={({ field }) => (
                         <FormItem><FormLabel>Position</FormLabel>
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                             <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                             <SelectContent>
                               <SelectItem value="GK">GK</SelectItem><SelectItem value="DEF">Defender</SelectItem>
                               <SelectItem value="MID">Midfielder</SelectItem><SelectItem value="ATK">Attacker</SelectItem>
                             </SelectContent>
                           </Select>
                         <FormMessage /></FormItem>
                      )} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {["pace", "shooting", "passing", "dribbling", "defending", "physical"].map((stat) => (
                        <FormField key={stat} control={form.control} name={stat as any} render={({ field }) => (
                          <FormItem>
                            <div className="flex justify-between"><FormLabel className="capitalize">{stat}</FormLabel><span className="text-xs font-bold">{field.value}</span></div>
                            <FormControl><Slider min={1} max={99} step={1} value={[field.value]} onValueChange={(v) => field.onChange(v[0])} /></FormControl>
                          </FormItem>
                        )} />
                      ))}
                    </div>
                    <FormField control={form.control} name="stamina" render={({ field }) => (
                       <FormItem><div className="flex justify-between"><FormLabel>Stamina</FormLabel><span className="text-xs font-bold">{field.value}</span></div>
                       <FormControl><Slider min={1} max={99} value={[field.value]} onValueChange={(v) => field.onChange(v[0])} /></FormControl></FormItem>
                    )} />
                    <Button type="submit" className="w-full">Save Player</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}

export default CreatePlayer
