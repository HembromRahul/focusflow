import { BrowserRouter, Routes, Route } from "react-router-dom";
import TasksPage from "./pages/TasksPage";
import HistoryPage from "./pages/HistoryPage";
import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        {({ searchTerm }) => (
          <Routes>
            <Route path="/" element={<TasksPage searchTerm={searchTerm} />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        )}
      </Layout>
    </BrowserRouter>
  );
}

export default App;
