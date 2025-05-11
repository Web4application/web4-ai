import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import AIInteraction from "./components/AIInteraction";

function App() {
  return (
    <Router>
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
