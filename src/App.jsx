import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import TasksPage from "./pages/TasksPage";
import HistoryPage from "./pages/HistoryPage";
import Layout from "./components/Layout";

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <BrowserRouter>
      <Layout
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      >
        <Routes>
          <Route
            path="/"
            element={<TasksPage searchTerm={searchTerm} />}
          />
          <Route path="/history" element={<HistoryPage />} />
          <Route
            path="/settings"
            element={
              <div className="p-6 text-zinc-300">
                Settings coming soon.
              </div>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
