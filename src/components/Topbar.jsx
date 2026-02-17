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
      <button
        onClick={() => setSidebarOpen(true)}
        className="absolute left-4 text-zinc-200 text-2xl md:text-xl z-50"
      >
        ☰
      </button>

      {/* Search */}
      <div className="relative w-full max-w-md">

        <input
          type="text"
          placeholder="Search Flow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-zinc-800 text-zinc-200 rounded-xl px-4 pr-14 py-2 focus:outline-none"
        />

      </div>
    </div>
  );
}

export default Topbar;
