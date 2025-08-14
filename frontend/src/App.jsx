import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Profile from "./pages/Profile";  
import  Cards from "./pages/Cards";
import PersonalDetailes from "./pages/PersonaDetailes";
import UserFileUploader from "./pages/UserFileUploader";
import About from "./pages/About";
import Preview from './pages/Preview';
import ForgotPassword from './pages/ForgotPassword';
import Settings from "./pages/Settings";

import AdminRoute from "./components/AdminRoute";
import AdminPage from "./pages/AdminPage";
import AdminDashboard from "./pages/AdminDashboard";

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/profile" element={<Dashboard><Profile /></Dashboard>} />
        <Route path="/preview/:id" element={<Dashboard><Preview /></Dashboard>} />
        <Route path="/cards" element={<Dashboard><Cards /></Dashboard>} />
        <Route path="/personal-details" element={<Dashboard><PersonalDetailes /></Dashboard>} />
         <Route path="user-file" element={<Dashboard><UserFileUploader /></Dashboard>} />
         <Route path="/about" element={<Dashboard><About /></Dashboard>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/settings" element={<Dashboard><Settings /></Dashboard>} />

        <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
        <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />


      </Routes>
    </BrowserRouter>
  );
};

export default App;
