import { useState } from "react";
import Topbar from "./Topbar";

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200">
      <Topbar setSidebarOpen={setSidebarOpen} />

      <main className="px-6">
        {children}
      </main>
    </div>
  );
}

export default Layout;
