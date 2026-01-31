import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, PlusCircle, BarChart3, Zap, Shield } from "lucide-react"
import { motion } from "framer-motion"

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
              <Link to="/create-club">
                <Card className="h-full border-primary/50 bg-gradient-to-br from-card to-primary/5 hover:shadow-primary/20 hover:shadow-lg transition-all cursor-pointer group">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <PlusCircle className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                      Create New Club
                    </CardTitle>
                    <CardDescription>Start your journey as a manager. Build your squad, tactic, and stadium.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">Start Career</Button>
                  </CardContent>
                </Card>
              </Link>

              {/* Placeholder for Load Game or Recent Club could go here */}
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
