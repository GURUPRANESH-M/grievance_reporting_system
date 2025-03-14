import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SubmitGrievance from "./pages/SubmitGrievance";
import ViewGrievances from "./pages/ViewGrievances";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protect these routes */}
        <Route
          path="/submit"
          element={
            <ProtectedRoute>
              <SubmitGrievance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view"
          element={
            <ProtectedRoute>
              <ViewGrievances />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
