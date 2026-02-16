import { Moon, Sun, Square } from "lucide-react";

function Topbar({
  setSidebarOpen,
  searchTerm,
  setSearchTerm,
  theme,
  toggleTheme,
}) {
  return (
    <div className="fixed top-0 left-0 w-full bg-zinc-900 border-b border-zinc-800 h-16 flex items-center justify-center px-4 z-50">

      {/* Hamburger */}
      <div className="absolute left-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-zinc-400 hover:text-white transition"
        >
          ☰
        </button>
      </div>

      {/* Search Container */}
      <div className="relative w-full max-w-md">

        <input
          type="text"
          placeholder="Search Flow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-zinc-800 text-white rounded-xl px-4 pr-12 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-600"
        />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 text-zinc-400 hover:text-white transition-transform duration-200 hover:rotate-12"
        >
          {theme === "dark" && <Moon size={20} />}
          {theme === "light" && <Sun size={20} />}
          {theme === "amoled" && <Square size={20} />}
        </button>

      </div>

    </div>
  );
}

export default Topbar;
