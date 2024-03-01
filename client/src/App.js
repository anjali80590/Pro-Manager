import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthForm from "./Components/AuthForm/AuthForm";
import Dashboard from "./Components/Dashboard/Dashboard";
import Board from "./Components/Board/Board";
import Analytics from "./Components/Analytics/Analytics";
import Settings from "./Components/setings/Settings";
import ShareTasks from "./Components/ShareTasks/ShareTasks";

const isAuthenticated = () => !!localStorage.getItem("token");

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/tasks/:taskId" element={<ShareTasks />} />
        <Route path="/" element={<AuthForm />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Board />} />
          <Route path="board" element={<Board />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
