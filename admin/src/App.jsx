import { BrowserRouter, Routes, Route } from "react-router-dom"

import Sidebar from "./components/Sidebar"

import Dashboard from "./pages/Dashboard"
import Projects from "./pages/Projects"
import Tasks from "./pages/Tasks"
import Login from "./pages/Login"

import ProtectedRoute from "./components/ProtectedRoute"

import "./App.css"


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Login page without Sidebar */}
        <Route path="/" element={<Login />} />


        {/* Admin pages with Sidebar */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div style={{ display: "flex" }}>
                <Sidebar />

                <main style={{ padding: "20px", flex: 1 }}>
                  <Dashboard />
                </main>
              </div>
            </ProtectedRoute>
          }
        />


        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <div style={{ display: "flex" }}>
                <Sidebar />

                <main style={{ padding: "20px", flex: 1 }}>
                  <Projects />
                </main>
              </div>
            </ProtectedRoute>
          }
        />


        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <div style={{ display: "flex" }}>
                <Sidebar />

                <main style={{ padding: "20px", flex: 1 }}>
                  <Tasks />
                </main>
              </div>
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  )
}

export default App