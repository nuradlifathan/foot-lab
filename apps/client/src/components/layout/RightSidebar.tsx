
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronLeft, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import LiveStandings from "@/components/LiveStandings"

export default function RightSidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="relative h-screen hidden xl:flex">
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 350, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-full border-l bg-card overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b flex items-center justify-between shrink-0 h-16">
              <div className="flex items-center gap-2 font-semibold">
                <Trophy className="h-4 w-4 text-primary" />
                <span>Live Scores</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
               {/* We use sidebarMode for compact dropdown but full list */}
               <LiveStandings sidebarMode />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <div className="absolute top-4 left-[-12px] z-50">
        <Button
          variant="outline"
          size="icon"
          className="h-6 w-6 rounded-full shadow-md bg-background"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </Button>
      </div>
    </div>
  )
}
