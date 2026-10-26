import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateMatch from "./pages/CreateMatch";
import AvailableMatches from "./pages/AvailableMatches";
import Profile from "./pages/Profile";

import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./router/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/matches" element={<AvailableMatches />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/matches/create" element={<CreateMatch />} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/dashboard1" element={<Navigate to="/admin" replace />} />
              </Routes>
    </BrowserRouter>
  );
}

export default App;
