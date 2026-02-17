import { useState } from "react";
import Topbar from "./Topbar";

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200">
      <Topbar
        setSidebarOpen={setSidebarOpen}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <main className="px-6">
        {typeof children === "function"
          ? children({ searchTerm })
          : children}
      </main>
    </div>
  );
}

export default Layout;
