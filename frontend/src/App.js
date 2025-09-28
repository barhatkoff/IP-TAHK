import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import Navigation from "./components/Navigation";
import Homepage from "./pages/Homepage";
import ServerRules from "./pages/ServerRules";
import Events from "./pages/Events";
import PlayerGuides from "./pages/PlayerGuides";
import Community from "./pages/Community";
import Downloads from "./pages/Downloads";
import Leaderboards from "./pages/Leaderboards";
import Support from "./pages/Support";
import AdminPanel from "./pages/AdminPanel";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="min-h-screen bg-primary text-primary">
          <Navigation />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/rules" element={<ServerRules />} />
            <Route path="/events" element={<Events />} />
            <Route path="/guides" element={<PlayerGuides />} />
            <Route path="/community" element={<Community />} />
            <Route path="/downloads" element={<Downloads />} />
            <Route path="/leaderboards" element={<Leaderboards />} />
            <Route path="/support" element={<Support />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
          <Footer />
          <Toaster />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;