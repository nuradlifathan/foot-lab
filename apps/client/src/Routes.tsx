
import { Route, Routes } from "react-router-dom"

import CreateClub from "./pages/CreateClub"
import InputScoreForm from "./components/InputScore2"
import ViewKlasemen from "./components/ViewKlasemen"
import RealKlasemen from "./components/RealKlasemen"
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

const RoutePath = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Homepage />} />
          <Route path="/view-klasemen" element={<ViewKlasemen />} />
          <Route path="/real-klasemen" element={<RealKlasemen />} />
          
          {/* Club Management Dashboard */}
          <Route element={<ClubDashboardLayout />}>
             <Route path="/dashboard/:clubId" element={<ClubOverview />} />
             <Route path="/squad/:clubId" element={<SquadView />} />
             <Route path="/create-player/:clubId" element={<CreatePlayer />} />
             {/* Add placeholders for future routes */}
             <Route path="/tactics/:clubId" element={<div className="p-4">Tactics Module Coming Soon</div>} />
             <Route path="/fixtures/:clubId" element={<div className="p-4">Fixtures Module Coming Soon</div>} />
          </Route>
        </Route>

        {/* Admin Only Routes */}
        <Route element={<ProtectedRoute requireAdmin={true} />}>
          <Route path="/create-club" element={<CreateClub />} />
          <Route path="/input-match" element={<InputScoreForm />} />
        </Route>
        
        {/* 404 Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default RoutePath
