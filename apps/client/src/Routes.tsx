
import { Route, Routes, Navigate } from "react-router-dom"

// import CreateClub from "./pages/CreateClub"
// import InputScoreForm from "./components/InputScore2"
import StandingsView from "./components/StandingsView"
import LiveStandings from "./components/LiveStandings"
import Homepage from "./pages/Homepage"
import LandingPage from "./pages/LandingPage"
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"
import NotFound from "./pages/NotFound"
import SquadView from "./pages/SquadView"
import CreatePlayer from "./pages/CreatePlayer"
import ProtectedRoute from "./components/ProtectedRoute"
import ClubDashboardLayout from "./layouts/ClubDashboardLayout"
import ClubOverview from "./pages/ClubOverview"
import NewGame from "./pages/NewGame"
import TacticsView from "./components/TacticsView"

const RoutePath = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/new-game" element={<NewGame />} />
          <Route path="/dashboard" element={<Homepage />} />
          <Route path="/view-klasemen" element={<StandingsView />} />
          <Route path="/real-klasemen" element={<LiveStandings />} />
          
          {/* Club Management Dashboard */}
          <Route element={<ClubDashboardLayout />}>
             <Route path="/dashboard/:clubId" element={<Navigate to="overview" replace />} />
             <Route path="/dashboard/:clubId/overview" element={<ClubOverview />} />
             <Route path="/dashboard/:clubId/squad" element={<SquadView />} />
             <Route path="/dashboard/:clubId/create-player" element={<CreatePlayer />} />
             <Route path="/dashboard/:clubId/tactics" element={<TacticsView />} />
             <Route path="/dashboard/:clubId/fixtures" element={<div className="p-4">Fixtures Module Coming Soon</div>} />
             <Route path="/dashboard/:clubId/standings" element={<StandingsView />} />
          </Route>
        </Route>

        {/* Feature Routes (Accessible to all Managers) */}
        {/* <Route element={<ProtectedRoute />}>
          // Legacy Admin Routes Removed
        </Route> */}
        
        {/* 404 Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default RoutePath
