import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Frown } from "lucide-react"

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-9xl mb-4 select-none">🥅</div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <h1 className="text-4xl font-bold tracking-tight">404 - Offside!</h1>
        <p className="text-xl text-muted-foreground max-w-md mx-auto">
          Oops! Looks like you've wandered out of bounds. This page doesn't exist on our pitch.
        </p>
        
        <div className="pt-4">
          <Link to="/">
            <Button size="lg" className="gap-2">
              <Frown className="h-4 w-4" />
              Return to Safety
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default NotFound
