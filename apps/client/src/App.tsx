
import Sidebar from "./components/layout/Sidebar"
import RoutePath from "./Routes"

function App() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <RoutePath />
      </main>
    </div>
  )
}

export default App
