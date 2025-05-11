import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AIInteraction from "./components/AIInteraction";
import TaskAnalysis from "./components/TaskAnalysis";
import CodeReview from "./components/CodeReview";
import Journaling from "./components/Journaling";

function App() {
  return (
    <Router>
      <div className="p-8">
        <Routes>
          <Route path="/" element={<TaskAnalysis />} />
          <Route path="/code-review" element={<CodeReview />} />
          <Route path="/journal" element={<Journaling />} />
          <Route path="/lola" element={<AIInteraction />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
