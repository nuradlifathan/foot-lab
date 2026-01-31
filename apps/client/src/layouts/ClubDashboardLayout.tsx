
import { useEffect, useState } from "react"
import { Outlet, NavLink, useParams, useNavigate } from "react-router-dom"
import { api } from "@/api"
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  Trophy, 
  CalendarDays, 
  Settings, 
  LogOut,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useQuery } from "@tanstack/react-query"

export default function ClubDashboardLayout() {
  const { clubId } = useParams()
  const navigate = useNavigate()
  
  // Use TanStack Query for caching and better state management
  const { data: club, isLoading } = useQuery({
    queryKey: ['club', clubId],
    queryFn: async () => {
      if (!clubId) throw new Error("No club ID")
      const res = await api.getClubById(Number(clubId))
      return res
    },
    enabled: !!clubId
  })

  const sidebarLinks = [
    { name: "Overview", icon: LayoutDashboard, path: `/dashboard/${clubId}` },
    { name: "Squad", icon: Users, path: `/squad/${clubId}` },
    { name: "Tactics", icon: Shield, path: `/tactics/${clubId}` },
    { name: "Fixtures", icon: CalendarDays, path: `/fixtures/${clubId}` },
    { name: "Standings", icon: Trophy, path: "/view-klasemen" },
  ]

  if (isLoading) {
    return (
      <div className="flex h-screen w-full bg-background">
        <div className="w-64 border-r p-4 space-y-4">
          <Skeleton className="h-12 w-full" />
          <div className="space-y-2">
             <Skeleton className="h-10 w-full" />
             <Skeleton className="h-10 w-full" />
             <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="flex-1 p-8">
          <Skeleton className="h-32 w-full mb-8" />
          <div className="grid grid-cols-3 gap-4">
             <Skeleton className="h-40 w-full" />
             <Skeleton className="h-40 w-full" />
             <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    )
  }

  // Fallback club theme colors
  const primaryColor = club?.primaryColor || "#000000"
  const secondaryColor = club?.secondaryColor || "#ffffff"

  return (
    <div className="flex h-screen bg-muted/10 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r flex flex-col shadow-sm z-10">
        <div 
          className="h-16 flex items-center px-6 border-b"
          style={{ 
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor} 90%, ${secondaryColor} 100%)`,
            color: '#fff'
          }}
        >
          <div className="font-black text-lg truncate flex items-center gap-2">
            <Shield className="w-5 h-5" fill="currentColor" />
            <span className="truncate">{club?.team || "My Club"}</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm font-medium
                ${isActive 
                  ? "bg-primary text-primary-foreground shadow-md translate-x-1" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }
              `}
            >
              <link.icon className="w-4 h-4" />
              {link.name}
              {/* Active Indicator */}
              {/* {isActive && <ChevronRight className="w-3 h-3 ml-auto opacity-50" />} */}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => navigate('/dashboard')}>
             <LogOut className="w-4 h-4 mr-2" />
             Exit Game
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative scroll-smooth focus:scroll-auto">
        {/* Top Header (Optional) */}
        
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
           {/* We render the child route here */}
           <Outlet context={{ club }} />
        </div>
      </main>
    </div>
  )
}
