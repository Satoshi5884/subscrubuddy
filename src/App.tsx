import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import Subscriptions from "./pages/Subscriptions";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
      </Routes>
    </Router>
  );
}

export default App;