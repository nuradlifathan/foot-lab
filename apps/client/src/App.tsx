
import Sidebar from "./components/layout/Sidebar"
import RoutePath from "./Routes"

import { Analytics } from "@vercel/analytics/react"

function App() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <RoutePath />
        <Analytics />
      </main>
    </div>
  )
}

export default App
