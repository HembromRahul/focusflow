import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import TasksPage from "./pages/TasksPage";
import HistoryPage from "./pages/HistoryPage";

function App() {
  return (
    <BrowserRouter>
      <div>
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/" style={{ marginRight: "10px" }}>
            Tasks
          </Link>
          <Link to="/history">History</Link>
        </nav>

        <Routes>
          <Route path="/" element={<TasksPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
