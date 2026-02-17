function Topbar({
  setSidebarOpen,
  searchTerm,
  setSearchTerm,
}) {
  return (
    <div className="w-full bg-zinc-950 h-16 flex items-center px-4">

      {/* Hamburger */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="text-zinc-200 text-2xl mr-4 flex-shrink-0"
      >
        ☰
      </button>

      {/* Search */}
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search Flow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-zinc-950 text-zinc-200 rounded-xl px-4 py-2 focus:outline-none border border-zinc-800"
        />
      </div>

    </div>
  );
}

export default Topbar;
