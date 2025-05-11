import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import AIInteraction from "./components/AIInteraction";
import NotificationManager from "./components/NotificationManager";

function App() {
  return (
    <Router>
      <NotificationManager />
      <div className="p-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/lola" element={<AIInteraction />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
