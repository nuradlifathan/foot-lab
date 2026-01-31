import { useState } from "react"
import { motion } from "framer-motion"
import { Link, useLocation } from "react-router-dom"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  Home,
  PlusCircle,
  Trophy,
  BarChart3,
  Menu,
  Moon,
  Sun,
  ChevronLeft,
  Users
} from "lucide-react"

const navItems = [
  { path: "/", icon: Home, label: "Dashboard" },
  { path: "/create-club", icon: PlusCircle, label: "Create Club" },
  { path: "/input-match", icon: BarChart3, label: "Input Match" },
  { path: "/view-klasemen", icon: Trophy, label: "View Klasemen" },
  { path: "/real-klasemen", icon: Trophy, label: "Live Standings" },
]

interface SidebarContentProps {
  collapsed?: boolean
  mobile?: boolean
  onItemClick?: () => void
}

import { useAuth } from "@/context/AuthContext"

// ... imports

const SidebarContent = ({ collapsed, mobile, onItemClick }: SidebarContentProps) => {
  const { theme, setTheme } = useTheme()
  const location = useLocation()
  const { user, logout, isAdmin } = useAuth()

  // Filter nav items based on role
  const filteredNavItems = navItems.filter(item => {
    if (item.path === "/create-club" || item.path === "/input-match") {
      return isAdmin
    }
    return true
  })

  return (
    <div className="flex h-full flex-col">
      {/* ... Header (unchanged) ... */}
      {!mobile && (
        <div className="flex items-center justify-between p-4 border-b h-16">
          {!collapsed && (
            <motion.div 
              className="flex items-center gap-2 overflow-hidden whitespace-nowrap"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <motion.span
                className="text-2xl"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                ⚽
              </motion.span>
              <span className="text-xl font-bold text-primary">
                Foot Lab
              </span>
            </motion.div>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 mt-2">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link key={item.path} to={item.path} onClick={onItemClick}>
              <div
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent",
                  isActive && "bg-primary text-primary-foreground hover:bg-primary/90",
                  collapsed && !mobile && "justify-center"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {(!collapsed || mobile) && (
                  <span className="animate-fade-in">{item.label}</span>
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t space-y-2">
        <Button
          variant="ghost"
          size={collapsed && !mobile ? "icon" : "default"}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-full justify-start"
        >
          {theme === "dark" ? <Sun className="h-5 w-5 mr-2" /> : <Moon className="h-5 w-5 mr-2" />}
          {(!collapsed || mobile) && <span>Toggle Theme</span>}
        </Button>
        
        {(!collapsed || mobile) && user && (
          <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50 animate-fade-in group relative">
             {/* Logout Button Overlay */}
             <div className="absolute inset-0 bg-background/80 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button variant="destructive" size="sm" onClick={logout} className="w-full h-full">Logout</Button>
             </div>

            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shrink-0">
              {user.name?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.role}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  // Only show sidebar on these paths (and child paths)
  // Only show GLOBAL sidebar on these paths
  // We want to HIDE this sidebar when inside the Club Dashboard (which has its own sidebar)
  const shouldShowSidebar = (() => {
    const p = location.pathname
    
    // Explicitly hide for Game Mode routes
    // Note: /dashboard/:id is Game Mode, but /dashboard is Landing
    // The previous logic startswith was too broad
    if (p.includes("/squad/") || p.includes("/tactics/") || p.includes("/fixtures/") || p.includes("/create-player/")) return false
    
    // Special case for /dashboard: Show only if it's EXACTLY /dashboard (the hub)
    // If it's /dashboard/123, hide it (Game Mode)
    if (p.startsWith("/dashboard/")) return false

    // Otherwise show for specific prefixes
    const showPrefixes = [
      "/dashboard", // Will match /dashboard but we filtered /dashboard/ above
      "/create-club", 
      "/input-match", 
      "/view-klasemen", 
      "/real-klasemen"
    ]
    
    return showPrefixes.some(prefix => p.startsWith(prefix))
  })()

  if (!shouldShowSidebar) return null

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
           <motion.span
              className="text-2xl"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              ⚽
            </motion.span>
            <span className="text-xl font-bold">Foot Lab</span>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
             <SheetHeader className="p-4 border-b text-left">
              <SheetTitle className="flex items-center gap-2">
                 <span className="text-2xl">⚽</span> Foot Lab
              </SheetTitle>
            </SheetHeader>
            <SidebarContent mobile onItemClick={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* spacer for mobile header */}
      <div className="lg:hidden h-16" />

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:block sticky top-0 h-screen border-r bg-card transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="relative h-full">
           <SidebarContent collapsed={collapsed} />
           {/* Desktop Collapse Button */}
           <div className="absolute top-4 right-[-12px] z-20"> {/* Floating button style */}
              <Button
                variant="outline"
                size="icon"
                className="h-6 w-6 rounded-full shadow-md"
                onClick={() => setCollapsed(!collapsed)}
              >
                <ChevronLeft className={cn("h-3 w-3 transition-transform", collapsed && "rotate-180")} />
              </Button>
           </div>
        </div>
      </aside>
    </>
  )
}
