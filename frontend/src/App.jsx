import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Profile from "./pages/Profile";  
import Settings from "./pages/Settings";
import PersonalDetailes from "./pages/PersonaDetailes";
import UserFileUploader from "./pages/UserFileUploader";
import Preview from './pages/Preview';


const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/profile" element={<Dashboard><Profile /></Dashboard>} />
        <Route path="/preview/:id" element={<Dashboard><Preview /></Dashboard>} />
        <Route path="/settings" element={<Dashboard><Settings /></Dashboard>} />
        <Route path="/personal-details" element={<Dashboard><PersonalDetailes /></Dashboard>} />
         <Route path="user-file" element={<Dashboard><UserFileUploader /></Dashboard>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
