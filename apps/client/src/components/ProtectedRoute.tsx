
import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  requireAdmin?: boolean
}

const ProtectedRoute = ({ requireAdmin }: ProtectedRouteProps = {}) => {
  const { user, isLoading, token } = useAuth()

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && user.role !== "ADMIN") {
    // If user tries to access admin route, redirect to dashboard
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
