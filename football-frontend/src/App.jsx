import { useEffect, useState } from "react";
import { getTeams } from "./api";
import "./index.css";
import "./App.css";
import NavBar from "./Components/NavBar/NavBar";
import Hero from "./Components/Hero/Hero";
import About from "./Components/About-us/About";
import Teams from "./Pages/Teams/teams";
import TeamDetails from "./Pages/Teams/TeamDetails";
import EditTeam from "./Pages/Teams/EditTeam";
import Players from "./Pages/Players/players";
import PlayerDetails from "./Pages/Players/PlayerDetails";
import EditPlayer from "./Pages/Players/EditPlayer";
import Coaches from "./Pages/Coaches/Coaches";
import CoachDetails from "./Pages/Coaches/CoachDetails";
import EditCoach from "./Pages/Coaches/EditCoach";
import Matches from "./Pages/Matches/Matches";
import AddPlayer from "./Pages/Players/AddPlayer";
import AddTeam from "./Pages/Teams/AddTeam";
import AddCoach from "./Pages/Coaches/AddCoach";
import AddMatch from "./Pages/Matches/AddMatch";
import ReserveTicket from "./Pages/Matches/ReserveTicket";
import Tickets from "./Pages/Tickets/Tickets";
import ReserveTickets from "./Pages/Tickets/ReserveTicket";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <NavBar />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <About />
              </>
            }
          />
          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/:id" element={<TeamDetails />} />
          <Route path="/teams/:id/edit" element={<EditTeam />} />
          <Route path="/players" element={<Players />} />
          <Route path="/players/:id" element={<PlayerDetails />} />
          <Route path="/players/edit/:id" element={<EditPlayer />} />
          <Route path="/coaches" element={<Coaches />} />
          <Route path="/coaches/add" element={<AddCoach />} />
          <Route path="/coaches/:id" element={<CoachDetails />} />
          <Route path="/coaches/edit/:id" element={<EditCoach />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/players/add" element={<AddPlayer />} />
          <Route path="/teams/add" element={<AddTeam />} />
          <Route path="/matches/add" element={<AddMatch />} />
          <Route path="/matches/:matchId/reserve" element={<ReserveTicket />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/tickets/reserve" element={<ReserveTickets />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
