import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateMatch from "./pages/CreateMatch";

import Dashboard1 from "./pages/Dashboard1"; // DESPUES ELIMINAR ESTO

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/matches/create" element={<CreateMatch />} />
        
        <Route path="/dashboard1" element={<Dashboard1 />} /> {/*DESPUES ELIMINAR ESTO */}
              </Routes>
    </BrowserRouter>
  );
}

export default App;
