import { useState } from "react";
import Topbar from "./Topbar";
import { Link } from "react-router-dom";

function Layout({
  children,
  searchTerm,
  setSearchTerm,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200">

      {/* Topbar */}
      <Topbar
        setSidebarOpen={setSidebarOpen}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-zinc-900 border-r border-zinc-800 z-50 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 space-y-6">

          <h2 className="text-lg font-semibold text-zinc-300">
            Flow
          </h2>

          <nav className="space-y-4">
            <Link
              to="/"
              onClick={() => setSidebarOpen(false)}
              className="block text-zinc-400 hover:text-white transition"
            >
              Tasks
            </Link>

            <Link
              to="/history"
              onClick={() => setSidebarOpen(false)}
              className="block text-zinc-400 hover:text-white transition"
            >
              History
            </Link>

            <Link
              to="/settings"
              onClick={() => setSidebarOpen(false)}
              className="block text-zinc-400 hover:text-white transition"
            >
              Settings
            </Link>
          </nav>

        </div>
      </div>

      {/* Page Content */}
      <main className="px-6 pt-6">
        {children}
      </main>

    </div>
  );
}

export default Layout;
