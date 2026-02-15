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
  position: string // Updated to support FM roles (GK, CB, ST, etc)
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
  getKlasemen: async (clubId?: number) => {
    const res = await API.get("/klub/klasemen", { params: { clubId } })
    return res.data
  },
  getAllClubs: async () => {
    const res = await API.get("/club?_t=" + Date.now())
    return res.data
  },
  getLeagues: async () => {
    const res = await API.get("/club/leagues")
    return res.data
  },
  createClub: async (data: any) => {
    const res = await API.post("/club", data)
    return res
  },
  getClubById: async (id: number) => {
    const res = await API.get(`/club/${id}`)
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
  getClubPlayers: async (clubId: number | string) => {
    return api.getPlayersByClub(clubId)
  },
  updateTactics: async (clubId: number | string, data: { formation: string, lineup: { playerId: number, lineupPos: string | null }[] }) => {
    const res = await API.put(`/club/${clubId}/tactics`, data)
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
  generateSquad: async (data: { clubId: number, country?: string }) => {
    const res = await API.post("/player/batch-generate", data)
    return res.data
  },
  // Game
  getMyGames: async () => {
    const res = await API.get("/game")
    return res.data
  },
  saveGame: async (gameId: string) => {
    const res = await API.put(`/game/${gameId}/save`, {})
    return res.data
  },
  // Generic
  get: (url: string) => API.get(url),
  post: (url: string, data: any) => API.post(url, data),
  put: (url: string, data: any) => API.put(url, data),
  delete: (url: string) => API.delete(url)
}

export { API }
