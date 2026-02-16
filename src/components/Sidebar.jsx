import { Link } from "react-router-dom";

function Sidebar({ open, setOpen }) {
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* Sidebar panel */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-zinc-900 border-r border-zinc-800 z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 text-xl font-semibold border-b border-zinc-800">
          Flow
        </div>

        <nav className="flex flex-col gap-4 p-6 text-zinc-400">
          <Link to="/" onClick={() => setOpen(false)} className="hover:text-white transition">
            Tasks
          </Link>

          <Link to="/history" onClick={() => setOpen(false)} className="hover:text-white transition">
            History
          </Link>

          <Link to="/settings" onClick={() => setOpen(false)} className="hover:text-white transition">
            Settings
          </Link>
        </nav>
      </div>
    </>
  );
}

export default Sidebar;
