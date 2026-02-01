
import React, { createContext, useContext, useState, useEffect } from "react"
import { api, API } from "../api"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

interface User {
  id: number
  email: string
  name: string
  role: "ADMIN" | "USER"
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (token: string, user: User) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"))
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token")
      if (storedToken) {
        try {
          // Verify token with backend
          const res = await api.getAuthMe(storedToken)
          setUser(res)
          setToken(storedToken)
          API.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
        } catch (err) {
          console.error("Auth check failed", err)
          logout() // Invalid token
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem("token", newToken)
    setToken(newToken)
    setUser(newUser)
    // Set global header
    API.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
    delete API.defaults.headers.common['Authorization']
    toast.info("Logged out successfully")
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        isLoading, 
        login, 
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
