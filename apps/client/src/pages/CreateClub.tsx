
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { api } from "../api"
import { toast } from "sonner"
import { ArrowLeft, ArrowRight, Building2, Flag, Shield, Trophy } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Schema
const formSchema = z.object({
  team: z.string().min(3, "Min 3 characters"),
  nickname: z.string().optional(),
  city: z.string().min(2, "City name required"),
  yearFounded: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 1800, "Invalid year"),
  primaryColor: z.string().startsWith("#"),
  secondaryColor: z.string().startsWith("#"),
  formation: z.string(),
  stadiumName: z.string().min(3),
  stadiumCap: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Invalid capacity"),
})

export default function CreateClub() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [createdClubId, setCreatedClubId] = useState<number | null>(null)
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      team: "",
      nickname: "",
      city: "",
      yearFounded: "2024",
      primaryColor: "#000000",
      secondaryColor: "#ffffff",
      formation: "4-3-3",
      stadiumName: "",
      stadiumCap: "5000",
    },
  })

  // Watch values for live preview
  const primaryColor = form.watch("primaryColor")
  const secondaryColor = form.watch("secondaryColor")
  const teamName = form.watch("team")

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const payload = {
        ...values,
        yearFounded: Number(values.yearFounded),
        stadiumCap: Number(values.stadiumCap),
      }
      
      const res = await api.createClub(payload) // Uses helper
      setCreatedClubId(res.data.id)
      toast.success("Club founded successfully! 🎉")
    } catch (error) {
      console.error(error)
      toast.error("Failed to create club")
    }
  }

  const handleGenerateSquad = async () => {
    if (!createdClubId) return
    try {
      await api.generateSquad({ clubId: createdClubId, country: "EN" }) // Uses helper
      toast.success("Squad recruited successfully! ⚽")
      navigate(`/squad/${createdClubId}`)
    } catch (error) {
      toast.error("Failed to recruit squad")
    }
  }

  if (createdClubId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
              <Trophy className="w-12 h-12 text-primary" />
            </div>
            <CardTitle>Welcome, Chairman!</CardTitle>
            <CardDescription>{teamName} has been officially registered.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Your stadium is ready, but the dressing room is empty. What would you like to do?
            </p>
            <Button onClick={handleGenerateSquad} className="w-full h-12 text-lg animate-pulse" variant="default">
              🚀 Auto-Recruit Full Squad (25 Players)
            </Button>
            <Button onClick={() => navigate(`/squad/${createdClubId}`)} variant="outline" className="w-full">
              Manually Scout Players
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8 flex items-center justify-center">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="space-y-1">
              <CardTitle>Create New Club</CardTitle>
              <CardDescription>Step {step} of 3: {step === 1 ? "Identity" : step === 2 ? "Branding" : "Infrastructure"}</CardDescription>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-in-out" 
              style={{ width: `${(step / 3) * 100}%` }} 
            />
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* STEP 1: IDENTITY */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-8">
                  <FormField
                    control={form.control}
                    name="team"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Club Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Manchester United" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="nickname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nickname (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="The Red Devils" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="yearFounded"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year Founded</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City / Base</FormLabel>
                        <FormControl>
                          <Input placeholder="Manchester" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* STEP 2: BRANDING */}
              {step === 2 && (
                <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-8">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="primaryColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Color</FormLabel>
                          <div className="flex gap-2">
                             <Input type="color" className="w-12 h-10 p-1" {...field} />
                             <Input {...field} />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="secondaryColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Secondary Color</FormLabel>
                          <div className="flex gap-2">
                             <Input type="color" className="w-12 h-10 p-1" {...field} />
                             <Input {...field} />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="formation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Tactics</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select formation" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="4-4-2">4-4-2 Classic</SelectItem>
                              <SelectItem value="4-3-3">4-3-3 Attack</SelectItem>
                              <SelectItem value="4-2-3-1">4-2-3-1 Gen Z</SelectItem>
                              <SelectItem value="3-5-2">3-5-2 Conte Mode</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Live Preview */}
                  <div className="flex flex-col items-center justify-center p-6 border rounded-xl bg-muted">
                     <p className="mb-4 text-sm font-medium text-muted-foreground">Kit Preview</p>
                     <div className="relative w-32 h-40 rounded-lg shadow-xl flex items-center justify-center overflow-hidden" 
                          style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor} 50%, ${secondaryColor} 50%, ${secondaryColor} 100%)` }}>
                        <Shield className="w-12 h-12 text-white drop-shadow-md" />
                     </div>
                     <p className="mt-4 font-bold text-lg">{teamName || "Club Name"}</p>
                  </div>
                </div>
              )}

              {/* STEP 3: INFRASTRUCTURE */}
              {step === 3 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-8">
                  <FormField
                    control={form.control}
                    name="stadiumName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stadium Name</FormLabel>
                        <FormControl>
                           <div className="relative">
                              <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-9" placeholder={`${teamName || "Club"} Stadium`} {...field} />
                           </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="stadiumCap"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacity</FormLabel>
                        <div className="flex gap-4 items-center">
                          <FormControl>
                             <Input type="number" {...field} />
                          </FormControl>
                          <span className="text-sm text-muted-foreground">Seats</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Starting budget allows for max 20,000 seats.</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className="flex justify-between pt-6 border-t mt-8">
                {step > 1 ? (
                  <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                    Back
                  </Button>
                ) : (
                  <div /> // Spacer
                )}

                {step < 3 ? (
                  <Button type="button" onClick={() => setStep(step + 1)}>
                    Next Step <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                ) : (
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    Officially Found Club 🏛️
                  </Button>
                )}
              </div>

            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
