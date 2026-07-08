import { Outlet } from "react-router-dom";
import ChatButton from "../chat/ChatButton";
import Sidebar from "./Sidebar";
import Header from "./Header";

function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="ml-64">
        <Header />

        <main className="p-6">
          <Outlet />
        </main>
      </div>

      <ChatButton />
    </div>
  );
}

export default AppLayout;
