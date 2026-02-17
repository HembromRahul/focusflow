function Topbar({
  setSidebarOpen,
  searchTerm,
  setSearchTerm,
  theme,
  toggleTheme,
}) {
  return (
    <div className="fixed top-0 left-0 w-full bg-zinc-900 border-b border-zinc-800 h-16 flex items-center px-4 z-50">

      {/* Hamburger */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="text-zinc-200 text-2xl md:text-xl mr-4"
      >
        ☰
      </button>

      {/* Search */}
      <div className="flex-1 flex justify-center">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search Flow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-800 text-zinc-200 rounded-xl px-4 py-2 focus:outline-none"
          />
        </div>
      </div>

    </div>
  );
}

export default Topbar;
