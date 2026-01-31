import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, PlusCircle, BarChart3, Zap } from "lucide-react"
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
      <motion.div 
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <Link to="/create-club">
            <Card className="hover:border-primary cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg h-full">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <PlusCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Create Club</CardTitle>
                  <CardDescription>Add a new team</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </motion.div>

        <motion.div variants={item}>
          <Link to="/input-match">
            <Card className="hover:border-primary cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg h-full">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <BarChart3 className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">Input Match</CardTitle>
                  <CardDescription>Record results</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </motion.div>

        <motion.div variants={item}>
          <Link to="/view-klasemen">
            <Card className="hover:border-primary cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg h-full">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-2 rounded-lg bg-yellow-500/10">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">View Klasemen</CardTitle>
                  <CardDescription>Custom league</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </motion.div>

        <motion.div variants={item}>
          <Link to="/real-klasemen">
            <Card className="hover:border-primary cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg h-full">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <Zap className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">Live Standings</CardTitle>
                  <CardDescription>Premier League</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </motion.div>
      </motion.div>

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
