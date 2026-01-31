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
import { toast } from "sonner"
import { Dice5, Save, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"

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

const CreatePlayer = () => {
  const { clubId } = useParams()
  const navigate = useNavigate()
  const [isGenerating, setIsGenerating] = useState(false)

  const form = useForm<PlayerFormValues>({
    resolver: zodResolver(playerSchema),
    defaultValues: {
      name: "",
      position: "MID",
      pace: 50,
      shooting: 50,
      passing: 50,
      dribbling: 50,
      defending: 50,
      physical: 50,
      stamina: 70,
    }
  })

  // Calculate Overall Rating based on position weights
  const calculateOverall = (values: PlayerFormValues) => {
    const { position, pace, shooting, passing, dribbling, defending, physical } = values
    let ovr = 0
    
    // Simple improved weightings
    switch (position) {
      case "GK":
        ovr = (defending * 0.4) + (physical * 0.3) + (passing * 0.1) + (pace * 0.2)
        break
      case "DEF":
        ovr = (defending * 0.4) + (physical * 0.3) + (pace * 0.15) + (passing * 0.15)
        break
      case "MID":
        ovr = (passing * 0.35) + (dribbling * 0.25) + (defending * 0.2) + (shooting * 0.1) + (pace * 0.1)
        break
      case "ATK":
        ovr = (shooting * 0.4) + (pace * 0.25) + (dribbling * 0.25) + (physical * 0.1)
        break
    }
    return Math.round(ovr)
  }

  const generateRandomStats = () => {
    setIsGenerating(true)
    const position = form.getValues("position")
    
    // Simulate thinking
    setTimeout(() => {
      const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
      
      let stats = {
        pace: rand(40, 90),
        shooting: rand(30, 85),
        passing: rand(40, 88),
        dribbling: rand(40, 90),
        defending: rand(30, 85),
        physical: rand(50, 90),
        stamina: rand(60, 95),
      }

      // Boost stats based on position
      if (position === "ATK") {
        stats.shooting = rand(70, 95)
        stats.pace = rand(70, 95)
      } else if (position === "MID") {
        stats.passing = rand(75, 95)
        stats.dribbling = rand(70, 90)
      } else if (position === "DEF") {
        stats.defending = rand(75, 95)
        stats.physical = rand(70, 95)
      } else if (position === "GK") {
        stats.defending = rand(75, 95) // Using defending as GK reflexes/diving proxy for now
        stats.pace = rand(30, 60)
        stats.shooting = rand(10, 40)
      }

      form.setValue("pace", stats.pace)
      form.setValue("shooting", stats.shooting)
      form.setValue("passing", stats.passing)
      form.setValue("dribbling", stats.dribbling)
      form.setValue("defending", stats.defending)
      form.setValue("physical", stats.physical)
      form.setValue("stamina", stats.stamina)
      
      setIsGenerating(false)
      toast.success("Random stats generated!")
    }, 600)
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
      console.error(error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Squad
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Recruit New Player</CardTitle>
                <CardDescription>Manually scout a player or generate random stats.</CardDescription>
              </div>
              <Button variant="outline" onClick={generateRandomStats} disabled={isGenerating}>
                <Dice5 className={`mr-2 h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
                {isGenerating ? "Scouting..." : "Randomize"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Player Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Erling Haaland" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select position" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="GK">Goalkeeper (GK)</SelectItem>
                            <SelectItem value="DEF">Defender (DEF)</SelectItem>
                            <SelectItem value="MID">Midfielder (MID)</SelectItem>
                            <SelectItem value="ATK">Attacker (ATK)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Attributes (1-99)</h3>
                  
                  {/* Grid of Sliders */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {["pace", "shooting", "passing", "dribbling", "defending", "physical"].map((stat) => (
                      <FormField
                        key={stat}
                        control={form.control}
                        name={stat as any}
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex justify-between">
                              <FormLabel className="capitalize">{stat}</FormLabel>
                              <span className="text-xs font-bold">{field.value}</span>
                            </div>
                            <FormControl>
                              <Slider
                                min={1}
                                max={99}
                                step={1}
                                value={[field.value]}
                                onValueChange={(vals) => field.onChange(vals[0])}
                                className={
                                  stat === "pace" ? "text-blue-500" :
                                  stat === "shooting" ? "text-red-500" :
                                  stat === "passing" ? "text-green-500" :
                                  "text-primary"
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>

                  {/* Stamina separate */}
                  <FormField
                    control={form.control}
                    name="stamina"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between">
                          <FormLabel>Stamina</FormLabel>
                          <span className="text-xs font-bold">{field.value}</span>
                        </div>
                        <FormControl>
                          <Slider
                            min={1}
                            max={99}
                            step={1}
                            value={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                          />
                        </FormControl>
                        <CardDescription>Affects player performance over time.</CardDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full" size="lg">
                  <Save className="mr-2 h-4 w-4" /> Save Player
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default CreatePlayer
