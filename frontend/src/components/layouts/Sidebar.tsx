import { BarChart3, Database, LayoutDashboard, User } from "lucide-react";
import { NavLink } from "react-router-dom";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Dataset",
    path: "/dataset",
    icon: Database,
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex h-screen w-64 flex-col
          border-r border-gray-200 bg-white
          dark:border-gray-700 dark:bg-gray-900
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex h-20 items-center gap-3 border-b border-gray-200 px-6 dark:border-gray-700">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-white">
            <BarChart3 size={24} />
          </div>

          <span className="text-xl font-bold text-gray-900 dark:text-white">
            Data Analytics
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-colors ${
                    isActive
                      ? "bg-orange-50 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                  }`
                }
              >
                <Icon size={21} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
          <div className="flex items-center gap-3 rounded-xl p-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-500">
              <User size={20} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                Admin User
              </p>
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                admin@example.com
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
