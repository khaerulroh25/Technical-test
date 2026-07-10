import { useState } from "react";
import { Outlet } from "react-router-dom";
import ChatButton from "../chat/ChatButton";
import Sidebar from "./Sidebar";
import Header from "./Header";

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 transition-colors dark:bg-gray-900">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen((prev) => !prev)}
      />

      <div className="min-h-screen lg:ml-64">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      <ChatButton />
    </div>
  );
}

export default AppLayout;
