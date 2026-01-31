import axios from "axios"

// In production, use relative path (same domain)
// In development, use localhost
const baseURL = import.meta.env.PROD ? "/api" : "http://localhost:8000/api"

const API = axios.create({ baseURL })

// Player Types
export interface Player {
  id: number
  clubId: number
  name: string
  position: "GK" | "DEF" | "MID" | "ATK"
  pace: number
  shooting: number
  passing: number
  dribbling: number
  defending: number
  physical: number
  stamina: number
  overall: number
}

// Typed API functions for TanStack Query
export const api = {
  // Auth
  register: (data: any) => API.post("/auth/register", data).then(res => res.data),
  login: (data: any) => API.post("/auth/login", data).then(res => res.data),
  getAuthMe: (token: string) => API.get("/auth/me", {
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => res.data),
  getKlasemen: async () => {
    const res = await API.get("/klub/klasemen")
    return res.data
  },
  getAllClubs: async () => {
    const res = await API.get("/klub")
    return res.data
  },
  createClub: async (data: { team: string }) => {
    const res = await API.post("/klub/create", data)
    return res.data
  },
  inputScore: async (data: { ClubId: number; opponent_name: string; score: string }) => {
    const res = await API.post("/klub/input-score", data)
    return res.data
  },
  // Player API
  getPlayersByClub: async (clubId: number | string) => {
    const res = await API.get<Player[]>(`/player/club/${clubId}`)
    return res.data
  },
  createPlayer: async (data: Omit<Player, "id">) => {
    const res = await API.post<Player>("/player/create", data)
    return res.data
  },
  generatePlayer: async (data: { clubId: number, position: string, country?: string }) => {
    const res = await API.post<Player & { country: string }>("/player/generate", data)
    return res.data
  },
}

export { API }
