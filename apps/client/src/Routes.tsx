import { Route, Routes } from "react-router-dom"

import CreateClub from "./components/CreateClub"
import InputScoreForm from "./components/InputScore2"
import ViewKlasemen from "./components/ViewKlasemen"
import RealKlasemen from "./components/RealKlasemen"
import Homepage from "./pages/Homepage"
import LandingPage from "./pages/LandingPage"
import NotFound from "./pages/NotFound"
import SquadView from "./pages/SquadView"
import CreatePlayer from "./pages/CreatePlayer"

const RoutePath = () => {
  return (
    <>
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* Dashboard Layout - Layout wrapper will be added in App or here? 
            For now, let's keep it simple. Sidebar visibility logic will be in Sidebar or a Wrapper.
        */}
        <Route path="/dashboard" element={<Homepage />} />
        <Route path="/create-club" element={<CreateClub />} />
        <Route path="/input-match" element={<InputScoreForm />} />
        <Route path="/view-klasemen" element={<ViewKlasemen />} />
        <Route path="/real-klasemen" element={<RealKlasemen />} />
        <Route path="/squad/:clubId" element={<SquadView />} />
        <Route path="/create-player/:clubId" element={<CreatePlayer />} />
        
        {/* 404 Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
    </>
  )
}

export default RoutePath
