import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateMatch from "./pages/CreateMatch";
import AvailableMatches from "./pages/AvailableMatches";
import MatchDetails from "./pages/MatchDetails";
import Profile from "./pages/Profile";
import PrivateRoute from './router/PrivateRoute';
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./router/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/matches"
          element={
            <PrivateRoute>
              <AvailableMatches />
            </PrivateRoute>
          }
        />
        <Route
          path="/matches/:id"
          element={
            <PrivateRoute>
              <MatchDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/matches/create"
          element={
            <PrivateRoute>
              <CreateMatch />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route path="/dashboard1" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
